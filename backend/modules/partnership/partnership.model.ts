import { Schema, model } from "mongoose";
import { IPartner } from "./partnership.interface";

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

const partnerSchema = new Schema<IPartner>(
  {
    title: localizedString,
    text: localizedString,
    logo: {
      en: { type: [mediaSchema], default: [] },
      ar: { type: [mediaSchema], default: [] },
    },
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

partnerSchema.index({ order: 1 });

export const Partner = model<IPartner>("Partner", partnerSchema);
