import { createHash, randomBytes } from "node:crypto";
import { config } from "./config.js";

export const COOKIE = "portfolio_admin";
const hash = (token) => createHash("sha256").update(token).digest("hex");

export function createSession(db) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = Date.now() + config.sessionHours * 3600 * 1000;
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(Date.now());
  db.prepare("INSERT INTO sessions (token_hash, expires_at) VALUES (?, ?)").run(hash(token), expiresAt);
  return { token, expiresAt };
}

export function isValidSession(db, token) {
  if (!token) return false;
  const row = db.prepare("SELECT expires_at FROM sessions WHERE token_hash = ?").get(hash(token));
  return Boolean(row && row.expires_at > Date.now());
}

export function destroySession(db, token) {
  if (token) db.prepare("DELETE FROM sessions WHERE token_hash = ?").run(hash(token));
}

export function readCookie(req, name) {
  const header = req.headers.cookie || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function cookieOptions(expiresAt) {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: config.production,
    path: "/",
    expires: new Date(expiresAt),
  };
}
