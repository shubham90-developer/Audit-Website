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

export interface IIndustriesSection {
  _id: string
  title: ILocalized
  colorTitle: ILocalized
  subtitle: ILocalized
  watermark: ILocalized
  bgImage?: IMedia
}

export interface IIndustryItem {
  _id: string
  name: ILocalized
  text: ILocalized
  icon: string
  order: number
}

export interface IndustriesResponse {
  section: IIndustriesSection
  data: IIndustryItem[]
}

export const industriesApi = createApi({
  reducerPath: 'industriesApi',
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
  tagTypes: ['Industries'],
  endpoints: (builder) => ({
    getIndustries: builder.query<IndustriesResponse, void>({
      query: () => '/industries',
      providesTags: ['Industries'],
    }),

    updateIndustriesSection: builder.mutation<IIndustriesSection, FormData>({
      query: (body) => ({
        url: '/industries/section',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Industries'],
    }),

    createIndustryItem: builder.mutation<IIndustryItem, Partial<IIndustryItem>>({
      query: (body) => ({
        url: '/industries/items',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Industries'],
    }),

    updateIndustryItem: builder.mutation<IIndustryItem, { id: string; body: Partial<IIndustryItem> }>({
      query: ({ id, body }) => ({
        url: `/industries/items/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Industries'],
    }),

    deleteIndustryItem: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/industries/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Industries'],
    }),
  }),
})

export const {
  useGetIndustriesQuery,
  useUpdateIndustriesSectionMutation,
  useCreateIndustryItemMutation,
  useUpdateIndustryItemMutation,
  useDeleteIndustryItemMutation,
} = industriesApi
