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

// one industry (Government & Semi-Government, Healthcare, ...)
export interface IIndustryItem {
  title: ILocalizedString;
  description: ILocalizedString;
  points: ILocalizedString[]; // the two bullet points under the description
  image: ILocalizedImage;
}

export interface IIndustries extends Document {
  label: ILocalizedString; // "Industries We Serve"
  heading: ILocalizedString; // "Experience Across Key Sectors"
  subtitle: ILocalizedString; // "Industry-focused expertise. Practical solutions..."
  items: IIndustryItem[];
  createdAt: Date;
  updatedAt: Date;
}
