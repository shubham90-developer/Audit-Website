import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface ILocalized {
  en: string
  ar: string
}

export interface ISlidingText {
  _id: string
  items: ILocalized[]
  speed?: number
  direction?: 'left' | 'right'
  createdAt: string
  updatedAt: string
}

export const slidingTextApi = createApi({
  reducerPath: 'slidingTextApi',
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
  tagTypes: ['SlidingText'],
  endpoints: (builder) => ({
    getSlidingText: builder.query<ISlidingText, void>({
      query: () => '/sliding-text',
      transformResponse: (response: { success: boolean; data: ISlidingText }) => response.data,
      providesTags: ['SlidingText'],
    }),

    updateSlidingText: builder.mutation<ISlidingText, Partial<ISlidingText>>({
      query: (body) => ({
        url: '/sliding-text',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['SlidingText'],
    }),
  }),
})

export const { useGetSlidingTextQuery, useUpdateSlidingTextMutation } = slidingTextApi
