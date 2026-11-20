import { baseApi } from "./baseApi";
import type { ApiEnvelope, ContentRecord } from "./types";

/* ----------------------------- Types ----------------------------- */

export type StoryLang = "en" | "ar";

export interface StoryLocalized {
  en: string;
  ar: string;
}

export interface StoryMedia {
  url: string;
  publicId?: string;
}

export interface StoryLocalizedMedia {
  en: StoryMedia[];
  ar: StoryMedia[];
}

export interface OurStorySection extends ContentRecord {
  _id: string;

  badge: StoryLocalized;
  narrative: StoryLocalized;

  quote: StoryLocalized;
  authorName: StoryLocalized;
  authorRole: StoryLocalized;

  authorImage: StoryLocalizedMedia;
  bgImage: StoryLocalizedMedia;

  createdAt: string;
  updatedAt: string;
}

export interface OurStoryStep extends ContentRecord {
  _id: string;

  title: StoryLocalized;
  text: StoryLocalized;

  image: StoryLocalizedMedia;

  order: number;

  createdAt: string;
  updatedAt: string;
}

export interface OurStoryData extends ContentRecord {
  section: OurStorySection | null;
  steps: OurStoryStep[];
}

/* ----------------------------- API ----------------------------- */

/**
 * Public GET endpoints only.
 * Uses the existing shared baseApi.
 * No admin write operations exposed.
 */
export const ourStoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOurStory: builder.query<OurStoryData, void>({
      query: () => "/our-story",

      transformResponse: (response: ApiEnvelope<OurStoryData>) => response.data,
    }),
  }),
});

/* ----------------------------- Hooks ----------------------------- */

export const { useGetOurStoryQuery, useLazyGetOurStoryQuery } = ourStoryApi;
