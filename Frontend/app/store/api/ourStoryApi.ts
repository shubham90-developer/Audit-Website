import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const ourStoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOurStory: builder.query<ContentRecord, void>({
      query: () => '/our-story',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetOurStoryQuery, useLazyGetOurStoryQuery } = ourStoryApi;
