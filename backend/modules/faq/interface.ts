import { Document } from "mongoose";

export interface Localized {
  en: string;
  ar: string;
}

export interface IFaqItem {
  question: Localized;
  answer: Localized;
}

export interface IFaq extends Document {
  singleton: boolean;
  label: Localized;
  heading: Localized;
  ctaTitle: Localized;
  ctaText: Localized;
  items: IFaqItem[];
  createdAt: Date;
  updatedAt: Date;
}
