// src/store/ourStoryApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types ---------- */

export interface OurStorySection {
  _id: string
  badge: Localized
  narrative: Localized // rich text (HTML)
  quote: Localized // rich text (HTML)
  authorName: Localized
  authorRole: Localized
  authorImage: LocalizedMedia
  bgImage: LocalizedMedia
  createdAt: string
  updatedAt: string
}

export interface OurStoryStep {
  _id: string
  title: Localized // rich text (HTML)
  text: Localized // rich text (HTML)
  image: LocalizedMedia
  order: number
  createdAt: string
  updatedAt: string
}

export interface OurStoryData {
  section: OurStorySection
  steps: OurStoryStep[]
}

export interface SectionText {
  badge: Localized
  narrative: Localized
  quote: Localized
  authorName: Localized
  authorRole: Localized
}

export interface SectionFiles {
  bgImageEn?: File
  bgImageAr?: File
  authorImageEn?: File
  authorImageAr?: File
}

export interface StepText {
  title: Localized
  text: Localized
  order?: number
}

export interface StepFiles {
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

export const ourStoryApi = createApi({
  reducerPath: 'ourStoryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }),
  tagTypes: ['OurStory'],
  endpoints: (builder) => ({
    getOurStory: builder.query<OurStoryData, void>({
      query: () => '/our-story',
      transformResponse: (res: { data: OurStoryData }) => res.data,
      providesTags: [{ type: 'OurStory', id: 'ALL' }],
    }),

    updateSection: builder.mutation<OurStorySection, { data: SectionText; files?: SectionFiles }>({
      query: ({ data, files }) => ({
        url: '/our-story/section',
        method: 'PATCH',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: OurStorySection }) => res.data,
      invalidatesTags: [{ type: 'OurStory', id: 'ALL' }],
    }),

    createStep: builder.mutation<OurStoryStep, { data: StepText; files?: StepFiles }>({
      query: ({ data, files }) => ({
        url: '/our-story/steps',
        method: 'POST',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: OurStoryStep }) => res.data,
      invalidatesTags: [{ type: 'OurStory', id: 'ALL' }],
    }),

    updateStep: builder.mutation<OurStoryStep, { id: string; data: Partial<StepText>; files?: StepFiles }>({
      query: ({ id, data, files }) => ({
        url: `/our-story/steps/${id}`,
        method: 'PATCH',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: OurStoryStep }) => res.data,
      invalidatesTags: [{ type: 'OurStory', id: 'ALL' }],
    }),

    deleteStep: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/our-story/steps/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'OurStory', id: 'ALL' }],
    }),
  }),
})

export const { useGetOurStoryQuery, useUpdateSectionMutation, useCreateStepMutation, useUpdateStepMutation, useDeleteStepMutation } = ourStoryApi
