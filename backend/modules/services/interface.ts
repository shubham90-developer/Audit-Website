import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId: string;
}

// one image per language ({ url: "", publicId: "" } = no image yet)
export interface ILocalizedImage {
  en: IMedia;
  ar: IMedia;
}

// one service card (Audit & Assurance, Tax Services, ...)
export interface IWhatWeDoItem {
  title: ILocalizedString;
  description: ILocalizedString;
  image: ILocalizedImage;
}

export interface IWhatWeDo extends Document {
  label: ILocalizedString; // "What We Do"
  heading: ILocalizedString; // "Complete Financial Services Under One Roof"
  items: IWhatWeDoItem[];
  createdAt: Date;
  updatedAt: Date;
}
