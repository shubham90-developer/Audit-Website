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

export interface IIndustriesSection extends Document {
  title: ILocalizedString;
  colorTitle: ILocalizedString;
  subtitle: ILocalizedString;
  watermark: ILocalizedString;
  bgImage: ILocalizedMedia;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIndustryItem extends Document {
  title: ILocalizedString;
  text: ILocalizedString;
  icon: string;
  image: ILocalizedMedia;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
