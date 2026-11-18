import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const industriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIndustries: builder.query<ContentRecord, void>({
      query: () => '/industries',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetIndustriesQuery, useLazyGetIndustriesQuery } = industriesApi;
