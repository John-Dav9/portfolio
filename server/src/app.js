import express from "express";
import { randomUUID } from "node:crypto";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { adminEnabled, config } from "./config.js";
import { verifyPassword } from "./password.js";
import { COOKIE, cookieOptions, createSession, destroySession, isValidSession, readCookie } from "./sessions.js";
import { contactMessage, contentSchemas, testimonialSubmission, testimonialUpdate } from "./schemas.js";
import { deleteUpload, storeUpload, upload, UploadError } from "./uploads.js";
import { mailEnabled, notify } from "./mail.js";

const parseJson = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const testimonialRow = (row) => ({
  id: row.id,
  author_name: row.author_name,
  author_designation: parseJson(row.author_designation, ""),
  description: parseJson(row.description, {}),
  rating: row.rating,
  src: row.avatar,
  status: row.status,
  created_at: row.created_at,
});

export function createApp(db) {
  const app = express();
  app.disable("x-powered-by");
  // Requests arrive through the host nginx and the site container's nginx.
  app.set("trust proxy", "loopback, linklocal, uniquelocal");

  const readContent = (key) => parseJson(db.prepare("SELECT value FROM content WHERE key = ?").get(key)?.value, null);
  const writeContent = (key, value) =>
    db
      .prepare("INSERT INTO content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')")
      .run(key, JSON.stringify(value));

  const limiter = (limit, minutes) =>
    rateLimit({
      windowMs: minutes * 60 * 1000,
      limit,
      standardHeaders: "draft-8",
      legacyHeaders: false,
      message: { error: "Trop de tentatives. Réessayez plus tard." },
    });

  app.use((req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    if (req.path.startsWith("/api/")) res.set("Cache-Control", "no-store");
    next();
  });

  // CSRF: state-changing requests must come from the site itself.
  app.use("/api", (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
    if (!config.allowedOrigins.has(req.get("origin"))) return res.status(403).json({ error: "Origine non autorisée." });
    next();
  });
  app.use("/api", express.json({ limit: "256kb" }));

  app.use(
    "/uploads",
    express.static(config.uploadsDir, {
      immutable: true,
      maxAge: "365d",
      index: false,
      setHeaders: (res, file) => {
        if (file.endsWith(".pdf")) res.set("Content-Disposition", "inline");
      },
    })
  );

  app.get("/api/health", (req, res) => {
    db.prepare("SELECT 1").get();
    res.json({ ok: true });
  });

  // ---------- Public ----------
  app.get("/api/content", (req, res) => {
    const cv = readContent("cv") ?? {};
    const cvUrls = Object.fromEntries(
      Object.entries(cv).map(([profile, langs]) => [
        profile,
        Object.fromEntries(Object.entries(langs).map(([lang, file]) => [lang, file ? `/uploads/${file}` : ""])),
      ])
    );
    const testimonials = db
      .prepare("SELECT * FROM testimonials WHERE status = 'approved' ORDER BY sort, created_at")
      .all()
      .map(testimonialRow)
      .map(({ id, author_name, author_designation, description, rating, src }) => ({ id, author_name, author_designation, description, rating, src }));
    res.json({
      site: readContent("site"),
      skills: readContent("skills"),
      projects: readContent("projects"),
      texts: readContent("texts"),
      cv: cvUrls,
      testimonials,
    });
  });

  app.post("/api/contact", limiter(5, 10), (req, res) => {
    const data = contactMessage.parse(req.body);
    const id = randomUUID();
    db.prepare(
      "INSERT INTO messages (id, first_name, last_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(id, data.firstName, data.lastName, data.email, data.phone, data.subject, data.message);
    notify({
      subject: `Nouveau message – ${data.subject}`,
      replyTo: data.email,
      text: `De : ${data.firstName} ${data.lastName} <${data.email}>\nTéléphone : ${data.phone || "—"}\nSujet : ${data.subject}\n\n${data.message}`,
    });
    res.status(201).json({ id });
  });

  app.post("/api/testimonials", limiter(3, 60), (req, res) => {
    const data = testimonialSubmission.parse(req.body);
    const id = randomUUID();
    const description = { fr: "", en: "", [data.lang]: data.message };
    db.prepare(
      "INSERT INTO testimonials (id, author_name, author_designation, description, rating, status, sort) VALUES (?, ?, ?, ?, ?, 'pending', 1000)"
    ).run(id, data.authorName, JSON.stringify(data.authorDesignation), JSON.stringify(description), data.rating);
    notify({
      subject: `Nouvel avis à valider – ${data.authorName}`,
      text: `${data.authorName} (${data.authorDesignation || "—"}) – ${data.rating}/5\n\n${data.message}\n\nÀ valider dans l'espace admin.`,
    });
    res.status(201).json({ id });
  });

  // ---------- Admin ----------
  const admin = express.Router();

  admin.get("/status", (req, res) => {
    res.json({ enabled: adminEnabled(), authenticated: isValidSession(db, readCookie(req, COOKIE)), mail: mailEnabled() });
  });

  admin.post("/login", limiter(10, 15), async (req, res) => {
    if (!adminEnabled()) return res.status(503).json({ error: "Espace admin non configuré (voir server/.env)." });
    const { email, password } = z.object({ email: z.string().max(254), password: z.string().min(1).max(256) }).parse(req.body);
    const valid = await verifyPassword(password, config.admin.passwordHash);
    if (email.trim().toLowerCase() !== config.admin.email || !valid) {
      return res.status(401).json({ error: "E-mail ou mot de passe incorrect." });
    }
    const { token, expiresAt } = createSession(db);
    res.cookie(COOKIE, token, cookieOptions(expiresAt));
    res.json({ ok: true });
  });

  admin.post("/logout", (req, res) => {
    destroySession(db, readCookie(req, COOKIE));
    res.clearCookie(COOKIE, { path: "/" });
    res.sendStatus(204);
  });

  admin.use((req, res, next) => {
    if (!isValidSession(db, readCookie(req, COOKIE))) return res.status(401).json({ error: "Connexion requise." });
    next();
  });

  admin.get("/content", (req, res) => {
    res.json(Object.fromEntries(Object.keys(contentSchemas).map((key) => [key, readContent(key)])));
  });

  admin.put("/content/:key", (req, res) => {
    const schema = contentSchemas[req.params.key];
    if (!schema) return res.sendStatus(404);
    const value = schema.parse(req.body);
    writeContent(req.params.key, value);
    res.json(value);
  });

  admin.get("/messages", (req, res) => {
    res.json(db.prepare("SELECT * FROM messages ORDER BY created_at DESC").all());
  });
  admin.patch("/messages/:id", (req, res) => {
    const { read } = z.object({ read: z.boolean() }).parse(req.body);
    const result = db.prepare("UPDATE messages SET read_at = ? WHERE id = ?").run(read ? new Date().toISOString() : null, req.params.id);
    res.sendStatus(result.changes ? 204 : 404);
  });
  admin.delete("/messages/:id", (req, res) => {
    const result = db.prepare("DELETE FROM messages WHERE id = ?").run(req.params.id);
    res.sendStatus(result.changes ? 204 : 404);
  });

  admin.get("/testimonials", (req, res) => {
    res.json(db.prepare("SELECT * FROM testimonials ORDER BY status DESC, sort, created_at DESC").all().map(testimonialRow));
  });
  admin.patch("/testimonials/:id", (req, res) => {
    const patch = testimonialUpdate.parse(req.body);
    const columns = {
      status: patch.status,
      author_name: patch.authorName,
      author_designation: patch.authorDesignation && JSON.stringify(patch.authorDesignation),
      description: patch.description && JSON.stringify(patch.description),
      rating: patch.rating,
      avatar: patch.avatar,
    };
    const entries = Object.entries(columns).filter(([, value]) => value !== undefined);
    if (entries.length === 0) return res.sendStatus(400);
    const sql = `UPDATE testimonials SET ${entries.map(([column]) => `${column} = ?`).join(", ")} WHERE id = ?`;
    const result = db.prepare(sql).run(...entries.map(([, value]) => value), req.params.id);
    res.sendStatus(result.changes ? 204 : 404);
  });
  admin.delete("/testimonials/:id", (req, res) => {
    const result = db.prepare("DELETE FROM testimonials WHERE id = ?").run(req.params.id);
    res.sendStatus(result.changes ? 204 : 404);
  });

  admin.get("/uploads", (req, res) => {
    const rows = db.prepare("SELECT * FROM files ORDER BY created_at DESC").all();
    res.json(rows.map((row) => ({ ...row, url: `/uploads/${row.id}` })));
  });
  admin.post("/uploads", upload.single("file"), async (req, res) => {
    const kind = req.body.kind === "cv" ? "cv" : "image";
    res.status(201).json(await storeUpload(db, req.file, kind));
  });
  admin.delete("/uploads/:id", async (req, res) => {
    res.sendStatus((await deleteUpload(db, req.params.id)) ? 204 : 404);
  });

  app.use("/api/admin", admin);
  app.use("/api", (req, res) => res.status(404).json({ error: "Route inconnue." }));

  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Données invalides.", issues: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) });
    }
    if (error instanceof UploadError) return res.status(400).json({ error: error.message });
    if (error?.code === "LIMIT_FILE_SIZE") return res.status(413).json({ error: "Fichier trop volumineux (10 Mo max)." });
    if (error?.type === "entity.parse.failed") return res.status(400).json({ error: "JSON invalide." });
    console.error(error);
    res.status(500).json({ error: "Erreur serveur." });
  });

  return app;
}
