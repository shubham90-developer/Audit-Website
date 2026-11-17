import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

// publicId is empty for the default images that live in the frontend /public folder
export interface IMedia {
  url: string;
  publicId?: string;
}

export interface ILocalizedMedia {
  en: IMedia[];
  ar: IMedia[];
}

/* ---------- Sections ---------- */

export interface IAboutHero {
  title: ILocalizedString; // green part of the heading
  subtitle: ILocalizedString; // white part of the heading
  intro1: ILocalizedString;
  intro2: ILocalizedString;
  cta1Label: ILocalizedString;
  cta1Href: string; // same link in both languages
  cta2Label: ILocalizedString;
  cta2Href: string;
  speakLabel: ILocalizedString; // line under the buttons
  heroImage: ILocalizedMedia; // photo on the right
  bgImage: ILocalizedMedia; // dark background
  stats: {
    value: string;
    label: ILocalizedString;
    icon: string; // icon key the frontend maps, e.g. building, chart, star, google
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

// One document for the whole About page
export interface IAboutUs extends Document {
  hero: IAboutHero;
  whoWeAre: IAboutWhoWeAre;
  ourStory: IAboutOurStory;
  ourValues: IAboutOurValues;
  nextChapter: IAboutNextChapter;
  createdAt: Date;
  updatedAt: Date;
}

/* ---------- Constants shared by the controller and the route ---------- */

export const SECTION_KEYS = [
  "hero",
  "whoWeAre",
  "ourStory",
  "ourValues",
  "nextChapter",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

// Most items allowed in any list (stats, steps, values, countries ...)
export const MAX_ITEMS = 8;

// Single images: one upload field per language
export const SINGLE_IMAGE_SLOTS = [
  { section: "hero", field: "heroImage", folder: "audit-website/about/hero", files: { en: "heroImageEn", ar: "heroImageAr" } },
  { section: "hero", field: "bgImage", folder: "audit-website/about/hero", files: { en: "heroBgEn", ar: "heroBgAr" } },
  { section: "whoWeAre", field: "bgImage", folder: "audit-website/about/who", files: { en: "whoWeAreBgEn", ar: "whoWeAreBgAr" } },
  { section: "whoWeAre", field: "headerImage", folder: "audit-website/about/who", files: { en: "whoWeAreHeaderEn", ar: "whoWeAreHeaderAr" } },
  { section: "ourStory", field: "bgImage", folder: "audit-website/about/story", files: { en: "ourStoryBgEn", ar: "ourStoryBgAr" } },
  { section: "ourStory", field: "authorImage", folder: "audit-website/about/story", files: { en: "ourStoryAuthorEn", ar: "ourStoryAuthorAr" } },
  { section: "nextChapter", field: "bgImage", folder: "audit-website/about/next", files: { en: "nextChapterBgEn", ar: "nextChapterBgAr" } },
] as const;

// Images that belong to a list item. The upload field name is the prefix plus
// the item's position in the list, e.g. ourStoryStepImageEn0, ourStoryStepImageAr3
export const ITEM_IMAGE_SLOTS = [
  { section: "ourStory", field: "steps", folder: "audit-website/about/story", files: { en: "ourStoryStepImageEn", ar: "ourStoryStepImageAr" } },
  { section: "nextChapter", field: "countries", folder: "audit-website/about/next", files: { en: "nextChapterCountryImageEn", ar: "nextChapterCountryImageAr" } },
] as const;
