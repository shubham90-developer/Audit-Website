import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types ---------- */

export interface GlobalMarketsSection {
  _id: string
  badge: Localized
  title: Localized
  highlightedTitle: Localized
  description: Localized
  sideTitle: Localized
  bgImage: LocalizedMedia
  createdAt: string
  updatedAt: string
}

export interface GlobalMarket {
  _id: string
  title: Localized
  image: LocalizedMedia
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GlobalMarketsData {
  section: GlobalMarketsSection
  markets: GlobalMarket[]
}

/* ---------- Section Types ---------- */

export interface SectionText {
  badge: Localized
  title: Localized
  highlightedTitle: Localized
  description: Localized
  sideTitle: Localized
}

export interface SectionFiles {
  bgImageEn?: File
  bgImageAr?: File
}

/* ---------- Country Types ---------- */

export interface MarketText {
  title: Localized
  order?: number
  isActive?: boolean
}

export interface MarketFiles {
  marketImageEn?: File
  marketImageAr?: File
}

/* ---------- Multipart Builder ---------- */

const buildFormData = (data?: object, files?: object): FormData => {
  const fd = new FormData()

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue

      fd.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
    }
  }

  if (files) {
    for (const [field, file] of Object.entries(files)) {
      if (file instanceof File) {
        fd.append(field, file)
      }
    }
  }

  return fd
}

/* ---------- API Slice ---------- */

export const globalMarketsApi = createApi({
  reducerPath: 'globalMarketsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }),

  tagTypes: ['GlobalMarkets'],

  endpoints: (builder) => ({
    // GET section + country cards
    getGlobalMarkets: builder.query<GlobalMarketsData, void>({
      query: () => '/global-markets',

      transformResponse: (res: { data: GlobalMarketsData }) => res.data,

      providesTags: [{ type: 'GlobalMarkets', id: 'ALL' }],
    }),

    // UPDATE MAIN SECTION
    updateSection: builder.mutation<GlobalMarketsSection, { data: Partial<SectionText>; files?: SectionFiles }>({
      query: ({ data, files }) => ({
        url: '/global-markets/section',
        method: 'PATCH',
        body: buildFormData(data, files),
      }),

      transformResponse: (res: { data: GlobalMarketsSection }) => res.data,

      invalidatesTags: [{ type: 'GlobalMarkets', id: 'ALL' }],
    }),

    // CREATE COUNTRY CARD
    createMarket: builder.mutation<GlobalMarket, { data: MarketText; files?: MarketFiles }>({
      query: ({ data, files }) => ({
        url: '/global-markets/countries',
        method: 'POST',
        body: buildFormData(data, files),
      }),

      transformResponse: (res: { data: GlobalMarket }) => res.data,

      invalidatesTags: [{ type: 'GlobalMarkets', id: 'ALL' }],
    }),

    // UPDATE COUNTRY CARD
    updateMarket: builder.mutation<
      GlobalMarket,
      {
        id: string
        data: Partial<MarketText>
        files?: MarketFiles
      }
    >({
      query: ({ id, data, files }) => ({
        url: `/global-markets/countries/${id}`,
        method: 'PATCH',
        body: buildFormData(data, files),
      }),

      transformResponse: (res: { data: GlobalMarket }) => res.data,

      invalidatesTags: [{ type: 'GlobalMarkets', id: 'ALL' }],
    }),

    // DELETE COUNTRY CARD
    deleteMarket: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/global-markets/countries/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: [{ type: 'GlobalMarkets', id: 'ALL' }],
    }),
  }),
})

/* ---------- Export Hooks ---------- */

export const { useGetGlobalMarketsQuery, useUpdateSectionMutation, useCreateMarketMutation, useUpdateMarketMutation, useDeleteMarketMutation } =
  globalMarketsApi
