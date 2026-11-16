import { Document } from "mongoose";

// Icon keys the frontend maps to react-icons
export const STEP_ICONS = ["headset", "document", "settings", "shield"] as const;
export type StepIcon = (typeof STEP_ICONS)[number];

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

// Heading, subtitle, watermark and the photo next to the steps (one document)
export interface IHowWeWorkSection extends Document {
  title: ILocalizedString; // "How We"
  colorTitle: ILocalizedString; // "Work" (shown in green)
  subtitle: ILocalizedString;
  watermark: ILocalizedString;
  image: ILocalizedMedia; // photo on the left, one per language
  createdAt: Date;
  updatedAt: Date;
}

// One document per step. The "STEP 1." label comes from the order on the frontend.
export interface IHowWeWorkStep extends Document {
  title: ILocalizedString;
  desc: ILocalizedString;
  icon: StepIcon;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
