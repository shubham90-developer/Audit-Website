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

export interface IWhyUsSection extends Document {
  label: ILocalizedString;
  title: ILocalizedString;
  watermark: ILocalizedString;
  centerImage: ILocalizedMedia;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWhyUsCard extends Document {
  title: ILocalizedString;
  text: ILocalizedString;
  icon: string;
  side: "left" | "right";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
