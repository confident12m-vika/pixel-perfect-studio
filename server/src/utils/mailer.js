import { Resend } from "resend";

let resend = null;

function getClient() {
  if (resend) return resend;
  const { RESEND_API_KEY } = process.env;
  if (!RESEND_API_KEY) {
    console.warn("[mailer] RESEND_API_KEY not set — email notifications disabled");
    return null;
  }
  resend = new Resend(RESEND_API_KEY);
  return resend;
}

export async function sendMail({ subject, html, text }) {
  const client = getClient();
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.MAIL_FROM || "Pixel Perfect Studio <notifications@onepixelperfect.com>";
  if (!client || !to) return;

  try {
    const { error } = await client.emails.send({ from, to, subject, html, text });
    if (error) throw new Error(error.message || JSON.stringify(error));
    console.log(`[mailer] sent: ${subject}`);
  } catch (err) {
    console.error("[mailer] send failed:", err.message);
  }
}
