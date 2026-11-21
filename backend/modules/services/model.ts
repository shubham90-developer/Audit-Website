import { Schema, model } from "mongoose";
import { IService, IServicesBanner } from "./interface";

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

const detailSchema = new Schema(
  {
    title: localizedString,
    description: localizedString,
    img: localizedMedia,
  },
  { _id: true },
);

const serviceSchema = new Schema<IService>(
  {
    title: localizedString,
    desc: localizedString,

    iconImg: localizedMedia,
    cardImg: localizedMedia,
    mainImg: localizedMedia,

    // NEW FIELDS
    bgImage: localizedMedia,
    bgVideo: localizedMedia,

    details: {
      type: [detailSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const Service = model<IService>("Service", serviceSchema);

// Singleton document: the banner shown at the top of the /services page.
const servicesBannerSchema = new Schema<IServicesBanner>(
  {
    title: localizedString,
    subtitle: localizedString,
    bgImage: localizedMedia,
  },
  { timestamps: true },
);

export const ServicesBanner = model<IServicesBanner>(
  "ServicesBanner",
  servicesBannerSchema,
);
