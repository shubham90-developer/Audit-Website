// src/store/howWeWorkApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types ---------- */

export type StepIcon = 'headset' | 'document' | 'settings' | 'shield'

export const STEP_ICON_OPTIONS: { value: StepIcon; label: string }[] = [
  { value: 'headset', label: 'Headset' },
  { value: 'document', label: 'Document' },
  { value: 'settings', label: 'Settings (gear)' },
  { value: 'shield', label: 'Shield' },
]

export interface HowWeWorkSection {
  _id: string
  title: Localized
  colorTitle: Localized
  subtitle: Localized
  watermark: Localized
  image: LocalizedMedia
  createdAt: string
  updatedAt: string
}

export interface HowWeWorkStep {
  _id: string
  title: Localized
  desc: Localized
  icon: StepIcon
  order: number
  createdAt: string
  updatedAt: string
}

export interface HowWeWorkData {
  section: HowWeWorkSection
  steps: HowWeWorkStep[]
}

export interface SectionText {
  title: Localized
  colorTitle: Localized
  subtitle: Localized
  watermark: Localized
}

export interface SectionFiles {
  imageEn?: File
  imageAr?: File
}

export interface StepText {
  title: Localized
  desc: Localized
  icon: StepIcon
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

export const howWeWorkApi = createApi({
  reducerPath: 'howWeWorkApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }),
  tagTypes: ['HowWeWork'],
  endpoints: (builder) => ({
    getHowWeWork: builder.query<HowWeWorkData, void>({
      query: () => '/how-we-work',
      transformResponse: (res: { data: HowWeWorkData }) => res.data,
      providesTags: [{ type: 'HowWeWork', id: 'ALL' }],
    }),

    updateSection: builder.mutation<HowWeWorkSection, { data: SectionText; files?: SectionFiles }>({
      query: ({ data, files }) => ({
        url: '/how-we-work/section',
        method: 'PATCH',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: HowWeWorkSection }) => res.data,
      invalidatesTags: [{ type: 'HowWeWork', id: 'ALL' }],
    }),

    createStep: builder.mutation<HowWeWorkStep, StepText>({
      query: (data) => ({
        url: '/how-we-work/steps',
        method: 'POST',
        body: buildFormData(data),
      }),
      transformResponse: (res: { data: HowWeWorkStep }) => res.data,
      invalidatesTags: [{ type: 'HowWeWork', id: 'ALL' }],
    }),

    updateStep: builder.mutation<HowWeWorkStep, { id: string; data: Partial<StepText> }>({
      query: ({ id, data }) => ({
        url: `/how-we-work/steps/${id}`,
        method: 'PATCH',
        body: buildFormData(data),
      }),
      transformResponse: (res: { data: HowWeWorkStep }) => res.data,
      invalidatesTags: [{ type: 'HowWeWork', id: 'ALL' }],
    }),

    deleteStep: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/how-we-work/steps/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'HowWeWork', id: 'ALL' }],
    }),
  }),
})

export const { useGetHowWeWorkQuery, useUpdateSectionMutation, useCreateStepMutation, useUpdateStepMutation, useDeleteStepMutation } = howWeWorkApi
