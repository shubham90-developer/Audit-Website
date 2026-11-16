import { Document } from "mongoose";

export type Lang = "en" | "ar";

// Generic localized value: one entry per language
export interface ILocalized<T> {
  en: T;
  ar: T;
}

export interface ILocalizedString extends ILocalized<string> {}

export interface IMedia {
  url: string;
  publicId: string;
}

export interface ILocalizedMedia {
  en: IMedia[];
  ar: IMedia[];
}

export interface ICtaButton {
  label: ILocalizedString;
  href: ILocalizedString; // localized in case the Arabic site uses different URLs
  variant: "primary" | "secondary";
}

export interface IFtaCard {
  line1: ILocalizedString; // "FTA Approved" / "وكالة ضريبية"
  line2: ILocalizedString; // "Tax Agency" / "معتمدة من الهيئة الاتحادية للضرائب"
  licenseNumber: ILocalizedString; // "No. 30008692" / "رقم 30008692"
}

export interface IPartnerCard {
  title: ILocalizedString; // "Business Setup Partner"
  subtitle: ILocalizedString; // "for Dubai Free Zones"
}

export interface IExperienceCard {
  value: ILocalizedString; // "25+ YEARS" / "+25 عامًا"
  label: ILocalizedString; // "of Experience" / "من الخبرة"
  tagline: ILocalizedString; // "You Can Count On" / "يمكنك الاعتماد عليها"
}

export interface IReviewRating {
  platform: "google" | "trustpilot"; // selects the icon on the frontend
  score: number; // language-independent, e.g. 4.8
  label: ILocalizedString; // "from 200+ Google Reviews" / "من أكثر من 200 تقييم على Google"
}

// Text-only fields of a banner (no _id, timestamps, or media)
export type BannerTextData = {
  establishmentYear: ILocalizedString;

  titleHighlight: ILocalizedString; // "Expert Advice" / "نصائح الخبراء" (store without trailing space)
  titleRest: ILocalizedString; // "to Help You Grow" / "لمساعدتك على النمو"
  intro: ILocalizedString;
  speakLabel: ILocalizedString; // "— Speak Directly with an Expert —"

  primaryCta: ICtaButton; // "Book Free 20-Min Call"
  secondaryCta: ICtaButton; // "Explore Tax Services"

  ftaCard: IFtaCard;
  partnerCard: IPartnerCard;
  experienceCard: IExperienceCard;
  reviewRatings: IReviewRating[]; // Google and Trustpilot

  trustedNote: ILocalizedString;
};

export interface IBanner extends Document, BannerTextData {
  bgImages: ILocalizedMedia;
  bgVideos: ILocalizedMedia;
  posterImage: ILocalizedMedia;

  createdAt: Date;
  updatedAt: Date;
}
