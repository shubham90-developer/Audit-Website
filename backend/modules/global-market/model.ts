import { Schema, model } from "mongoose";
import { IGlobalMarketsSection, IGlobalMarket } from "./interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
  },
  { _id: false },
);

const localizedMedia = {
  en: { type: [mediaSchema], default: [] },
  ar: { type: [mediaSchema], default: [] },
};

// Main section schema
const globalMarketsSectionSchema = new Schema<IGlobalMarketsSection>(
  {
    badge: localizedString,
    title: localizedString,
    highlightedTitle: localizedString,
    description: localizedString,
    sideTitle: localizedString,
    bgImage: localizedMedia,
  },
  { timestamps: true },
);

// Country cards schema
const globalMarketSchema = new Schema<IGlobalMarket>(
  {
    title: localizedString,
    image: localizedMedia,
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

globalMarketSchema.index({ order: 1 });

export const GlobalMarketsSection = model<IGlobalMarketsSection>(
  "GlobalMarketsSection",
  globalMarketsSectionSchema,
);

export const GlobalMarket = model<IGlobalMarket>(
  "GlobalMarket",
  globalMarketSchema,
);
