/**
 * Email Notifier
 *
 * Sends AI Daily Calendar via SMTP email.
 */

import nodemailer from "nodemailer";
import fs from "fs";

/**
 * Create SMTP transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false, // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Basic Markdown → HTML conversion
 * (intentionally simple & dependency-free)
 *
 * @param {string} markdown
 * @returns {string}
 */
function markdownToHtml(markdown) {
  return markdown
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/\n---\n/gim, "<hr/>")
    .replace(/\n/g, "<br/>");
}

/**
 * Send email with markdown content
 *
 * @param {Object} options
 * @param {string} options.date
 * @param {string} options.markdown
 * @param {string[]} options.to
 */
export async function sendDailyEmail({ date, markdown, to }) {
  if (!markdown || !to?.length) {
    console.warn("Email skipped: missing content or recipients");
    return;
  }

  const transporter = createTransporter();

  const htmlContent = markdownToHtml(markdown);

  const mailOptions = {
    from: `"AI Daily Calendar" <${process.env.SMTP_USER}>`,
    to: to.join(","),
    subject: `🧠 AI Daily Calendar — ${date}`,
    html: htmlContent,
    text: markdown
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    // ❗ Do NOT throw — email failure should not break pipeline
  }
}
