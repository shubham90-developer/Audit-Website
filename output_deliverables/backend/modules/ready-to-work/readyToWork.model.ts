import { Schema, model } from "mongoose";
import {
  FEATURE_ICONS,
  IReadyToWorkSection,
  IReadyToWorkFeature,
} from "./readyToWork.interface";

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

// ---- Section (one document) ----
const sectionSchema = new Schema<IReadyToWorkSection>(
  {
    title: localizedString,
    highlight: localizedString,
    description: localizedString,
    buttonLabel: localizedString,
    buttonHref: { type: String, required: true, trim: true },
    tagOne: localizedString,
    tagTwo: localizedString,
    bgImage: {
      en: { type: [mediaSchema], default: [] },
      ar: { type: [mediaSchema], default: [] },
    },
  },
  { timestamps: true },
);

export const ReadyToWorkSection = model<IReadyToWorkSection>(
  "ReadyToWorkSection",
  sectionSchema,
);

// ---- Features (bottom cards) ----
const featureSchema = new Schema<IReadyToWorkFeature>(
  {
    icon: { type: String, enum: [...FEATURE_ICONS], required: true },
    label: localizedString,
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

featureSchema.index({ order: 1 });

export const ReadyToWorkFeature = model<IReadyToWorkFeature>(
  "ReadyToWorkFeature",
  featureSchema,
);
