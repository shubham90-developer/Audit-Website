import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '@/store'

export interface ILocalized {
  en: string
  ar: string
}

export interface IMedia {
  url: string
  publicId: string
}

export interface ITeamSection {
  _id: string
  title: ILocalized
  colorTitle: ILocalized
  subtitle: ILocalized
  watermark: ILocalized
}

export interface ITeamMember {
  _id: string
  type: 'leadership' | 'staff'
  name: ILocalized
  role: ILocalized
  experience?: ILocalized
  credentials?: ILocalized
  bio?: ILocalized
  image?: IMedia
  socialLinks?: {
    linkedin?: string
    twitter?: string
    email?: string
  }
  order: number
}

export interface TeamResponse {
  section: ITeamSection
  leadership: ITeamMember[]
  staff: ITeamMember[]
}

export const teamApi = createApi({
  reducerPath: 'teamApi',
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
  tagTypes: ['Team'],
  endpoints: (builder) => ({
    getTeam: builder.query<TeamResponse, void>({
      query: () => '/team',
      providesTags: ['Team'],
    }),

    updateTeamSection: builder.mutation<ITeamSection, Partial<ITeamSection>>({
      query: (body) => ({
        url: '/team/section',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Team'],
    }),

    createTeamMember: builder.mutation<ITeamMember, FormData>({
      query: (body) => ({
        url: '/team/members',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team'],
    }),

    updateTeamMember: builder.mutation<ITeamMember, { id: string; body: FormData }>({
      query: ({ id, body }) => ({
        url: `/team/members/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Team'],
    }),

    deleteTeamMember: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/team/members/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Team'],
    }),
  }),
})

export const {
  useGetTeamQuery,
  useUpdateTeamSectionMutation,
  useCreateTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamApi
