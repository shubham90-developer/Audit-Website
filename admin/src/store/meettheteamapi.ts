// src/store/meetTheTeamApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types ---------- */

export interface MeetTheTeam {
  _id: string
  leftTitle: Localized
  scriptTitle: Localized
  watermark: Localized
  image: LocalizedMedia
  createdAt: string
  updatedAt: string
}

export interface MeetTheTeamText {
  leftTitle: Localized
  scriptTitle: Localized
  watermark: Localized
}

export interface MeetTheTeamFiles {
  imageEn?: File
  imageAr?: File
}

/* ---------- Multipart builder ---------- */

// Takes `object` (not a Record) so interfaces like MeetTheTeamFiles are accepted.
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

export const meetTheTeamApi = createApi({
  reducerPath: 'meetTheTeamApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }),
  tagTypes: ['MeetTheTeam'],
  endpoints: (builder) => ({
    getMeetTheTeam: builder.query<MeetTheTeam, void>({
      query: () => '/meet-the-team',
      transformResponse: (res: { data: MeetTheTeam }) => res.data,
      providesTags: [{ type: 'MeetTheTeam', id: 'ONE' }],
    }),

    updateMeetTheTeam: builder.mutation<MeetTheTeam, { data: MeetTheTeamText; files?: MeetTheTeamFiles }>({
      query: ({ data, files }) => ({
        url: '/meet-the-team',
        method: 'PATCH',
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: MeetTheTeam }) => res.data,
      invalidatesTags: [{ type: 'MeetTheTeam', id: 'ONE' }],
    }),
  }),
})

export const { useGetMeetTheTeamQuery, useUpdateMeetTheTeamMutation } = meetTheTeamApi
