import { Router } from "express";
import ContactSubmission from "../models/ContactSubmission.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

// Public: submit the contact form
router.post("/", async (req, res) => {
  const { name, email, message, whatsapp, websiteUrl, language } = req.body || {};

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
  // Simple honeypot / length guard against spam bots
  if ((message || "").length > 5000) {
    return res.status(400).json({ error: "Message is too long" });
  }

  const submission = await ContactSubmission.create({
    name: name.trim(),
    email: email.trim(),
    message: (message || "").trim(),
    whatsapp: (whatsapp || "").trim(),
    websiteUrl: (websiteUrl || "").trim(),
    language: language || "en",
  });

  res.status(201).json({ ok: true, id: submission._id });
});

// Admin: list submissions, newest first
router.get("/", requireAdmin, async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const items = await ContactSubmission.find(filter).sort({ createdAt: -1 });
  res.json({ items });
});

// Admin: update status (new / read / replied / archived)
router.patch("/:id", requireAdmin, async (req, res) => {
  const { status } = req.body || {};
  const allowed = ["new", "read", "replied", "archived"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  const item = await ContactSubmission.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

// Admin: delete a submission
router.delete("/:id", requireAdmin, async (req, res) => {
  const item = await ContactSubmission.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
