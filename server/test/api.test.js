import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), "portfolio-api-"));
const ORIGIN = "https://john-d.dev";
Object.assign(process.env, {
  NODE_ENV: "test",
  DATA_DIR: dataDir,
  SEED_DIR: path.resolve(import.meta.dirname, "../../src"),
  SITE_ORIGIN: ORIGIN,
  ADMIN_EMAIL: "admin@example.com",
});

const { hashPassword } = await import("../src/password.js");
process.env.ADMIN_PASSWORD_HASH = await hashPassword("correct horse battery");
const { openDatabase } = await import("../src/db.js");
const { createApp } = await import("../src/app.js");

let server;
let base;
let cookie = "";

const request = async (method, url, { body, origin = ORIGIN, auth = false, form } = {}) => {
  const headers = { origin };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (auth) headers.cookie = cookie;
  const res = await fetch(base + url, { method, headers, body: form ?? (body !== undefined ? JSON.stringify(body) : undefined) });
  const text = await res.text();
  return { status: res.status, headers: res.headers, body: text ? JSON.parse(text) : null };
};

before(async () => {
  const db = openDatabase(path.join(dataDir, "test.db"));
  server = createApp(db).listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => {
  server.close();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

describe("password hashing", () => {
  it("produces a hash without $ so it survives Docker Compose .env interpolation", async () => {
    const { verifyPassword } = await import("../src/password.js");
    const stored = await hashPassword("un mot de passe solide");
    assert.doesNotMatch(stored, /\$/);
    assert.equal(await verifyPassword("un mot de passe solide", stored), true);
    assert.equal(await verifyPassword("autre", stored), false);
  });
});

const login = async () => {
  const res = await request("POST", "/api/admin/login", { body: { email: "Admin@example.com", password: "correct horse battery" } });
  assert.equal(res.status, 200);
  cookie = res.headers.get("set-cookie").split(";")[0];
  assert.match(res.headers.get("set-cookie"), /HttpOnly/i);
  assert.match(res.headers.get("set-cookie"), /SameSite=Strict/i);
};

describe("public API", () => {
  it("serves seeded content with approved testimonials only", async () => {
    const { status, body } = await request("GET", "/api/content");
    assert.equal(status, 200);
    assert.equal(body.skills.length, 8);
    const seed = JSON.parse(fs.readFileSync(path.join(process.env.SEED_DIR, "data/index.json"), "utf8"));
    assert.equal(body.projects.length, seed.portfolio.length);
    assert.ok(body.projects.every((p) => Array.isArray(p.stack)));
    assert.equal(body.testimonials.length, 4);
    assert.ok(body.texts.fr["hero.pitch.dev"]);
    assert.equal(body.site.emailjs, undefined);
    assert.deepEqual(body.cv.dev, { fr: "", en: "" });
  });

  it("stores contact messages and rejects cross-origin posts", async () => {
    const message = { firstName: "Ada", lastName: "Lovelace", email: "ada@example.com", subject: "Freelance", message: "Bonjour", consent: true };
    assert.equal((await request("POST", "/api/contact", { body: message, origin: "https://evil.example" })).status, 403);
    assert.equal((await request("POST", "/api/contact", { body: { ...message, consent: false } })).status, 400);
    assert.equal((await request("POST", "/api/contact", { body: { ...message, website: "spam" } })).status, 400);
    assert.equal((await request("POST", "/api/contact", { body: message })).status, 201);
  });

  it("keeps submitted testimonials pending until approved", async () => {
    const res = await request("POST", "/api/testimonials", {
      body: { authorName: "Grace Hopper", rating: 5, message: "Excellent travail, très professionnel.", lang: "fr", consent: true },
    });
    assert.equal(res.status, 201);
    const { body } = await request("GET", "/api/content");
    assert.equal(body.testimonials.length, 4);
  });
});

describe("admin API", () => {
  it("refuses unauthenticated access and wrong passwords", async () => {
    assert.equal((await request("GET", "/api/admin/messages")).status, 401);
    const bad = await request("POST", "/api/admin/login", { body: { email: "admin@example.com", password: "nope" } });
    assert.equal(bad.status, 401);
  });

  it("lists messages and approves testimonials", async () => {
    await login();
    const messages = await request("GET", "/api/admin/messages", { auth: true });
    assert.equal(messages.body.length, 1);
    assert.equal((await request("PATCH", `/api/admin/messages/${messages.body[0].id}`, { auth: true, body: { read: true } })).status, 204);

    const list = await request("GET", "/api/admin/testimonials", { auth: true });
    const pending = list.body.find((t) => t.status === "pending");
    assert.equal(pending.author_name, "Grace Hopper");
    assert.equal((await request("PATCH", `/api/admin/testimonials/${pending.id}`, { auth: true, body: { status: "approved" } })).status, 204);
    const { body } = await request("GET", "/api/content");
    assert.equal(body.testimonials.length, 5);
  });

  it("validates and saves content edits", async () => {
    const { body: all } = await request("GET", "/api/admin/content", { auth: true });
    const site = { ...all.site, socialLinks: { ...all.site.socialLinks, twitter: "javascript:alert(1)" } };
    assert.equal((await request("PUT", "/api/admin/content/site", { auth: true, body: site })).status, 400);
    site.socialLinks.twitter = "https://x.com/example";
    assert.equal((await request("PUT", "/api/admin/content/site", { auth: true, body: site })).status, 200);
    const { body } = await request("GET", "/api/content");
    assert.equal(body.site.socialLinks.twitter, "https://x.com/example");
  });

  it("stores project technologies and rejects oversized ones", async () => {
    const { body: all } = await request("GET", "/api/admin/content", { auth: true });
    const projects = all.projects.map((p, i) => (i === 0 ? { ...p, stack: ["React", "Node.js"] } : p));
    assert.equal((await request("PUT", "/api/admin/content/projects", { auth: true, body: projects })).status, 200);
    const { body } = await request("GET", "/api/content");
    assert.deepEqual(body.projects[0].stack, ["React", "Node.js"]);
    const tooMany = projects.map((p, i) => (i === 0 ? { ...p, stack: Array.from({ length: 13 }, (_, n) => `T${n}`) } : p));
    assert.equal((await request("PUT", "/api/admin/content/projects", { auth: true, body: tooMany })).status, 400);
  });

  it("accepts PDF CVs, rejects disguised files and serves uploads", async () => {
    const fake = new FormData();
    fake.append("kind", "cv");
    fake.append("file", new Blob(["<html>not a pdf</html>"], { type: "application/pdf" }), "cv.pdf");
    assert.equal((await request("POST", "/api/admin/uploads", { auth: true, form: fake })).status, 400);

    const pdf = new FormData();
    pdf.append("kind", "cv");
    pdf.append("file", new Blob(["%PDF-1.4\n%fake minimal pdf\n"], { type: "application/pdf" }), "cv.pdf");
    const uploaded = await request("POST", "/api/admin/uploads", { auth: true, form: pdf });
    assert.equal(uploaded.status, 201);

    const cv = { dev: { fr: uploaded.body.id, en: null }, data: { fr: null, en: null } };
    assert.equal((await request("PUT", "/api/admin/content/cv", { auth: true, body: cv })).status, 200);
    const { body } = await request("GET", "/api/content");
    assert.equal(body.cv.dev.fr, `/uploads/${uploaded.body.id}`);

    const file = await fetch(base + body.cv.dev.fr);
    assert.equal(file.status, 200);
    assert.match(file.headers.get("cache-control"), /immutable/);
  });

  it("logs out", async () => {
    assert.equal((await request("POST", "/api/admin/logout", { auth: true })).status, 204);
    assert.equal((await request("GET", "/api/admin/messages", { auth: true })).status, 401);
  });
});
