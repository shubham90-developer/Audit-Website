import { Schema, model } from "mongoose";
import { IIndustriesSection, IIndustryItem } from "./industries.interface";

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

const industriesSectionSchema = new Schema<IIndustriesSection>(
  {
    title: localizedString,
    colorTitle: localizedString,
    subtitle: localizedString,
    watermark: localizedString,
    bgImage: localizedMedia,
  },
  { timestamps: true }
);

const industryItemSchema = new Schema<IIndustryItem>(
  {
    title: localizedString,
    text: localizedString,
    icon: { type: String, default: "building" },
    image: localizedMedia,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const IndustriesSection = model<IIndustriesSection>("IndustriesSection", industriesSectionSchema);
export const IndustryItem = model<IIndustryItem>("IndustryItem", industryItemSchema);
