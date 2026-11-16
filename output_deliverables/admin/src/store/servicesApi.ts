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

export interface IServiceItem {
  _id: string
  categoryId: number
  categorySlug: string
  slug: string
  name: ILocalized
  sub: ILocalized
  icon: string
  image?: IMedia
  order: number
}

export interface IServiceCategory {
  _id: string
  categoryId: number
  slug: string
  name: ILocalized
  icon: string
  desc: ILocalized
  order: number
  services?: IServiceItem[]
}

export const servicesApi = createApi({
  reducerPath: 'servicesApi',
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
  tagTypes: ['Services'],
  endpoints: (builder) => ({
    getServices: builder.query<IServiceCategory[], void>({
      query: () => '/services',
      transformResponse: (response: { success: boolean; data: IServiceCategory[] }) => response.data,
      providesTags: ['Services'],
    }),

    createCategory: builder.mutation<IServiceCategory, Partial<IServiceCategory>>({
      query: (body) => ({
        url: '/services/categories',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Services'],
    }),

    updateCategory: builder.mutation<IServiceCategory, { id: string; body: Partial<IServiceCategory> }>({
      query: ({ id, body }) => ({
        url: `/services/categories/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Services'],
    }),

    deleteCategory: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/services/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services'],
    }),

    createServiceItem: builder.mutation<IServiceItem, FormData>({
      query: (body) => ({
        url: '/services/items',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Services'],
    }),

    updateServiceItem: builder.mutation<IServiceItem, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/services/items/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Services'],
    }),

    deleteServiceItem: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/services/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Services'],
    }),
  }),
})

export const {
  useGetServicesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useCreateServiceItemMutation,
  useUpdateServiceItemMutation,
  useDeleteServiceItemMutation,
} = servicesApi
