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

// "Meet the team" section. One document, no list.
export interface IMeetTheTeam extends Document {
  leftTitle: ILocalizedString; // "The team you'll actually work with"
  scriptTitle: ILocalizedString; // "People Behind Your Progress" (script font)
  watermark: ILocalizedString; // big faded text behind the card
  image: ILocalizedMedia; // the card in the middle, one per language
  createdAt: Date;
  updatedAt: Date;
}
