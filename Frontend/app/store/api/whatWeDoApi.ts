import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const whatWeDoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWhatWeDo: builder.query<ContentRecord, void>({
      query: () => '/what-we-do',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetWhatWeDoQuery, useLazyGetWhatWeDoQuery } = whatWeDoApi;
