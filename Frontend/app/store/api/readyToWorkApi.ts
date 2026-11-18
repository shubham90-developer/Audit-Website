import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const readyToWorkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReadyToWork: builder.query<ContentRecord, void>({
      query: () => '/ready-to-work',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetReadyToWorkQuery, useLazyGetReadyToWorkQuery } = readyToWorkApi;
