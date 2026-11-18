import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const faqSectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaqSection: builder.query<ContentRecord, void>({
      query: () => '/faq',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetFaqSectionQuery, useLazyGetFaqSectionQuery } = faqSectionApi;
