import { Router } from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const ok = await admin.checkPassword(password);
  if (!ok) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { sub: admin._id.toString(), email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.json({ token, admin: { email: admin.email, name: admin.name } });
});

router.get("/me", requireAdmin, async (req, res) => {
  const admin = await Admin.findById(req.admin.sub).select("email name");
  if (!admin) return res.status(404).json({ error: "Not found" });
  res.json({ admin });
});

export default router;
