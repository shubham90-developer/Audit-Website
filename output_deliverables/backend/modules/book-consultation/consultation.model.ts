import { Schema, model } from "mongoose";
import { IConsultationSection, IConsultationEnquiry } from "./consultation.interface";

const localizedString = {
  en: { type: String, default: "", trim: true },
  ar: { type: String, default: "", trim: true },
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

const consultationSectionSchema = new Schema<IConsultationSection>(
  {
    title: localizedString,
    colorTitle: localizedString,
    subtitle: localizedString,
    watermark: localizedString,
    bgImage: localizedMedia,
    cardImage: localizedMedia,

    formTitle: localizedString,
    formSubtitle: localizedString,
    buttonLabel: localizedString,
    confidentialNote: localizedString,

    contactBoxTitle: localizedString,
    contactBoxSubtitle: localizedString,
    contactBoxDesc: localizedString,
    officeHours: localizedString,
    phone: { type: String, default: "+971 52 178 6209" },
    email: { type: String, default: "info@almazroeiaudit.com" },
  },
  { timestamps: true }
);

const consultationEnquirySchema = new Schema<IConsultationEnquiry>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, default: "" },
    message: { type: String, default: "" },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export const ConsultationSection = model<IConsultationSection>("ConsultationSection", consultationSectionSchema);
export const ConsultationEnquiry = model<IConsultationEnquiry>("ConsultationEnquiry", consultationEnquirySchema);
