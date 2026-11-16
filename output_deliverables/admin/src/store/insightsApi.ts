import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface ILocalized {
  en: string
  ar: string
}

export interface IMedia {
  url: string
  publicId: string
}

export interface IInsight {
  _id: string
  type: 'blog' | 'press' | 'video'
  title: ILocalized
  excerpt: ILocalized
  content?: ILocalized
  category: ILocalized
  tag?: ILocalized
  author?: ILocalized
  reviewedBy?: ILocalized
  readTime?: ILocalized
  date: string
  slug: string
  media: IMedia
  featured: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface InsightsResponse {
  all: IInsight[]
  blogs: IInsight[]
  press: IInsight[]
  videos: IInsight[]
}

export const insightsApi = createApi({
  reducerPath: 'insightsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.auth?.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Insights'],
  endpoints: (builder) => ({
    getInsights: builder.query<InsightsResponse, { type?: string; featured?: boolean } | void>({
      query: (params) => {
        let url = '/insights'
        if (params?.type) url += `?type=${params.type}`
        return url
      },
      transformResponse: (response: { success: boolean; data: InsightsResponse }) => response.data,
      providesTags: ['Insights'],
    }),

    createInsight: builder.mutation<IInsight, FormData>({
      query: (body) => ({
        url: '/insights',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Insights'],
    }),

    updateInsight: builder.mutation<IInsight, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/insights/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Insights'],
    }),

    deleteInsight: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/insights/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Insights'],
    }),
  }),
})

export const {
  useGetInsightsQuery,
  useCreateInsightMutation,
  useUpdateInsightMutation,
  useDeleteInsightMutation,
} = insightsApi
