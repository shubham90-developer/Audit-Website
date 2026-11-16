import { Schema, model } from "mongoose";
import { IContactSection, IContactEnquiry } from "./contact.interface";

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

const contactFeatureSchema = new Schema(
  {
    icon: { type: String, default: "FiHeadphones" },
    title: localizedString,
    text: localizedString,
  },
  { _id: false },
);

const mapSectionSchema = new Schema(
  {
    place: localizedString,
    address: [localizedString],
    mapsLink: { type: String, default: "" },
    mapEmbed: { type: String, default: "" },
    landmarkImage: { type: mediaSchema, required: false },
    bgImage: { type: mediaSchema, required: false },
  },
  { _id: false },
);

const contactSectionSchema = new Schema<IContactSection>(
  {
    title: localizedString,
    subtitle: localizedString,
    bgImage: { type: mediaSchema, required: false },
    features: [contactFeatureSchema],
    servicesList: [{ type: String }],
    mapSection: mapSectionSchema,
  },
  { timestamps: true },
);

const contactEnquirySchema = new Schema<IContactEnquiry>(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true },
    code: { type: String, default: "+971", trim: true },
    phone: { type: String, required: true, trim: true },
    service: { type: String, default: "", trim: true },
    message: { type: String, default: "", trim: true },
    status: { type: String, enum: ["new", "in_progress", "resolved"], default: "new", index: true },
  },
  { timestamps: true },
);

export const ContactSection = model<IContactSection>("ContactSection", contactSectionSchema);
export const ContactEnquiry = model<IContactEnquiry>("ContactEnquiry", contactEnquirySchema);
