import nodemailer from "nodemailer";
import { config } from "./config.js";

let transport = null;
const { smtp } = config;
if (smtp.host && smtp.user && smtp.pass) {
  transport = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: { user: smtp.user, pass: smtp.pass },
  });
}

export const mailEnabled = () => transport !== null;

// Fire-and-forget notification: a mail failure never loses the stored message.
export function notify({ subject, text, replyTo }) {
  if (!transport || !smtp.notifyTo) return;
  transport
    .sendMail({ from: `"Portfolio" <${smtp.from}>`, to: smtp.notifyTo, replyTo, subject: `[Portfolio] ${subject}`, text })
    .catch((error) => console.error("Mail notification failed:", error.message));
}
