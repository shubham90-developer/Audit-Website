import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const whoWeAreApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWhoWeAre: builder.query<ContentRecord, void>({
      query: () => '/who-we-are',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetWhoWeAreQuery, useLazyGetWhoWeAreQuery } = whoWeAreApi;
