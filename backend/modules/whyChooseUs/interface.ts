import { Document } from "mongoose";

export const WHY_ICONS = [
  "book",
  "shield",
  "users",
  "monitor",
  "clock",
  "message",
] as const;
export type WhyIcon = (typeof WHY_ICONS)[number];

export interface Localized {
  en: string;
  ar: string;
}

export interface IWhyChooseUsItem {
  title: Localized;
  description: Localized;
  icon: WhyIcon;
}

export interface IWhyChooseUs extends Document {
  singleton: boolean;
  label: Localized;
  heading: Localized;
  centerImage: {
    en: { url: string; publicId: string };
    ar: { url: string; publicId: string };
  };
  items: IWhyChooseUsItem[];
  createdAt: Date;
  updatedAt: Date;
}
