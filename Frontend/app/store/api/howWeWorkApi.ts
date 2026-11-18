import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const howWeWorkApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHowWeWork: builder.query<ContentRecord, void>({
      query: () => '/how-we-work',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetHowWeWorkQuery, useLazyGetHowWeWorkQuery } = howWeWorkApi;
