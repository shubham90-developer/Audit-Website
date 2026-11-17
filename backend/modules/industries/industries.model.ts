import { Schema, model } from "mongoose";
import {
  INDUSTRY_ICONS,
  IIndustriesSection,
  IIndustry,
} from "./industries.interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const localizedMedia = {
  en: { type: [mediaSchema], default: [] },
  ar: { type: [mediaSchema], default: [] },
};

// ---- Section (one document) ----
const sectionSchema = new Schema<IIndustriesSection>(
  {
    watermark: localizedString,
    title: localizedString,
    description: localizedString,
    footerTitle: localizedString,
    footerNote: localizedString,
    footerIcon: { type: String, enum: [...INDUSTRY_ICONS], required: true },
    sectionBg: localizedMedia,
  },
  { timestamps: true },
);

// Model names differ from the old industries module on purpose, so this
// module starts with fresh collections and does not clash with old documents.
export const IndustriesSection = model<IIndustriesSection>(
  "IndustriesPageSection",
  sectionSchema,
);

// ---- Industries (cards) ----
const industrySchema = new Schema<IIndustry>(
  {
    icon: { type: String, enum: [...INDUSTRY_ICONS], required: true },
    title: localizedString,
    desc: localizedString,
    image: localizedMedia,
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

industrySchema.index({ order: 1 });

export const Industry = model<IIndustry>("IndustryEntry", industrySchema);
