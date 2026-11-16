import { Document } from "mongoose";

// Icon keys the frontend maps to react-icons
export const FEATURE_ICONS = ["users", "shield", "chart", "clock"] as const;
export type FeatureIcon = (typeof FEATURE_ICONS)[number];

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId: string;
}

export interface ILocalizedMedia {
  en: IMedia[];
  ar: IMedia[];
}

// Call-to-action section (heading, text, button, background). One document.
export interface IReadyToWorkSection extends Document {
  title: ILocalizedString; // "Ready to Work"
  highlight: ILocalizedString; // "Ahmed Al Mazroei"
  description: ILocalizedString;
  buttonLabel: ILocalizedString; // "Book a Consultation"
  buttonHref: string; // same link in both languages
  tagOne: ILocalizedString; // "Private Consultation"
  tagTwo: ILocalizedString; // "Tailored Advice"
  bgImage: ILocalizedMedia; // background photo, one per language
  createdAt: Date;
  updatedAt: Date;
}

// The small cards at the bottom. One document per card.
export interface IReadyToWorkFeature extends Document {
  icon: FeatureIcon;
  label: ILocalizedString;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
