import { baseApi } from "./baseApi";
import type { ApiEnvelope, ContentRecord } from "./types";

/* ----------------------------- Types ----------------------------- */

export type MarketLang = "en" | "ar";

export interface MarketLocalized {
  en: string;
  ar: string;
}

export interface MarketMedia {
  url: string;
  publicId?: string;
}

export interface MarketLocalizedMedia {
  en: MarketMedia[];
  ar: MarketMedia[];
}

export interface GlobalMarketsSection extends ContentRecord {
  _id: string;

  badge: MarketLocalized;
  title: MarketLocalized;
  highlightedTitle: MarketLocalized;
  description: MarketLocalized;
  sideTitle: MarketLocalized;

  bgImage: MarketLocalizedMedia;

  createdAt: string;
  updatedAt: string;
}

export interface GlobalMarket extends ContentRecord {
  _id: string;

  title: MarketLocalized;
  image: MarketLocalizedMedia;

  order: number;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface GlobalMarketsData extends ContentRecord {
  section: GlobalMarketsSection | null;
  markets: GlobalMarket[];
}

/* ----------------------------- API ----------------------------- */

/**
 * Public GET endpoint.
 * Uses the existing shared baseApi.
 * No admin write operations exposed.
 */
export const globalMarketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalMarkets: builder.query<GlobalMarketsData, void>({
      query: () => "/global-markets",

      transformResponse: (response: ApiEnvelope<GlobalMarketsData>) =>
        response.data,
    }),
  }),
});

/* ----------------------------- Hooks ----------------------------- */

export const { useGetGlobalMarketsQuery, useLazyGetGlobalMarketsQuery } =
  globalMarketsApi;
