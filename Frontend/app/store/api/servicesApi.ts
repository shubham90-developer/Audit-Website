import { baseApi } from "./baseApi";
import type { ApiEnvelope } from "./types";

export type Lang = "en" | "ar";

export interface Localized {
  en: string;
  ar: string;
}

export interface MediaItem {
  url: string;
  publicId: string;
}

export interface LocalizedMedia {
  en: MediaItem[];
  ar: MediaItem[];
}

export interface ServiceDetail {
  _id: string;
  /** Rich text (HTML) */
  title: Localized;
  /** Rich text (HTML) */
  description: Localized;
  img: LocalizedMedia;
}

export interface Service {
  _id: string;
  /** Rich text (HTML) */
  title: Localized;
  /** Rich text (HTML) */
  desc: Localized;
  iconImg: LocalizedMedia;
  cardImg: LocalizedMedia;
  mainImg: LocalizedMedia;
  bgImage: LocalizedMedia;
  bgVideo: LocalizedMedia;
  details: ServiceDetail[];
  createdAt: string;
  updatedAt: string;
}

/** Public GET endpoints only; no admin write operations exposed. */
export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<Service[], void>({
      query: () => "/services",
      transformResponse: (response: ApiEnvelope<Service[]>) => response.data,
    }),
    getServiceById: builder.query<Service, string>({
      query: (id) => `/services/${encodeURIComponent(id)}`,
      transformResponse: (response: ApiEnvelope<Service>) => response.data,
    }),
  }),
});

export const {
  useGetServicesQuery,
  useLazyGetServicesQuery,
  useGetServiceByIdQuery,
  useLazyGetServiceByIdQuery,
} = servicesApi;
