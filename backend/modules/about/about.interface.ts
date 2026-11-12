import { Document, Types } from "mongoose";

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

// one object in the array (Our Mission, Our Vision, ...)
export interface IMissionVisionSection {
  _id?: Types.ObjectId;
  title: ILocalizedString;
  description: ILocalizedString;
  image: ILocalizedMedia; // [{ url, publicId }] per language
}

export interface IMissionVision extends Document {
  sections: IMissionVisionSection[];
  createdAt: Date;
  updatedAt: Date;
}
