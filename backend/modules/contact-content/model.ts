import { Schema, model } from "mongoose";
import type { ContactContent } from "./interface";
const localized = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};
const media = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
  },
  { _id: false },
);
const localizedMedia = {
  en: { type: [media], default: [] },
  ar: { type: [media], default: [] },
};
const card = new Schema({
  key: {
    type: String,
    enum: ["phone", "email", "whatsapp", "address"],
    required: true,
  },
  label: localized,
  value: localized,
  href: { type: String, default: "" },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});
const feature = new Schema({
  icon: {
    type: String,
    enum: ["headphones", "clock", "users", "shield"],
    default: "headphones",
  },
  title: localized,
  description: localized,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});
const schema = new Schema<ContactContent>(
  {
    heroBadge: localized,
    heroTitle: localized,
    heroHighlight: localized,
    heroDescription: localized,
    heroBgImage: localizedMedia,
    heroVideo: localizedMedia,
    contactCards: { type: [card], default: [] },
    sectionBadge: localized,
    sectionTitle: localized,
    sectionHighlight: localized,
    sectionDescription: localized,
    sectionNote: localized,
    sectionBgImage: localizedMedia,
    features: { type: [feature], default: [] },
    formTitle: localized,
    formDescription: localized,
    formDisclaimer: localized,
  },
  { timestamps: true },
);
export const ContactContentModel = model<ContactContent>(
  "ContactPageContent",
  schema,
);
