import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const contactContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getContactContent: builder.query<ContentRecord, void>({
      query: () => '/contact-content',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetContactContentQuery, useLazyGetContactContentQuery } = contactContentApi;
