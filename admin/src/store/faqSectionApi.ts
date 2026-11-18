import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export type Localized = { en: string; ar: string }
export type Media = { url: string; publicId: string }
export type FaqQuestion = { _id?: string; question: Localized; answer: Localized; order: number; active: boolean }
export type FaqCategory = { _id?: string; name: Localized; order: number; active: boolean; questions: FaqQuestion[] }
export type FaqSection = {
  _id?: string
  title: Localized
  description: Localized
  breadcrumbHome: Localized
  exploreLabel: Localized
  questionsLabel: Localized
  emptyLabel: Localized
  ctaTitle: Localized
  ctaDescription: Localized
  ctaButton: Localized
  backgroundImage: { en: Media; ar: Media }
  categories: FaqCategory[]
}
export const faqSectionApi = createApi({
  reducerPath: 'faqSectionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api',
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken')
        if (token) headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['FaqSection'],
  endpoints: (builder) => ({
    getFaqSection: builder.query<FaqSection, void>({
      query: () => '/faq',
      transformResponse: (r: { data: FaqSection }) => r.data,
      providesTags: ['FaqSection'],
    }),
    updateFaqSection: builder.mutation<FaqSection, { data: FaqSection; files?: { en?: File; ar?: File } }>({
      query: ({ data, files }) => {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (files?.en) body.append('backgroundImageEn', files.en)
        if (files?.ar) body.append('backgroundImageAr', files.ar)
        return { url: '/faq-section', method: 'PUT', body }
      },
      transformResponse: (r: { data: FaqSection }) => r.data,
      invalidatesTags: ['FaqSection'],
    }),
  }),
})
export const { useGetFaqSectionQuery, useUpdateFaqSectionMutation } = faqSectionApi
