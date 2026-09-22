// ── Reminders disabled ──────────────────────────────────────
// Instant email notification is sent directly from contact.js
// when a new submission arrives. No periodic reminders needed.

export function startReminderJob() {
  console.log("[reminders] instant notification mode — no cron reminders");
}