import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const numbersPresenceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNumbersPresence: builder.query<ContentRecord, void>({
      query: () => '/numbers-presence',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetNumbersPresenceQuery, useLazyGetNumbersPresenceQuery } = numbersPresenceApi;
