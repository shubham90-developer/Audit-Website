import { baseApi } from "./baseApi";
import type { ApiEnvelope } from "./types";

export type SettingsLocalized = { en: string; ar: string };
export type SettingsMedia = { url: string; publicId: string };

/** Shape of GET /settings (single site-wide settings record). */
export interface SiteSettings {
  _id?: string;
  companyName: SettingsLocalized;
  tagline: SettingsLocalized;
  address: SettingsLocalized;
  officeHours: SettingsLocalized;
  footerDescription: SettingsLocalized;
  copyright: SettingsLocalized;
  footerQuickLinksTitle: SettingsLocalized;
  footerServicesTitle: SettingsLocalized;
  footerContactTitle: SettingsLocalized;
  headerFollowTitle: SettingsLocalized;
  whatsappCta: SettingsLocalized;
  phone: string;
  alternatePhone: string;
  email: string;
  whatsapp: string;
  googleMapsUrl: string;
  mapEmbedUrl: string;
  socials: {
    instagram: string;
    facebook: string;
    youtube: string;
    linkedin: string;
    x: string;
  };
  logo: SettingsMedia;
  footerLogo: SettingsMedia;
  favicon: SettingsMedia;
  createdAt?: string;
  updatedAt?: string;
}

/** Public GET endpoint only; admin writes live in the admin app. */
export const siteSettingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSiteSettings: builder.query<SiteSettings, void>({
      query: () => "/settings",
      transformResponse: (response: ApiEnvelope<SiteSettings>) => response.data,
    }),
  }),
});

export const { useGetSiteSettingsQuery, useLazyGetSiteSettingsQuery } =
  siteSettingsApi;
