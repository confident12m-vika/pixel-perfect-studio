// Run once with: npm run seed:admin
// Reads ADMIN_EMAIL / ADMIN_PASSWORD from .env and creates (or updates)
// that admin account so you can log in to /admin/login.
import "dotenv/config";
import { connectDB } from "./config/db.js";
import Admin from "./models/Admin.js";
import mongoose from "mongoose";

async function run() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first.");
    process.exit(1);
  }

  await connectDB();

  const passwordHash = await Admin.hashPassword(password);
  const admin = await Admin.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { email: email.toLowerCase().trim(), passwordHash },
    { upsert: true, new: true }
  );

  console.log(`Admin ready: ${admin.email}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
