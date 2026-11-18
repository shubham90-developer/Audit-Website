import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query<ContentRecord[], void>({
      query: () => '/services',
      transformResponse: (response: ApiEnvelope<ContentRecord[]>) => response.data,
    }),
    getServiceById: builder.query<ContentRecord, string>({
      query: (id) => `/services/${encodeURIComponent(id)}`,
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetServicesQuery, useLazyGetServicesQuery, useGetServiceByIdQuery, useLazyGetServiceByIdQuery } = servicesApi;
