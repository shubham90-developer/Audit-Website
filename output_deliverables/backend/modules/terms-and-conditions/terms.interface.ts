import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface ITermsAndConditions extends Document {
  title: ILocalizedString;
  subTitle: ILocalizedString;
  shortDesc: ILocalizedString;
  content: ILocalizedString;
  createdAt: Date;
  updatedAt: Date;
}
