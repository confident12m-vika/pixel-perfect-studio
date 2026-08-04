import cron from "node-cron";
import ContactSubmission from "../models/ContactSubmission.js";
import { sendMail } from "./mailer.js";

const REMINDER_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours

async function checkReminders() {
  const cutoff = new Date(Date.now() - REMINDER_INTERVAL_MS);
  const pending = await ContactSubmission.find({
    status: "new",
    $or: [{ lastReminderAt: null }, { lastReminderAt: { $lte: cutoff } }],
  });

  for (const submission of pending) {
    const hoursWaiting = Math.round((Date.now() - submission.createdAt) / (60 * 60 * 1000));
    const html = `
      <h2>⏰ Reminder: unanswered request from ${submission.name}</h2>
      <p>This request has been waiting <strong>${hoursWaiting} hours</strong> without a reply.</p>
      <table cellpadding="6">
        <tr><td><strong>Name</strong></td><td>${submission.name}</td></tr>
        <tr><td><strong>Email</strong></td><td>${submission.email}</td></tr>
        <tr><td><strong>WhatsApp</strong></td><td>${submission.whatsapp || "—"}</td></tr>
        <tr><td><strong>Website</strong></td><td>${submission.websiteUrl || "—"}</td></tr>
        <tr><td><strong>Message</strong></td><td>${submission.message || "—"}</td></tr>
      </table>
      <p>Open the admin panel to reply: <a href="https://www.onepixelperfect.com/admin">onepixelperfect.com/admin</a></p>
    `;
    await sendMail({
      subject: `⏰ Reminder: ${submission.name} is still waiting (${hoursWaiting}h)`,
      html,
    });
    submission.lastReminderAt = new Date();
    await submission.save();
  }

  if (pending.length) {
    console.log(`[reminders] sent ${pending.length} reminder email(s)`);
  }
}

export function startReminderJob() {
  // Run every 15 minutes; each submission still only gets a reminder every 3 hours
  // (tracked via lastReminderAt), so this just controls how promptly a newly-due
  // reminder goes out, not how often any one client is reminded.
  cron.schedule("*/15 * * * *", () => {
    checkReminders().catch((err) => console.error("[reminders] check failed:", err.message));
  });
  console.log("[reminders] job scheduled (checks every 15 min, reminds every 3h per request)");
}
