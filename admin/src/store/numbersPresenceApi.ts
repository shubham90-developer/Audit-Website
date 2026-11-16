// src/store/api/numbersPresenceApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types ---------- */

export type StatIcon = 'users' | 'globe' | 'document' | 'mappin'
export type StatColor = 'violet' | 'emerald' | 'green' | 'teal'

export const STAT_ICON_OPTIONS: { value: StatIcon; label: string }[] = [
  { value: 'users', label: 'Users' },
  { value: 'globe', label: 'Globe' },
  { value: 'document', label: 'Document' },
  { value: 'mappin', label: 'Map pin' },
]

export const STAT_COLOR_OPTIONS: { value: StatColor; label: string }[] = [
  { value: 'violet', label: 'Violet' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'green', label: 'Green' },
  { value: 'teal', label: 'Teal' },
]

export interface NumbersSection {
  _id: string
  numbersTitle: Localized // rich text (HTML)
  securityTitle: Localized // rich text (HTML)
  securityText: Localized // rich text (HTML)
  insuranceText: Localized // rich text (HTML)
  globalLabel: Localized // rich text (HTML)
  globalTitle: Localized // rich text (HTML)
  globalText: Localized // rich text (HTML)
  sectionBg: LocalizedMedia
  panelBg: LocalizedMedia
  createdAt: string
  updatedAt: string
}

export interface NumbersStat {
  _id: string
  icon: StatIcon
  color: StatColor
  value: number
  suffix: string
  label: Localized
  order: number
  createdAt: string
  updatedAt: string
}

export interface NumbersOffice {
  _id: string
  city: Localized
  country: Localized
  flagCode: string
  image: LocalizedMedia
  order: number
  createdAt: string
  updatedAt: string
}

export interface NumbersPresenceData {
  section: NumbersSection
  stats: NumbersStat[]
  offices: NumbersOffice[]
}

export type SectionText = Pick<
  NumbersSection,
  'numbersTitle' | 'securityTitle' | 'securityText' | 'insuranceText' | 'globalLabel' | 'globalTitle' | 'globalText'
>

export interface SectionFiles {
  sectionBgEn?: File
  sectionBgAr?: File
  panelBgEn?: File
  panelBgAr?: File
}

export interface StatText {
  icon: StatIcon
  color: StatColor
  value: number
  suffix: string
  label: Localized
  order?: number
}

export interface OfficeText {
  city: Localized
  country: Localized
  flagCode: string
  order?: number
}

export interface OfficeFiles {
  imageEn?: File
  imageAr?: File
}

/* ---------- Multipart builder ---------- */

// Takes `object` (not a Record) so interfaces like SectionFiles are accepted.
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

export const numbersPresenceApi = createApi({
  reducerPath: 'numbersPresenceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }),
  tagTypes: ['NumbersPresence'],
  endpoints: (builder) => ({
    getNumbersPresence: builder.query<NumbersPresenceData, void>({
      query: () => '/numbers-presence',
      transformResponse: (res: { data: NumbersPresenceData }) => res.data,
      providesTags: [{ type: 'NumbersPresence', id: 'ALL' }],
    }),

    updateSection: builder.mutation<NumbersSection, { data: SectionText; files?: SectionFiles }>({
      query: ({ data, files }) => ({
        url: '/numbers-presence/section',
        method: 'PATCH',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: NumbersSection }) => res.data,
      invalidatesTags: [{ type: 'NumbersPresence', id: 'ALL' }],
    }),

    createStat: builder.mutation<NumbersStat, StatText>({
      query: (data) => ({
        url: '/numbers-presence/stats',
        method: 'POST',
        body: buildFormData(data),
      }),
      transformResponse: (res: { data: NumbersStat }) => res.data,
      invalidatesTags: [{ type: 'NumbersPresence', id: 'ALL' }],
    }),

    updateStat: builder.mutation<NumbersStat, { id: string; data: Partial<StatText> }>({
      query: ({ id, data }) => ({
        url: `/numbers-presence/stats/${id}`,
        method: 'PATCH',
        body: buildFormData(data),
      }),
      transformResponse: (res: { data: NumbersStat }) => res.data,
      invalidatesTags: [{ type: 'NumbersPresence', id: 'ALL' }],
    }),

    deleteStat: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/numbers-presence/stats/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'NumbersPresence', id: 'ALL' }],
    }),

    createOffice: builder.mutation<NumbersOffice, { data: OfficeText; files?: OfficeFiles }>({
      query: ({ data, files }) => ({
        url: '/numbers-presence/offices',
        method: 'POST',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: NumbersOffice }) => res.data,
      invalidatesTags: [{ type: 'NumbersPresence', id: 'ALL' }],
    }),

    updateOffice: builder.mutation<
      NumbersOffice,
      {
        id: string
        data?: Partial<OfficeText>
        files?: OfficeFiles
        removePublicIds?: string[]
      }
    >({
      query: ({ id, data, files, removePublicIds }) => ({
        url: `/numbers-presence/offices/${id}`,
        method: 'PATCH',
        body: buildFormData({ ...data, ...(removePublicIds && { removePublicIds }) }, files),
      }),
      transformResponse: (res: { data: NumbersOffice }) => res.data,
      invalidatesTags: [{ type: 'NumbersPresence', id: 'ALL' }],
    }),

    deleteOffice: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/numbers-presence/offices/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'NumbersPresence', id: 'ALL' }],
    }),
  }),
})

export const {
  useGetNumbersPresenceQuery,
  useUpdateSectionMutation,
  useCreateStatMutation,
  useUpdateStatMutation,
  useDeleteStatMutation,
  useCreateOfficeMutation,
  useUpdateOfficeMutation,
  useDeleteOfficeMutation,
} = numbersPresenceApi
