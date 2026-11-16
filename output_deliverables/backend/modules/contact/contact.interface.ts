import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId: string;
}

export interface IContactFeature {
  icon: string;
  title: ILocalizedString;
  text: ILocalizedString;
}

export interface IMapSection {
  place: ILocalizedString;
  address: ILocalizedString[];
  mapsLink: string;
  mapEmbed: string;
  landmarkImage: IMedia;
  bgImage: IMedia;
}

export interface IContactSection extends Document {
  title: ILocalizedString;
  subtitle: ILocalizedString;
  bgImage: IMedia;
  features: IContactFeature[];
  servicesList: string[];
  mapSection: IMapSection;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContactEnquiry extends Document {
  name: string;
  company?: string;
  email: string;
  code: string;
  phone: string;
  service?: string;
  message?: string;
  status: "new" | "in_progress" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}
