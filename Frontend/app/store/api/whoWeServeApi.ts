import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const whoWeServeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWhoWeServe: builder.query<ContentRecord, void>({
      query: () => '/who-we-serve',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetWhoWeServeQuery, useLazyGetWhoWeServeQuery } = whoWeServeApi;
