import { Schema, model } from "mongoose";
import { IWhyChooseUs, WHY_ICONS } from "./interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const media = {
  url: { type: String, default: "" },
  publicId: { type: String, default: "" },
};

const itemSchema = new Schema(
  {
    title: localizedString,
    description: localizedString,
    icon: { type: String, enum: WHY_ICONS, required: true },
  },
  { _id: false },
);

const whyChooseUsSchema = new Schema<IWhyChooseUs>(
  {
    singleton: { type: Boolean, default: true, unique: true, immutable: true },
    label: localizedString,
    heading: localizedString,
    centerImage: {
      en: media,
      ar: media,
    },
    items: {
      type: [itemSchema],
      default: [],
      validate: {
        validator: (v: unknown[]) => v.length <= WHY_ICONS.length,
        message: `A maximum of ${WHY_ICONS.length} items is allowed`,
      },
    },
  },
  { timestamps: true },
);

export const WhyChooseUs = model<IWhyChooseUs>(
  "WhyChooseUs",
  whyChooseUsSchema,
);
