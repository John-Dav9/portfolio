import path from "node:path";

const production = process.env.NODE_ENV === "production";
const dataDir = path.resolve(process.env.DATA_DIR || "./data");
const siteOrigin = (process.env.SITE_ORIGIN || "http://localhost:5173").replace(/\/$/, "");

export const config = {
  production,
  port: Number(process.env.PORT || 3001),
  dataDir,
  dbFile: path.join(dataDir, "portfolio.db"),
  uploadsDir: path.join(dataDir, "uploads"),
  backupsDir: path.join(dataDir, "backups"),
  seedDir: path.resolve(process.env.SEED_DIR || "../src"),
  // Origins allowed to send state-changing requests (CSRF protection).
  allowedOrigins: new Set([siteOrigin, ...(production ? [] : ["http://localhost:5173", "http://localhost:4173"])]),
  admin: {
    email: (process.env.ADMIN_EMAIL || "").trim().toLowerCase(),
    passwordHash: process.env.ADMIN_PASSWORD_HASH || "",
  },
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 465),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || process.env.SMTP_USER || "",
    notifyTo: process.env.NOTIFY_TO || process.env.SMTP_USER || "",
  },
  sessionHours: 8,
};

export const adminEnabled = () => Boolean(config.admin.email && config.admin.passwordHash);
