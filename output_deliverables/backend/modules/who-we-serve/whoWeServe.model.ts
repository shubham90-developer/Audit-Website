import { Schema, model } from "mongoose";
import {
  CARD_KINDS,
  IWhoWeServeSection,
  IWhoWeServeCard,
} from "./whoWeServe.interface";

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

// ---- Section (headings and background, one document) ----
const sectionSchema = new Schema<IWhoWeServeSection>(
  {
    pillTitle: localizedString,
    pillHighlight: localizedString,
    whyTitle: localizedString,
    brandName: localizedString,
    whyIntroStart: localizedString,
    whyIntroBold: localizedString,
    whyIntroEnd: localizedString,
    leftBg: localizedMedia,
  },
  { timestamps: true },
);

export const WhoWeServeSection = model<IWhoWeServeSection>(
  "WhoWeServeSection",
  sectionSchema,
);

// ---- Cards (serve cards and why cards) ----
const cardSchema = new Schema<IWhoWeServeCard>(
  {
    kind: { type: String, enum: [...CARD_KINDS], required: true },
    title: localizedString,
    text: localizedString,
    image: localizedMedia,
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

cardSchema.index({ kind: 1, order: 1 });

export const WhoWeServeCard = model<IWhoWeServeCard>(
  "WhoWeServeCard",
  cardSchema,
);
