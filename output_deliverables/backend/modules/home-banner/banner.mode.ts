import { Schema, model } from "mongoose";
import { IBanner } from "./banner.interface";

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

const ctaSchema = new Schema(
  {
    label: localizedString,
    href: localizedString,
    variant: {
      type: String,
      enum: ["primary", "secondary"],
      required: true,
    },
  },
  { _id: false },
);

const ftaCardSchema = new Schema(
  {
    line1: localizedString,
    line2: localizedString,
    licenseNumber: localizedString,
  },
  { _id: false },
);

const partnerCardSchema = new Schema(
  {
    title: localizedString,
    subtitle: localizedString,
  },
  { _id: false },
);

const experienceCardSchema = new Schema(
  {
    value: localizedString,
    label: localizedString,
    tagline: localizedString,
  },
  { _id: false },
);

const reviewRatingSchema = new Schema(
  {
    platform: {
      type: String,
      enum: ["google", "trustpilot"],
      required: true,
    },
    score: { type: Number, required: true, min: 0, max: 5 },
    label: localizedString,
  },
  { _id: false },
);

const bannerSchema = new Schema<IBanner>(
  {
    establishmentYear: localizedString,

    titleHighlight: localizedString,
    titleRest: localizedString,
    intro: localizedString,
    speakLabel: localizedString,

    primaryCta: { type: ctaSchema, required: true },
    secondaryCta: { type: ctaSchema, required: true },

    ftaCard: { type: ftaCardSchema, required: true },
    partnerCard: { type: partnerCardSchema, required: true },
    experienceCard: { type: experienceCardSchema, required: true },
    reviewRatings: { type: [reviewRatingSchema], default: [] },

    trustedNote: localizedString,

    bgImages: localizedMedia,
    bgVideos: localizedMedia,
    posterImage: localizedMedia,
  },
  { timestamps: true },
);

export const Banner = model<IBanner>("Banner", bannerSchema);
