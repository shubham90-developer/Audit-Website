import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId?: string;
}

export interface ILocalizedMedia {
  en: IMedia[];
  ar: IMedia[];
}

export interface ISettings extends Document {
  logo: ILocalizedMedia;
  favicon: ILocalizedMedia;

  mobileNo: string;
  alternateMobileNo: string;
  mail: string;
  alternateEmail: string;
  whatsApp: string;

  address: ILocalizedString;
  addressIframe: string;
  workingHrs: ILocalizedString;

  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;

  footerDesc: ILocalizedString;
  footerCopyrights: ILocalizedString;

  createdAt: Date;
  updatedAt: Date;
}
