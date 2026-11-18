import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export type Localized = { en: string; ar: string }
export type Media = { url: string; publicId: string }
export type LocalizedMedia = { en: Media; ar: Media }
export interface BlogCategory {
  _id?: string
  name: Localized
  slug: string
  order: number
  active: boolean
}
export interface BlogArticle {
  _id?: string
  categoryId: string
  slug: string
  title: Localized
  excerpt: Localized
  content: Localized
  cardImage: LocalizedMedia
  mainImage: LocalizedMedia
  publishedAt: string
  status: 'draft' | 'published'
  order: number
}
export interface BlogSection {
  _id?: string
  heroTitle: Localized
  heroDescription: Localized
  heroImage: LocalizedMedia
  exploreLabel: Localized
  categories: BlogCategory[]
  articles: BlogArticle[]
}
export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api' }),
  tagTypes: ['Blog'],
  endpoints: (builder) => ({
    getBlogSection: builder.query<BlogSection, void>({
      query: () => '/blog',
      transformResponse: (r: { data: BlogSection }) => r.data,
      providesTags: ['Blog'],
    }),
    updateBlogSection: builder.mutation<BlogSection, BlogSection>({
      query: (body) => ({ url: '/blog', method: 'PUT', body }),
      transformResponse: (r: { data: BlogSection }) => r.data,
      invalidatesTags: ['Blog'],
    }),
  }),
})
export const { useGetBlogSectionQuery, useUpdateBlogSectionMutation } = blogApi
