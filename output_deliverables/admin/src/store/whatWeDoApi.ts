// src/store/api/whatWeDoApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types ---------- */

export type IconKey = 'shield' | 'percent' | 'briefcase' | 'trending' | 'book'

export const ICON_OPTIONS: { value: IconKey; label: string }[] = [
  { value: 'shield', label: 'Shield' },
  { value: 'percent', label: 'Percent' },
  { value: 'briefcase', label: 'Briefcase' },
  { value: 'trending', label: 'Trending' },
  { value: 'book', label: 'Book' },
]

export interface WhatWeDoSection {
  _id: string
  title: Localized
  colorTitle: Localized
  subtitle: Localized
  watermark: Localized
  createdAt: string
  updatedAt: string
}

export interface WhatWeDoService {
  _id: string
  name: Localized
  desc: Localized
  icon: IconKey
  items: Localized[]
  image: LocalizedMedia
  order: number
  createdAt: string
  updatedAt: string
}

export interface WhatWeDoData {
  section: WhatWeDoSection
  services: WhatWeDoService[]
}

export interface SectionText {
  title: Localized
  colorTitle: Localized
  subtitle: Localized
  watermark: Localized
}

export interface ServiceText {
  name: Localized
  desc: Localized
  icon: IconKey
  items: Localized[]
  order?: number
}

export interface ServiceFiles {
  imageEn?: File
  imageAr?: File
}

/* ---------- Multipart builder ---------- */

const buildFormData = (data?: object, files?: ServiceFiles): FormData => {
  const fd = new FormData()

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue
      fd.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
    }
  }

  if (files?.imageEn) fd.append('imageEn', files.imageEn)
  if (files?.imageAr) fd.append('imageAr', files.imageAr)

  return fd
}

/* ---------- API slice ---------- */

export const whatWeDoApi = createApi({
  reducerPath: 'whatWeDoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    // Admin writes need the x-admin-key header. Don't put the key in a
    // NEXT_PUBLIC_ variable. Use a server-side route or a login token.
    // prepareHeaders: (headers) => { headers.set("x-admin-key", key); return headers; },
  }),
  tagTypes: ['WhatWeDo'],
  endpoints: (builder) => ({
    getWhatWeDo: builder.query<WhatWeDoData, void>({
      query: () => '/what-we-do',
      transformResponse: (res: { data: WhatWeDoData }) => res.data,
      providesTags: [{ type: 'WhatWeDo', id: 'ALL' }],
    }),

    updateSection: builder.mutation<WhatWeDoSection, SectionText>({
      query: (data) => ({
        url: '/what-we-do/section',
        method: 'PATCH',
        body: data, // JSON, the backend accepts it
      }),
      transformResponse: (res: { data: WhatWeDoSection }) => res.data,
      invalidatesTags: [{ type: 'WhatWeDo', id: 'ALL' }],
    }),

    createService: builder.mutation<WhatWeDoService, { data: ServiceText; files?: ServiceFiles }>({
      query: ({ data, files }) => ({
        url: '/what-we-do/services',
        method: 'POST',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: WhatWeDoService }) => res.data,
      invalidatesTags: [{ type: 'WhatWeDo', id: 'ALL' }],
    }),

    updateService: builder.mutation<
      WhatWeDoService,
      {
        id: string
        data?: Partial<ServiceText>
        files?: ServiceFiles
        removePublicIds?: string[]
      }
    >({
      query: ({ id, data, files, removePublicIds }) => ({
        url: `/what-we-do/services/${id}`,
        method: 'PATCH',
        body: buildFormData({ ...data, ...(removePublicIds && { removePublicIds }) }, files),
      }),
      transformResponse: (res: { data: WhatWeDoService }) => res.data,
      invalidatesTags: [{ type: 'WhatWeDo', id: 'ALL' }],
    }),

    deleteService: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/what-we-do/services/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'WhatWeDo', id: 'ALL' }],
    }),
  }),
})

export const { useGetWhatWeDoQuery, useUpdateSectionMutation, useCreateServiceMutation, useUpdateServiceMutation, useDeleteServiceMutation } =
  whatWeDoApi
