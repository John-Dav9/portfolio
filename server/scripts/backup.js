// Consistent snapshot of the database (safe while the API runs): data/backups/portfolio-<date>.db
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { config } from "../src/config.js";

fs.mkdirSync(config.backupsDir, { recursive: true });
const target = path.join(config.backupsDir, `portfolio-${new Date().toISOString().replace(/[:.]/g, "-")}.db`);
const db = new DatabaseSync(config.dbFile);
db.prepare("VACUUM INTO ?").run(target);
db.close();

// Keep the 14 most recent snapshots.
const old = fs.readdirSync(config.backupsDir).filter((f) => f.endsWith(".db")).sort().reverse().slice(14);
old.forEach((f) => fs.rmSync(path.join(config.backupsDir, f)));
console.log(`Backup written: ${target}`);
