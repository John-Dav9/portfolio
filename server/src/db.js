import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { config } from "./config.js";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  read_at TEXT
);
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_designation TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  avatar TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  sort INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('image', 'cv')),
  original_name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS messages_created ON messages (created_at DESC);
CREATE INDEX IF NOT EXISTS testimonials_status ON testimonials (status, sort);
`;

// Strings the admin can edit, copied from the locale files on first start.
export const EDITABLE_TEXTS = [
  "hero.status",
  "hero.role.dev",
  "hero.role.data",
  "hero.pitch.dev",
  "hero.pitch.data",
  "hero.description_continued",
  "about.description1",
  "about.description2",
  "contact.description",
];

const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const pick = (obj, dotted) => dotted.split(".").reduce((acc, key) => acc?.[key], obj);

function seedContent() {
  const { seedDir } = config;
  const site = readJson(path.join(seedDir, "data/site.json"));
  const data = readJson(path.join(seedDir, "data/index.json"));
  const locales = { fr: readJson(path.join(seedDir, "locales/fr.json")), en: readJson(path.join(seedDir, "locales/en.json")) };

  const { emailjs: _emailjs, cv: _cv, ...publicSite } = site;
  const texts = Object.fromEntries(
    Object.entries(locales).map(([lang, strings]) => [lang, Object.fromEntries(EDITABLE_TEXTS.map((key) => [key, pick(strings, key) ?? ""]))])
  );
  return {
    data,
    content: {
      site: publicSite,
      skills: data.skills,
      projects: data.portfolio,
      timeline: data.timeline ?? [],
      texts,
      cv: { dev: { fr: null, en: null }, data: { fr: null, en: null } },
    },
  };
}

function seed(db) {
  const { data, content } = seedContent();

  const insertContent = db.prepare("INSERT INTO content (key, value) VALUES (?, ?)");
  const insertTestimonial = db.prepare(
    "INSERT INTO testimonials (id, author_name, author_designation, description, rating, avatar, status, sort) VALUES (?, ?, ?, ?, ?, ?, 'approved', ?)"
  );
  db.exec("BEGIN");
  try {
    for (const [key, value] of Object.entries(content)) insertContent.run(key, JSON.stringify(value));
    data.testimonials.forEach((item, index) => {
      insertTestimonial.run(
        randomUUID(),
        item.author_name,
        JSON.stringify(item.author_designation ?? ""),
        JSON.stringify(item.description),
        item.rating,
        item.src ?? "",
        index
      );
    });
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function openDatabase(file = config.dbFile) {
  if (file !== ":memory:") fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec(SCHEMA);
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM content").get();
  if (count === 0) {
    seed(db);
  } else {
    // Sections added after the first start are filled from the repository; existing ones are untouched.
    const insert = db.prepare("INSERT OR IGNORE INTO content (key, value) VALUES (?, ?)");
    for (const [key, value] of Object.entries(seedContent().content)) insert.run(key, JSON.stringify(value));
  }
  return db;
}
