import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';
export type LegalPageKind = 'privacy-policy' | 'terms-and-conditions';
export const legalPageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLegalPage: builder.query<ContentRecord, LegalPageKind>({
      query: (kind) => `/legal-pages/${kind}`,
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});
export const { useGetLegalPageQuery, useLazyGetLegalPageQuery } = legalPageApi;
