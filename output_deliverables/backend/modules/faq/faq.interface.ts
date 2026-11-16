import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IFaqCategory extends Document {
  name: ILocalizedString;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFaqItem extends Document {
  categoryId?: string;
  categoryName: ILocalizedString;
  question: ILocalizedString;
  answer: ILocalizedString;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
