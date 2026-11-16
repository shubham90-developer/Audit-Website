import { Schema, model } from "mongoose";
import {
  ICON_KEYS,
  IWhatWeDoSection,
  IWhatWeDoService,
} from "./whatWeDo.interface";

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

const itemSchema = new Schema(
  {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false },
);

// ---- Section (heading, one document) ----
const sectionSchema = new Schema<IWhatWeDoSection>(
  {
    title: localizedString,
    colorTitle: localizedString,
    subtitle: localizedString,
    watermark: localizedString,
  },
  { timestamps: true },
);

export const WhatWeDoSection = model<IWhatWeDoSection>(
  "WhatWeDoSection",
  sectionSchema,
);

// ---- Services (one document per tab) ----
const serviceSchema = new Schema<IWhatWeDoService>(
  {
    name: localizedString,
    desc: localizedString,
    icon: { type: String, enum: [...ICON_KEYS], required: true },
    items: { type: [itemSchema], default: [] },
    image: {
      en: { type: [mediaSchema], default: [] },
      ar: { type: [mediaSchema], default: [] },
    },
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

serviceSchema.index({ order: 1 });

export const WhatWeDoService = model<IWhatWeDoService>(
  "WhatWeDoService",
  serviceSchema,
);
