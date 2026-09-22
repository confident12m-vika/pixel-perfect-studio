import { Router } from "express";
import ContactSubmission from "../models/ContactSubmission.js";
import { requireAdmin } from "../middleware/auth.js";
import { sendMail } from "../utils/mailer.js";

const router = Router();

// ── reCAPTCHA v3 Verification ──────────────────────────────
async function verifyRecaptcha(token) {
  if (!token) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
    });
    const data = await res.json();
    console.log("[recaptcha] score:", data.score, "success:", data.success);
    return data.success && data.score >= 0.3;
  } catch {
    return false;
  }
}

// ── Beautiful Email Template ───────────────────────────────
function submissionEmailBody(submission) {
  const html = `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:600px;margin:auto;background:#0F1115;color:#ffffff;border-radius:8px;overflow:hidden;">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#1a1f2e 0%,#0F1115 100%);padding:32px 36px;border-bottom:2px solid #e8b86d;">
        <div style="font-size:11px;letter-spacing:4px;color:#e8b86d;text-transform:uppercase;margin-bottom:8px;">New Message</div>
        <h1 style="margin:0;font-size:24px;font-weight:300;color:#ffffff;letter-spacing:1px;">
          📨 New Request
        </h1>
        <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.45);">from ${submission.name}</p>
      </div>

      <!-- Body -->
      <div style="padding:28px 36px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
            <td style="padding:12px 0;font-size:10px;letter-spacing:2px;color:#e8b86d;text-transform:uppercase;width:120px;">Name</td>
            <td style="padding:12px 0;font-size:14px;color:rgba(255,255,255,0.85);">${submission.name}</td>
          </tr>
          <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
            <td style="padding:12px 0;font-size:10px;letter-spacing:2px;color:#e8b86d;text-transform:uppercase;">Email</td>
            <td style="padding:12px 0;font-size:14px;"><a href="mailto:${submission.email}" style="color:#e8b86d;">${submission.email}</a></td>
          </tr>
          ${submission.whatsapp ? `
          <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
            <td style="padding:12px 0;font-size:10px;letter-spacing:2px;color:#e8b86d;text-transform:uppercase;">WhatsApp</td>
            <td style="padding:12px 0;font-size:14px;color:rgba(255,255,255,0.85);">${submission.whatsapp}</td>
          </tr>` : ''}
          ${submission.websiteUrl ? `
          <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
            <td style="padding:12px 0;font-size:10px;letter-spacing:2px;color:#e8b86d;text-transform:uppercase;">Website</td>
            <td style="padding:12px 0;font-size:14px;"><a href="${submission.websiteUrl}" style="color:#e8b86d;">${submission.websiteUrl}</a></td>
          </tr>` : ''}
          <tr style="border-bottom:1px solid rgba(255,255,255,0.07);">
            <td style="padding:12px 0;font-size:10px;letter-spacing:2px;color:#e8b86d;text-transform:uppercase;">Language</td>
            <td style="padding:12px 0;font-size:14px;color:rgba(255,255,255,0.85);">${(submission.language || "en").toUpperCase()}</td>
          </tr>
        </table>

        ${submission.message ? `
        <div style="margin-top:20px;padding:16px 20px;background:rgba(232,184,109,0.07);border-left:3px solid #e8b86d;border-radius:0 4px 4px 0;">
          <div style="font-size:10px;letter-spacing:2px;color:#e8b86d;text-transform:uppercase;margin-bottom:8px;">Message</div>
          <p style="margin:0;font-size:14px;line-height:1.8;color:rgba(255,255,255,0.7);font-style:italic;">"${submission.message}"</p>
        </div>` : ''}

        <div style="margin-top:28px;text-align:center;">
          <a href="https://www.onepixelperfect.com/admin"
            style="display:inline-block;padding:12px 28px;background:#e8b86d;color:#0F1115;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;font-weight:600;border-radius:3px;">
            Open Admin Panel →
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding:16px 36px;border-top:1px solid rgba(255,255,255,0.07);text-align:center;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);letter-spacing:1px;">
          Pixel Perfect Studio · onepixelperfect.com
        </p>
      </div>
    </div>
  `;
  const text = `New request from ${submission.name}\nEmail: ${submission.email}\nMessage: ${submission.message}`;
  return { html, text };
}

// ── Public: submit contact form ────────────────────────────
router.post("/", async (req, res) => {
  const { name, email, message, whatsapp, websiteUrl, language, recaptchaToken } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }
  if (!message && !whatsapp && !websiteUrl) {
    return res.status(400).json({ error: "Please include a message, WhatsApp number, or website link" });
  }
  if ((message || "").length > 5000) {
    return res.status(400).json({ error: "Message is too long" });
  }

  // ── reCAPTCHA check (logging only) ──
  if (recaptchaToken) {
    verifyRecaptcha(recaptchaToken).then(ok => {
      console.log("[recaptcha]", ok ? "✅ human" : "⚠️ suspicious", "email:", email);
    }).catch(() => {});
  } else {
    console.warn("[recaptcha] no token — submission allowed (script may not be loaded)");
  }

  const submission = await ContactSubmission.create({
    name: name.trim(),
    email: email.trim(),
    message: (message || "").trim(),
    whatsapp: (whatsapp || "").trim(),
    websiteUrl: (websiteUrl || "").trim(),
    language: language || "en",
    lastReminderAt: new Date(),
  });

  // إيميل فوري عند استلام الطلب
  const { html, text } = submissionEmailBody(submission);
  sendMail({
    subject: `📨 New Request — ${submission.name}`,
    html,
    text,
  }).catch(() => {});

  res.status(201).json({ ok: true, id: submission._id });
});

// ── Admin: list submissions ────────────────────────────────
router.get("/", requireAdmin, async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const items = await ContactSubmission.find(filter).sort({ createdAt: -1 });
  res.json({ items });
});

// ── Admin: update status ───────────────────────────────────
router.patch("/:id", requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  const allowed = ["new", "read", "replied", "archived"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const item = await ContactSubmission.findByIdAndUpdate(
    req.params.id, { status }, { new: true }
  );
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

// ── Admin: delete submission ───────────────────────────────
router.delete("/:id", requireAdmin, async (req, res) => {
  const item = await ContactSubmission.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;