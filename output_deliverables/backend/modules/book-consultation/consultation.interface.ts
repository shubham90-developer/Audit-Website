import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId?: string;
}

export interface ILocalizedMedia {
  en: IMedia[];
  ar: IMedia[];
}

export interface IConsultationSection extends Document {
  title: ILocalizedString;
  colorTitle: ILocalizedString;
  subtitle: ILocalizedString;
  watermark: ILocalizedString;
  bgImage: ILocalizedMedia;
  cardImage: ILocalizedMedia;

  formTitle: ILocalizedString;
  formSubtitle: ILocalizedString;
  buttonLabel: ILocalizedString;
  confidentialNote: ILocalizedString;

  contactBoxTitle: ILocalizedString;
  contactBoxSubtitle: ILocalizedString;
  contactBoxDesc: ILocalizedString;
  officeHours: ILocalizedString;
  phone: string;
  email: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface IConsultationEnquiry extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}
