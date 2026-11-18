import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTestimonials: builder.query<ContentRecord, void>({
      query: () => '/testimonials',
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetTestimonialsQuery, useLazyGetTestimonialsQuery } = testimonialApi;
