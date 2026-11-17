import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export type Localized = { en: string; ar: string }
export type Platform = 'google' | 'trustpilot' | 'other'
export interface Testimonial {
  _id?: string
  clientName: Localized
  review: Localized
  platform: Platform
  rating: number
  order: number
  active: boolean
}
export interface TestimonialSection {
  _id?: string
  eyebrow: Localized
  heading: Localized
  googlePrefix: Localized
  googleReviewCount: number
  googleSuffix: Localized
  trustpilotPrefix: Localized
  trustpilotRating: Localized
  trustpilotSuffix: Localized
  testimonials: Testimonial[]
}
export const testimonialApi = createApi({
  reducerPath: 'testimonialApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken')
        if (token) headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['TestimonialSection'],
  endpoints: (builder) => ({
    getTestimonialSection: builder.query<TestimonialSection, void>({
      query: () => '/testimonials',
      transformResponse: (response: { data: TestimonialSection }) => response.data,
      providesTags: ['TestimonialSection'],
    }),
    updateTestimonialSection: builder.mutation<TestimonialSection, TestimonialSection>({
      query: (body) => ({ url: '/testimonials', method: 'PUT', body }),
      transformResponse: (response: { data: TestimonialSection }) => response.data,
      invalidatesTags: ['TestimonialSection'],
    }),
  }),
})
export const { useGetTestimonialSectionQuery, useUpdateTestimonialSectionMutation } = testimonialApi
