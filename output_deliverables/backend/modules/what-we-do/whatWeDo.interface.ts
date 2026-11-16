import { Document } from "mongoose";

// Icon keys the frontend maps to react-icons
export const ICON_KEYS = ["shield", "percent", "briefcase", "trending", "book"] as const;
export type IconKey = (typeof ICON_KEYS)[number];

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

export interface IWhatWeDoSection extends Document {
  title: ILocalizedString;
  colorTitle: ILocalizedString;
  subtitle: ILocalizedString;
  watermark: ILocalizedString;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWhatWeDoService extends Document {
  name: ILocalizedString;
  desc: ILocalizedString;
  icon: IconKey;
  items: ILocalizedString[];
  image: ILocalizedMedia; // one panel image per language
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
