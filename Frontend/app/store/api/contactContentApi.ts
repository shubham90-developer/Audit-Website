import { baseApi } from "./baseApi";
import type { ApiEnvelope } from "./types";

export type ContactLang = "en" | "ar";

export interface ContactLocalized {
  en: string;
  ar: string;
}

export interface ContactMedia {
  url: string;
  publicId?: string;
}

export interface ContactLocalizedMedia {
  en: ContactMedia[];
  ar: ContactMedia[];
}

export type ContactCardKey = "phone" | "email" | "whatsapp" | "address";
export type ContactFeatureIcon = "headphones" | "clock" | "users" | "shield";

export interface ContactCard {
  _id?: string;
  key: ContactCardKey;
  label: ContactLocalized;
  value: ContactLocalized;
  href: string;
  order: number;
  isActive: boolean;
}

export interface ContactFeature {
  _id?: string;
  icon: ContactFeatureIcon;
  title: ContactLocalized;
  description: ContactLocalized;
  order: number;
  isActive: boolean;
}

export interface ContactContent {
  _id: string;
  heroBadge: ContactLocalized;
  heroTitle: ContactLocalized;
  heroHighlight: ContactLocalized;
  heroDescription: ContactLocalized;
  heroBgImage: ContactLocalizedMedia;
  heroVideo: ContactLocalizedMedia;
  contactCards: ContactCard[];
  sectionBadge: ContactLocalized;
  sectionTitle: ContactLocalized;
  sectionHighlight: ContactLocalized;
  sectionDescription: ContactLocalized;
  sectionNote: ContactLocalized;
  sectionBgImage: ContactLocalizedMedia;
  features: ContactFeature[];
  formTitle: ContactLocalized;
  formDescription: ContactLocalized;
  formDisclaimer: ContactLocalized;
}

export const contactContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactContent: builder.query<ContactContent, void>({
      query: () => "/contact-content",
      transformResponse: (response: ApiEnvelope<ContactContent>) =>
        response.data,
    }),
  }),
});

export const { useGetContactContentQuery } = contactContentApi;
