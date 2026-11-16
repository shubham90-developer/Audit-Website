import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId: string;
}

export type InsightType = "blog" | "press" | "video";

export interface IInsight extends Document {
  type: InsightType;
  title: ILocalizedString;
  excerpt: ILocalizedString;
  content: ILocalizedString;
  category: ILocalizedString;
  tag?: ILocalizedString;
  author: ILocalizedString;
  authorImage?: IMedia;
  reviewedBy?: ILocalizedString;
  readTime?: ILocalizedString;
  date: string;
  slug: string;
  media: IMedia;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
