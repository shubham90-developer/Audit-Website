import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const aboutUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAboutUs: builder.query<ContentRecord, void>({
      query: () => '/about-us',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetAboutUsQuery, useLazyGetAboutUsQuery } = aboutUsApi;
