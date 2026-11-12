import { Schema, model } from "mongoose";
import { IIndustries } from "./interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const media = {
  url: { type: String, default: "" },
  publicId: { type: String, default: "" },
};

const pointSchema = new Schema(localizedString, { _id: false });

const itemSchema = new Schema(
  {
    title: localizedString,
    description: localizedString,
    points: { type: [pointSchema], default: [] },
    image: {
      en: media,
      ar: media,
    },
  },
  { _id: false },
);

const industriesSchema = new Schema<IIndustries>(
  {
    label: localizedString,
    heading: localizedString,
    subtitle: localizedString,
    items: { type: [itemSchema], default: [] },
  },
  { timestamps: true },
);

export const Industries = model<IIndustries>("Industries", industriesSchema);
