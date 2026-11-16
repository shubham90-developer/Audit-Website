import { Document, Types } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId: string;
}

export interface IServiceOffer {
  slug: string;
  name: ILocalizedString;
  text: ILocalizedString;
  image?: IMedia;
}

export interface IServiceDetails {
  headline: ILocalizedString;
  paragraphs: ILocalizedString[];
  statCardImage?: IMedia;
  statCardText: ILocalizedString;
  badgeYears: ILocalizedString;
  badgeText: ILocalizedString;
  offers: IServiceOffer[];
}

export interface IServiceCategory extends Document {
  categoryId: number;
  slug: string;
  name: ILocalizedString;
  icon: string;
  desc: ILocalizedString;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IServiceItem extends Document {
  categoryId: number;
  categorySlug: string;
  slug: string;
  name: ILocalizedString;
  sub: ILocalizedString;
  icon: string;
  image?: IMedia;
  order: number;
  details?: IServiceDetails;
  createdAt: Date;
  updatedAt: Date;
}
