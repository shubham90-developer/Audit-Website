import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IPrivacyPolicy extends Document {
  title: ILocalizedString;
  subTitle: ILocalizedString;
  shortDesc: ILocalizedString;
  content: ILocalizedString;
  createdAt: Date;
  updatedAt: Date;
}
