import { baseApi } from "./baseApi";
import type { ApiEnvelope, ContentRecord } from "./types";

/* ----------------------------- Types ----------------------------- */

export type Lang = "en" | "ar";

export interface Localized {
  en: string;
  ar: string;
}

export type SnapshotIcon =
  | "award"
  | "badge"
  | "shield"
  | "globe"
  | "layers"
  | "pin";

export interface SnapshotItem {
  _id: string;
  label: Localized;
  value: Localized;
  note: Localized;
  icon: SnapshotIcon;
  order: number;
}

export interface WhoWeAreData extends ContentRecord {
  _id: string;

  eyebrow: Localized;

  headlinePrefix: Localized;
  highlight: Localized;
  headlineSuffix: Localized;

  brandName: Localized;
  body: Localized;
  quote: Localized;

  ctaLabel: Localized;
  ctaHref: Localized;

  watermark: Localized;

  snapshotTitle: Localized;
  snapshotTagline: Localized;

  snapshotItems: SnapshotItem[];

  createdAt: string;
  updatedAt: string;
}

/* ----------------------------- API ----------------------------- */

/**
 * Public GET endpoints only.
 * Uses the existing shared baseApi.
 * No admin write operations exposed.
 */
export const whoWeAreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWhoWeAre: builder.query<WhoWeAreData, void>({
      query: () => "/who-we-are",

      transformResponse: (response: ApiEnvelope<WhoWeAreData>) => response.data,
    }),
  }),
});

/* ----------------------------- Hooks ----------------------------- */

export const { useGetWhoWeAreQuery, useLazyGetWhoWeAreQuery } = whoWeAreApi;
