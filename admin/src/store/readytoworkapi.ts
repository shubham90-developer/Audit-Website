// src/store/readyToWorkApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types ---------- */

export type FeatureIcon = 'users' | 'shield' | 'chart' | 'clock'

export const FEATURE_ICON_OPTIONS: { value: FeatureIcon; label: string }[] = [
  { value: 'users', label: 'Users' },
  { value: 'shield', label: 'Shield' },
  { value: 'chart', label: 'Chart' },
  { value: 'clock', label: 'Clock' },
]

export interface ReadyToWorkSection {
  _id: string
  title: Localized
  highlight: Localized
  description: Localized
  buttonLabel: Localized
  buttonHref: string
  tagOne: Localized
  tagTwo: Localized
  bgImage: LocalizedMedia
  createdAt: string
  updatedAt: string
}

export interface ReadyToWorkFeature {
  _id: string
  icon: FeatureIcon
  label: Localized
  order: number
  createdAt: string
  updatedAt: string
}

export interface ReadyToWorkData {
  section: ReadyToWorkSection
  features: ReadyToWorkFeature[]
}

export interface SectionText {
  title: Localized
  highlight: Localized
  description: Localized
  buttonLabel: Localized
  buttonHref: string
  tagOne: Localized
  tagTwo: Localized
}

export interface SectionFiles {
  bgImageEn?: File
  bgImageAr?: File
}

export interface FeatureText {
  icon: FeatureIcon
  label: Localized
  order?: number
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

export const readyToWorkApi = createApi({
  reducerPath: 'readyToWorkApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }),
  tagTypes: ['ReadyToWork'],
  endpoints: (builder) => ({
    getReadyToWork: builder.query<ReadyToWorkData, void>({
      query: () => '/ready-to-work',
      transformResponse: (res: { data: ReadyToWorkData }) => res.data,
      providesTags: [{ type: 'ReadyToWork', id: 'ALL' }],
    }),

    updateSection: builder.mutation<ReadyToWorkSection, { data: SectionText; files?: SectionFiles }>({
      query: ({ data, files }) => ({
        url: '/ready-to-work/section',
        method: 'PATCH',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: ReadyToWorkSection }) => res.data,
      invalidatesTags: [{ type: 'ReadyToWork', id: 'ALL' }],
    }),

    createFeature: builder.mutation<ReadyToWorkFeature, FeatureText>({
      query: (data) => ({
        url: '/ready-to-work/features',
        method: 'POST',
        body: buildFormData(data),
      }),
      transformResponse: (res: { data: ReadyToWorkFeature }) => res.data,
      invalidatesTags: [{ type: 'ReadyToWork', id: 'ALL' }],
    }),

    updateFeature: builder.mutation<ReadyToWorkFeature, { id: string; data: Partial<FeatureText> }>({
      query: ({ id, data }) => ({
        url: `/ready-to-work/features/${id}`,
        method: 'PATCH',
        body: buildFormData(data),
      }),
      transformResponse: (res: { data: ReadyToWorkFeature }) => res.data,
      invalidatesTags: [{ type: 'ReadyToWork', id: 'ALL' }],
    }),

    deleteFeature: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/ready-to-work/features/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'ReadyToWork', id: 'ALL' }],
    }),
  }),
})

export const { useGetReadyToWorkQuery, useUpdateSectionMutation, useCreateFeatureMutation, useUpdateFeatureMutation, useDeleteFeatureMutation } =
  readyToWorkApi
