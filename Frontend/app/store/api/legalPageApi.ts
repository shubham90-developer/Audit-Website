import { baseApi } from "./baseApi";
import type { ApiEnvelope, Localized, Media } from "./types";

export type LegalPageKind = "privacy-policy" | "terms-and-conditions";

export interface LegalSection {
  _id?: string;
  title: Localized;
  /** Plain text. Line breaks are preserved when rendered. */
  body: Localized;
  bullets: Localized[];
  order: number;
}

/** Shape of GET /legal-pages/:kind (backend: modules/P&T/legal.model.ts). */
export interface LegalPage {
  _id: string;
  kind: LegalPageKind;
  heroTitle: Localized;
  heroDescription: Localized;
  heroImage: Localized<Media>;
  intro: Localized;
  sidebarTitle: Localized;
  sections: LegalSection[];
  createdAt: string;
  updatedAt: string;
}

/** Public GET endpoint only; admin writes (PUT) live in the admin app. */
export const legalPageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLegalPage: builder.query<LegalPage, LegalPageKind>({
      query: (kind) => `/legal-pages/${kind}`,
      transformResponse: (response: ApiEnvelope<LegalPage>) => response.data,
      providesTags: (_result, _error, kind) => [
        { type: "WebsiteContent", id: kind },
      ],
    }),
  }),
});

export const { useGetLegalPageQuery, useLazyGetLegalPageQuery } = legalPageApi;
