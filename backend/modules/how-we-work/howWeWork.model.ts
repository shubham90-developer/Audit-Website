import { Schema, model } from "mongoose";
import {
  STEP_ICONS,
  IHowWeWorkSection,
  IHowWeWorkStep,
} from "./howWeWork.interface";

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

// ---- Section (heading and photo, one document) ----
const sectionSchema = new Schema<IHowWeWorkSection>(
  {
    title: localizedString,
    colorTitle: localizedString,
    subtitle: localizedString,
    watermark: localizedString,
    image: {
      en: { type: [mediaSchema], default: [] },
      ar: { type: [mediaSchema], default: [] },
    },
  },
  { timestamps: true },
);

export const HowWeWorkSection = model<IHowWeWorkSection>(
  "HowWeWorkSection",
  sectionSchema,
);

// ---- Steps (one document per step) ----
const stepSchema = new Schema<IHowWeWorkStep>(
  {
    title: localizedString,
    desc: localizedString,
    icon: { type: String, enum: [...STEP_ICONS], required: true },
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

stepSchema.index({ order: 1 });

export const HowWeWorkStep = model<IHowWeWorkStep>(
  "HowWeWorkStep",
  stepSchema,
);
