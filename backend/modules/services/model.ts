import { Schema, model } from "mongoose";
import { IWhatWeDo } from "./interface";

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
    image: {
      en: media,
      ar: media,
    },
  },
  { _id: false },
);

const whatWeDoSchema = new Schema<IWhatWeDo>(
  {
    label: localizedString,
    heading: localizedString,
    items: { type: [itemSchema], default: [] },
  },
  { timestamps: true },
);

export const WhatWeDo = model<IWhatWeDo>("WhatWeDo", whatWeDoSchema);
