import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

// publicId is empty for default images that live in the frontend /public folder
export interface IMedia {
  url: string;
  publicId?: string;
}

export interface ILocalizedMedia {
  en: IMedia[];
  ar: IMedia[];
}

// "Our Story" section: badge, story paragraph, quote card and background (one document).
// narrative and quote are rich text (HTML from the text editor).
export interface IOurStorySection extends Document {
  badge: ILocalizedString; // plain text, e.g. "OUR STORY"
  narrative: ILocalizedString; // rich text: the big paragraph
  quote: ILocalizedString; // rich text: the quote in the dark card
  authorName: ILocalizedString; // plain text
  authorRole: ILocalizedString; // plain text
  authorImage: ILocalizedMedia; // small round photo in the quote card
  bgImage: ILocalizedMedia; // section background
  createdAt: Date;
  updatedAt: Date;
}

// One document per timeline step. The "01" number comes from the order.
// title and text are rich text (HTML from the text editor).
export interface IOurStoryStep extends Document {
  title: ILocalizedString;
  text: ILocalizedString;
  image: ILocalizedMedia; // round image next to the step
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
