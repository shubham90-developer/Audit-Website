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

export interface IAboutHero {
  title: ILocalizedString;
  subtitle: ILocalizedString;
  intro1: ILocalizedString;
  intro2: ILocalizedString;
  cta1Label: ILocalizedString;
  cta1Href: string;
  cta2Label: ILocalizedString;
  cta2Href: string;
  speakLabel: ILocalizedString;
  heroImage: ILocalizedMedia;
  bgImage: ILocalizedMedia;
  stats: {
    value: string;
    label: ILocalizedString;
    icon: string;
  }[];
}

export interface IAboutWhoWeAre {
  badge: ILocalizedString;
  title: ILocalizedString;
  text: ILocalizedString;
  quote: ILocalizedString;
  buttonLabel: ILocalizedString;
  buttonHref: string;
  scriptText: ILocalizedString;
  bgImage: ILocalizedMedia;
  headerImage: ILocalizedMedia;
  snapshotItems: {
    label: ILocalizedString;
    value: ILocalizedString;
    text: ILocalizedString;
    icon: string;
  }[];
}

export interface IAboutOurStory {
  badge: ILocalizedString;
  narrative: ILocalizedString;
  bgImage: ILocalizedMedia;
  steps: {
    number: string;
    title: ILocalizedString;
    text: ILocalizedString;
    image: ILocalizedMedia;
  }[];
  quote: ILocalizedString;
  authorName: ILocalizedString;
  authorRole: ILocalizedString;
  authorImage: ILocalizedMedia;
}

export interface IAboutOurValues {
  label: ILocalizedString;
  title: ILocalizedString;
  values: {
    number: string;
    title: ILocalizedString;
    text: ILocalizedString;
    icon: string;
  }[];
}

export interface IAboutNextChapter {
  badge: ILocalizedString;
  title: ILocalizedString;
  description: ILocalizedString;
  scriptTagline: ILocalizedString;
  bgImage: ILocalizedMedia;
  countries: {
    name: ILocalizedString;
    image: ILocalizedMedia;
  }[];
}

export interface IAboutUs extends Document {
  hero: IAboutHero;
  whoWeAre: IAboutWhoWeAre;
  ourStory: IAboutOurStory;
  ourValues: IAboutOurValues;
  nextChapter: IAboutNextChapter;
  createdAt: Date;
  updatedAt: Date;
}
