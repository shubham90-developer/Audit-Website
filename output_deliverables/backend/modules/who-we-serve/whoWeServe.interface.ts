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

// "serve" = the four cards in the top row, "why" = the two cards on the right
export const CARD_KINDS = ["serve", "why"] as const;
export type CardKind = (typeof CARD_KINDS)[number];

export interface IWhoWeServeSection extends Document {
  pillTitle: ILocalizedString; // "Who We"
  pillHighlight: ILocalizedString; // "Serve" (green)
  whyTitle: ILocalizedString; // "Why Businesses Choose"
  brandName: ILocalizedString; // "Ahmed Al Mazroei" (green)
  whyIntroStart: ILocalizedString; // text before the bold part
  whyIntroBold: ILocalizedString; // bold part
  whyIntroEnd: ILocalizedString; // text after the bold part
  leftBg: ILocalizedMedia; // background image for the left panel
  createdAt: Date;
  updatedAt: Date;
}

export interface IWhoWeServeCard extends Document {
  kind: CardKind;
  title: ILocalizedString;
  text: ILocalizedString;
  image: ILocalizedMedia;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
