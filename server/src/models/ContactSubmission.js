import mongoose from "mongoose";

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    message: { type: String, trim: true, default: "" },
    whatsapp: { type: String, trim: true, default: "" },
    websiteUrl: { type: String, trim: true, default: "" },
    language: { type: String, default: "en" },
    status: {
      type: String,
      enum: ["new", "read", "replied", "archived"],
      default: "new",
    },
    lastReminderAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("ContactSubmission", contactSubmissionSchema);
