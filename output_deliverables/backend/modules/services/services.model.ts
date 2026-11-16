import { Schema, model } from "mongoose";
import { IServiceCategory, IServiceItem } from "./services.interface";

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

const serviceOfferSchema = new Schema(
  {
    slug: { type: String, required: true, trim: true },
    name: localizedString,
    text: localizedString,
    image: { type: mediaSchema, required: false },
  },
  { _id: false },
);

const serviceDetailsSchema = new Schema(
  {
    headline: localizedString,
    paragraphs: [localizedString],
    statCardImage: { type: mediaSchema, required: false },
    statCardText: localizedString,
    badgeYears: localizedString,
    badgeText: localizedString,
    offers: [serviceOfferSchema],
  },
  { _id: false },
);

const serviceCategorySchema = new Schema<IServiceCategory>(
  {
    categoryId: { type: Number, required: true, unique: true },
    slug: { type: String, required: true, trim: true, unique: true },
    name: localizedString,
    icon: { type: String, default: "shield" },
    desc: localizedString,
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const serviceItemSchema = new Schema<IServiceItem>(
  {
    categoryId: { type: Number, required: true, index: true },
    categorySlug: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    name: localizedString,
    sub: localizedString,
    icon: { type: String, default: "shield" },
    image: { type: mediaSchema, required: false },
    order: { type: Number, default: 0 },
    details: { type: serviceDetailsSchema, required: false },
  },
  { timestamps: true },
);

serviceCategorySchema.index({ order: 1 });
serviceItemSchema.index({ categoryId: 1, order: 1 });

export const ServiceCategory = model<IServiceCategory>("ServiceCategory", serviceCategorySchema);
export const ServiceItem = model<IServiceItem>("ServiceItem", serviceItemSchema);
