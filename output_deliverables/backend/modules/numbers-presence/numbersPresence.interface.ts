import { Document } from "mongoose";

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

// Icon and color keys. The frontend maps them to react-icons and Tailwind classes.
export const STAT_ICONS = ["users", "globe", "document", "mappin"] as const;
export type StatIcon = (typeof STAT_ICONS)[number];

export const STAT_COLORS = ["violet", "emerald", "green", "teal"] as const;
export type StatColor = (typeof STAT_COLORS)[number];

// Section text fields are rich text. They can contain HTML from the editor,
// such as <span style="color:#00852B">...</span> for green highlights.
export interface INumbersSection extends Document {
  numbersTitle: ILocalizedString;
  securityTitle: ILocalizedString;
  securityText: ILocalizedString;
  insuranceText: ILocalizedString;
  globalLabel: ILocalizedString;
  globalTitle: ILocalizedString;
  globalText: ILocalizedString;
  sectionBg: ILocalizedMedia; // main background of the whole section
  panelBg: ILocalizedMedia; // background of the numbers card
  createdAt: Date;
  updatedAt: Date;
}

export interface INumbersStat extends Document {
  icon: StatIcon;
  color: StatColor;
  value: number;
  suffix: string; // "+" or "%". Same in both languages.
  label: ILocalizedString;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface INumbersOffice extends Document {
  city: ILocalizedString;
  country: ILocalizedString;
  flagCode: string; // ISO 3166-1 alpha-2, e.g. "ae"
  image: ILocalizedMedia; // office photo, one per language
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
