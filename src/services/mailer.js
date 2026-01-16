/**
 * Mailer Module
 *
 * Sends AI Daily Calendar via SMTP
 * Can be conditionally disabled via FEATURE_EMAIL flag
 */

import { sendDailyEmail as sendEmail } from "./email.js";

export async function mailer({ date, markdown, to }) {
  const FEATURE_EMAIL = process.env.FEATURE_EMAIL === "true";
  if (!FEATURE_EMAIL) {
    console.log("📧 FEATURE_EMAIL=false → skipping email");
    return;
  }

  await sendEmail({ date, markdown, to });
}
