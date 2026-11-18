import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBanners: builder.query<ContentRecord[], void>({
      query: () => '/banners',
      transformResponse: (response: ApiEnvelope<ContentRecord[]>) => response.data,
    }),
  }),
});

export const { useGetBannersQuery, useLazyGetBannersQuery } = bannerApi;
