import { Document } from "mongoose";

// Icon keys the frontend maps to react-icons.
// Used for each industry card and for the icon in the bottom box.
export const INDUSTRY_ICONS = [
  "government",
  "building",
  "energy",
  "truck",
  "heart",
  "globe",
  "gear",
  "chip",
  "users",
  "hand",
  "chart",
] as const;
export type IndustryIcon = (typeof INDUSTRY_ICONS)[number];

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

// Section: heading, intro, bottom box and background (one document).
// title and footerTitle are rich text (HTML from the editor), so parts of
// them can be green, e.g. <span style="color:#00852B">Serve</span>.
export interface IIndustriesSection extends Document {
  watermark: ILocalizedString; // faint text behind the heading
  title: ILocalizedString; // rich text: "Industries We <green>Serve</green>"
  description: ILocalizedString; // intro paragraph
  footerTitle: ILocalizedString; // rich text: bold line in the bottom box
  footerNote: ILocalizedString; // small line under it
  footerIcon: IndustryIcon; // icon in the bottom box
  sectionBg: ILocalizedMedia; // faint city background, one per language
  createdAt: Date;
  updatedAt: Date;
}

// One document per industry card. The "01" number comes from the order.
export interface IIndustry extends Document {
  icon: IndustryIcon;
  title: ILocalizedString;
  desc: ILocalizedString;
  image: ILocalizedMedia; // picture on the right of the card
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
