import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface ISlidingText extends Document {
  textLeft: ILocalizedString;
  textRight: ILocalizedString;
  speed: number;
  separator: string;
  createdAt: Date;
  updatedAt: Date;
}
