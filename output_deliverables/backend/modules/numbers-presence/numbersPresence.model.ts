import { Schema, model } from "mongoose";
import {
  STAT_ICONS,
  STAT_COLORS,
  INumbersSection,
  INumbersStat,
  INumbersOffice,
} from "./numbersPresence.interface";

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

// ---- Section (rich text and backgrounds, one document) ----
const sectionSchema = new Schema<INumbersSection>(
  {
    numbersTitle: localizedString,
    securityTitle: localizedString,
    securityText: localizedString,
    insuranceText: localizedString,
    globalLabel: localizedString,
    globalTitle: localizedString,
    globalText: localizedString,
    sectionBg: localizedMedia,
    panelBg: localizedMedia,
  },
  { timestamps: true },
);

export const NumbersSection = model<INumbersSection>(
  "NumbersSection",
  sectionSchema,
);

// ---- Stats ----
const statSchema = new Schema<INumbersStat>(
  {
    icon: { type: String, enum: [...STAT_ICONS], required: true },
    color: { type: String, enum: [...STAT_COLORS], required: true },
    value: { type: Number, required: true, min: 0 },
    suffix: { type: String, default: "", trim: true, maxlength: 5 },
    label: localizedString,
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

statSchema.index({ order: 1 });

export const NumbersStat = model<INumbersStat>("NumbersStat", statSchema);

// ---- Offices ----
const officeSchema = new Schema<INumbersOffice>(
  {
    city: localizedString,
    country: localizedString,
    flagCode: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[a-z]{2}$/,
    },
    image: localizedMedia,
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

officeSchema.index({ order: 1 });

export const NumbersOffice = model<INumbersOffice>(
  "NumbersOffice",
  officeSchema,
);
