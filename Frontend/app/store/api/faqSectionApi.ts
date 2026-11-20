import { baseApi } from "./baseApi";
import type { ApiEnvelope, Localized, Media } from "./types";

export interface FaqQuestion {
  _id: string;
  question: Localized;
  answer: Localized;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FaqCategory {
  _id: string;
  name: Localized;
  order: number;
  active: boolean;
  questions: FaqQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface FaqSection {
  _id: string;
  singleton: string;
  title: Localized;
  description: Localized;
  breadcrumbHome: Localized;
  exploreLabel: Localized;
  questionsLabel: Localized;
  emptyLabel: Localized;
  ctaTitle: Localized;
  ctaDescription: Localized;
  ctaButton: Localized;
  backgroundImage: Localized<Media>;
  categories: FaqCategory[];
  createdAt: string;
  updatedAt: string;
}

/** Public GET endpoints only; no admin write operations exposed. */
export const faqSectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqSection: builder.query<FaqSection, void>({
      query: () => "/faq",
      transformResponse: (response: ApiEnvelope<FaqSection>) => response.data,
    }),
  }),
});

export const { useGetFaqSectionQuery, useLazyGetFaqSectionQuery } =
  faqSectionApi;
