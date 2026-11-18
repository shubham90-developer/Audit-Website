import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const globalMarketsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGlobalMarkets: builder.query<ContentRecord, void>({
      query: () => '/global-markets',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetGlobalMarketsQuery, useLazyGetGlobalMarketsQuery } = globalMarketsApi;
