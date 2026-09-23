import { adminEnabled, config } from "./config.js";
import { openDatabase } from "./db.js";
import { createApp } from "./app.js";
import { mailEnabled } from "./mail.js";

const db = openDatabase();
const server = createApp(db).listen(config.port, () => {
  console.log(`API listening on :${config.port} (admin ${adminEnabled() ? "on" : "off"}, mail ${mailEnabled() ? "on" : "off"})`);
});

const shutdown = () => server.close(() => {
  db.close();
  process.exit(0);
});
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
