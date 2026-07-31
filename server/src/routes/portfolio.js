import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import Portfolio from "../models/Portfolio.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    cb(ok ? null : new Error("Only JPG, PNG or WEBP images are allowed"), ok);
  },
});

// Public: list published portfolio items, ordered
router.get("/", async (req, res) => {
  const includeUnpublished = req.query.all === "1";
  const filter = includeUnpublished ? {} : { published: true };
  const items = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
  res.json({ items });
});

// Admin: list everything (alias of GET / with ?all=1), kept for clarity
router.get("/admin", requireAdmin, async (_req, res) => {
  const items = await Portfolio.find().sort({ order: 1, createdAt: -1 });
  res.json({ items });
});

// Admin: upload an image, returns its public URL
router.post("/upload", requireAdmin, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Admin: create
router.post("/", requireAdmin, async (req, res) => {
  try {
    const item = await Portfolio.create(req.body);
    res.status(201).json({ item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: update
router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json({ item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: delete
router.delete("/:id", requireAdmin, async (req, res) => {
  const item = await Portfolio.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

export default router;
