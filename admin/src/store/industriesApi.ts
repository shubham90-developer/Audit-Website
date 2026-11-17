// src/store/industriesApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types ---------- */

export type IndustryIcon = 'government' | 'building' | 'energy' | 'truck' | 'heart' | 'globe' | 'gear' | 'chip' | 'users' | 'hand' | 'chart'

export const INDUSTRY_ICON_OPTIONS: { value: IndustryIcon; label: string }[] = [
  { value: 'government', label: 'Government (bank)' },
  { value: 'building', label: 'Building / real estate' },
  { value: 'energy', label: 'Energy (bolt)' },
  { value: 'truck', label: 'Truck / trading' },
  { value: 'heart', label: 'Heart / healthcare' },
  { value: 'globe', label: 'Globe / hospitality' },
  { value: 'gear', label: 'Gear / manufacturing' },
  { value: 'chip', label: 'Chip / technology' },
  { value: 'users', label: 'Users / family' },
  { value: 'hand', label: 'Hand / non-profit' },
  { value: 'chart', label: 'Chart (bars)' },
]

export interface IndustriesSection {
  _id: string
  watermark: Localized
  title: Localized // rich text (HTML)
  description: Localized
  footerTitle: Localized // rich text (HTML)
  footerNote: Localized
  footerIcon: IndustryIcon
  sectionBg: LocalizedMedia
  createdAt: string
  updatedAt: string
}

export interface Industry {
  _id: string
  icon: IndustryIcon
  title: Localized
  desc: Localized
  image: LocalizedMedia
  order: number
  createdAt: string
  updatedAt: string
}

export interface IndustriesData {
  section: IndustriesSection
  items: Industry[]
}

export interface SectionText {
  watermark: Localized
  title: Localized
  description: Localized
  footerTitle: Localized
  footerNote: Localized
  footerIcon: IndustryIcon
}

export interface SectionFiles {
  sectionBgEn?: File
  sectionBgAr?: File
}

export interface IndustryText {
  icon: IndustryIcon
  title: Localized
  desc: Localized
  order?: number
}

export interface IndustryFiles {
  imageEn?: File
  imageAr?: File
}

/* ---------- Multipart builder ---------- */

// Takes `object` (not a Record) so interfaces like SectionFiles are accepted.
const buildFormData = (data?: object, files?: object, removePublicIds?: string[]): FormData => {
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

  // one field per id, the backend reads them as a list
  removePublicIds?.forEach((id) => fd.append('removePublicIds', id))

  return fd
}

/* ---------- API slice ---------- */

export const industriesApi = createApi({
  reducerPath: 'industriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }),
  tagTypes: ['Industries'],
  endpoints: (builder) => ({
    getIndustries: builder.query<IndustriesData, void>({
      query: () => '/industries',
      transformResponse: (res: { data: IndustriesData }) => res.data,
      providesTags: [{ type: 'Industries', id: 'ALL' }],
    }),

    updateSection: builder.mutation<IndustriesSection, { data: SectionText; files?: SectionFiles }>({
      query: ({ data, files }) => ({
        url: '/industries/section',
        method: 'PATCH',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: IndustriesSection }) => res.data,
      invalidatesTags: [{ type: 'Industries', id: 'ALL' }],
    }),

    createIndustry: builder.mutation<Industry, { data: IndustryText; files?: IndustryFiles }>({
      query: ({ data, files }) => ({
        url: '/industries/items',
        method: 'POST',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: Industry }) => res.data,
      invalidatesTags: [{ type: 'Industries', id: 'ALL' }],
    }),

    updateIndustry: builder.mutation<Industry, { id: string; data: Partial<IndustryText>; files?: IndustryFiles; removePublicIds?: string[] }>({
      query: ({ id, data, files, removePublicIds }) => ({
        url: `/industries/items/${id}`,
        method: 'PATCH',
        body: buildFormData(data, files, removePublicIds),
      }),
      transformResponse: (res: { data: Industry }) => res.data,
      invalidatesTags: [{ type: 'Industries', id: 'ALL' }],
    }),

    deleteIndustry: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/industries/items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Industries', id: 'ALL' }],
    }),
  }),
})

export const { useGetIndustriesQuery, useUpdateSectionMutation, useCreateIndustryMutation, useUpdateIndustryMutation, useDeleteIndustryMutation } =
  industriesApi
