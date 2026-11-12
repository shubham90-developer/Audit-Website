import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId: string;
}

// one image, one per language ({ url: "", publicId: "" } = no image yet)
export interface ILocalizedImage {
  en: IMedia;
  ar: IMedia;
}

export interface IContactBanner extends Document {
  header: ILocalizedString; // "Need an Audit or Tax Advice?"
  title: ILocalizedString; // "Believe us when it comes to investment"
  description: ILocalizedString; // "Speak to our team today..."
  image1: ILocalizedImage; // left image (woman)
  image2: ILocalizedImage; // small middle image
  image3: ILocalizedImage; // right image (man)
  createdAt: Date;
  updatedAt: Date;
}
