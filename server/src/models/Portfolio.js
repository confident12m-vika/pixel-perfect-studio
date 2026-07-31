import mongoose from "mongoose";

const localizedStringSchema = {
  en: { type: String, required: true, default: "" },
  ar: { type: String, required: true, default: "" },
  es: { type: String, required: true, default: "" },
  ru: { type: String, required: true, default: "" },
};

const portfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: localizedStringSchema,
    description: localizedStringSchema,
    image: { type: String, required: true }, // URL or /uploads/<file>
    projectUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);
