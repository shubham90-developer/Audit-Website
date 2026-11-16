import { Schema, model } from "mongoose";
import { IInsight } from "./insights.interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const optionalLocalizedString = {
  en: { type: String, default: "", trim: true },
  ar: { type: String, default: "", trim: true },
};

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const insightSchema = new Schema<IInsight>(
  {
    type: { type: String, enum: ["blog", "press", "video"], default: "blog", index: true },
    title: localizedString,
    excerpt: localizedString,
    content: optionalLocalizedString,
    category: localizedString,
    tag: optionalLocalizedString,
    author: {
      en: { type: String, default: "Ahmed Al Mazroei" },
      ar: { type: String, default: "أحمد المزروعي" },
    },
    authorImage: { type: mediaSchema, required: false },
    reviewedBy: optionalLocalizedString,
    readTime: {
      en: { type: String, default: "5 minutes" },
      ar: { type: String, default: "5 دقائق" },
    },
    date: { type: String, required: true },
    slug: { type: String, required: true, unique: true, trim: true },
    media: { type: mediaSchema, required: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

insightSchema.index({ type: 1, featured: 1, order: 1 });

export const Insight = model<IInsight>("Insight", insightSchema);
