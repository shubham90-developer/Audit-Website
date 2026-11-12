import { Schema, model } from "mongoose";
import { IContactBanner } from "./intrface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const media = {
  url: { type: String, default: "" },
  publicId: { type: String, default: "" },
};

const localizedImage = {
  en: media,
  ar: media,
};

const contactBannerSchema = new Schema<IContactBanner>(
  {
    header: localizedString,
    title: localizedString,
    description: localizedString,
    image1: localizedImage,
    image2: localizedImage,
    image3: localizedImage,
  },
  { timestamps: true },
);

export const ContactBanner = model<IContactBanner>(
  "ContactBanner",
  contactBannerSchema,
);
