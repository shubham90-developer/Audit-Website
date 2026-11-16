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

export interface IMeetTheTeam extends Document {
  leftTitle: ILocalizedString;
  scriptTitle: ILocalizedString;
  watermark: ILocalizedString;
  marqueeText: ILocalizedString;
  marqueeSeconds: number;
  video?: IMedia;
  videoPoster?: IMedia;
  bgImage?: IMedia;
  image: ILocalizedMedia;
  createdAt: Date;
  updatedAt: Date;
}
