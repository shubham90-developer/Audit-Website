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

export interface IPartnerSection extends Document {
  title: ILocalizedString;
  colorTitle: ILocalizedString;
  subtitle: ILocalizedString;
  watermark: ILocalizedString;
  bgImage?: IMedia;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartner extends Document {
  title: ILocalizedString;
  text: ILocalizedString;
  logo: ILocalizedMedia; // one logo per language
  order: number; // display order on the site
  createdAt: Date;
  updatedAt: Date;
}
