import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("[mailer] SMTP_USER/SMTP_PASS not set — email notifications disabled");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4, // force IPv4 — Render can't reach Gmail over IPv6
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  
  return transporter;
}

export async function sendMail({ subject, html, text }) {
  const t = getTransporter();
  const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
  if (!t || !to) return;

  try {
    await t.sendMail({
      from: `"Pixel Perfect Studio" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    console.log(`[mailer] sent: ${subject}`);
  } catch (err) {
    console.error("[mailer] send failed:", err.message);
  }
}
