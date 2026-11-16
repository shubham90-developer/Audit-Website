// src/store/api/whoWeServeApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types ---------- */

export type CardKind = 'serve' | 'why'

export interface WhoWeServeSection {
  _id: string
  pillTitle: Localized
  pillHighlight: Localized
  whyTitle: Localized
  brandName: Localized
  whyIntroStart: Localized
  whyIntroBold: Localized
  whyIntroEnd: Localized
  leftBg: LocalizedMedia
  createdAt: string
  updatedAt: string
}

export interface WhoWeServeCard {
  _id: string
  kind: CardKind
  title: Localized
  text: Localized
  image: LocalizedMedia
  order: number
  createdAt: string
  updatedAt: string
}

export interface WhoWeServeData {
  section: WhoWeServeSection
  serve: WhoWeServeCard[]
  why: WhoWeServeCard[]
}

export interface SectionText {
  pillTitle: Localized
  pillHighlight: Localized
  whyTitle: Localized
  brandName: Localized
  whyIntroStart: Localized
  whyIntroBold: Localized
  whyIntroEnd: Localized
}

export interface SectionFiles {
  leftBgEn?: File
  leftBgAr?: File
}

export interface CardText {
  kind: CardKind
  title: Localized
  text: Localized
  order?: number
}

export interface CardFiles {
  imageEn?: File
  imageAr?: File
}

/* ---------- Multipart builder ---------- */

// Objects and arrays are sent as JSON strings. Files are added by field name.
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
      if (file instanceof File) fd.append(field, file)
    }
  }

  return fd
}

/* ---------- API slice ---------- */

export const whoWeServeApi = createApi({
  reducerPath: 'whoWeServeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    // Admin writes need the x-admin-key header. Don't put the key in a
    // NEXT_PUBLIC_ variable. Use a server-side route or a login token.
  }),
  tagTypes: ['WhoWeServe'],
  endpoints: (builder) => ({
    getWhoWeServe: builder.query<WhoWeServeData, void>({
      query: () => '/who-we-serve',
      transformResponse: (res: { data: WhoWeServeData }) => res.data,
      providesTags: [{ type: 'WhoWeServe', id: 'ALL' }],
    }),

    updateSection: builder.mutation<WhoWeServeSection, { data: SectionText; files?: SectionFiles }>({
      query: ({ data, files }) => ({
        url: '/who-we-serve/section',
        method: 'PATCH',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: WhoWeServeSection }) => res.data,
      invalidatesTags: [{ type: 'WhoWeServe', id: 'ALL' }],
    }),

    createCard: builder.mutation<WhoWeServeCard, { data: CardText; files?: CardFiles }>({
      query: ({ data, files }) => ({
        url: '/who-we-serve/cards',
        method: 'POST',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: WhoWeServeCard }) => res.data,
      invalidatesTags: [{ type: 'WhoWeServe', id: 'ALL' }],
    }),

    updateCard: builder.mutation<
      WhoWeServeCard,
      {
        id: string
        data?: Partial<Omit<CardText, 'kind'>>
        files?: CardFiles
        removePublicIds?: string[]
      }
    >({
      query: ({ id, data, files, removePublicIds }) => ({
        url: `/who-we-serve/cards/${id}`,
        method: 'PATCH',
        body: buildFormData({ ...data, ...(removePublicIds && { removePublicIds }) }, files),
      }),
      transformResponse: (res: { data: WhoWeServeCard }) => res.data,
      invalidatesTags: [{ type: 'WhoWeServe', id: 'ALL' }],
    }),

    deleteCard: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/who-we-serve/cards/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'WhoWeServe', id: 'ALL' }],
    }),
  }),
})

export const { useGetWhoWeServeQuery, useUpdateSectionMutation, useCreateCardMutation, useUpdateCardMutation, useDeleteCardMutation } = whoWeServeApi
