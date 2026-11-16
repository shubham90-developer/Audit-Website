import { Schema, model } from "mongoose";
import { IWhyUsSection, IWhyUsCard } from "./whyUs.interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const localizedMedia = {
  en: { type: [mediaSchema], default: [] },
  ar: { type: [mediaSchema], default: [] },
};

const whyUsSectionSchema = new Schema<IWhyUsSection>(
  {
    label: localizedString,
    title: localizedString,
    watermark: localizedString,
    centerImage: localizedMedia,
  },
  { timestamps: true }
);

const whyUsCardSchema = new Schema<IWhyUsCard>(
  {
    title: localizedString,
    text: localizedString,
    icon: { type: String, default: "shield" },
    side: { type: String, enum: ["left", "right"], required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const WhyUsSection = model<IWhyUsSection>("WhyUsSection", whyUsSectionSchema);
export const WhyUsCard = model<IWhyUsCard>("WhyUsCard", whyUsCardSchema);
