import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

// ================= TYPES =================

export interface LeadershipSection {
  _id: string

  leadershipTitle: Localized
  leadershipDescription: Localized

  teamTitle: Localized
  teamDescription: Localized

  backgroundImage: LocalizedMedia

  createdAt: string
  updatedAt: string
}

export interface LeadershipMember {
  _id: string

  name: Localized
  role: Localized
  department: Localized
  bio: Localized

  image: LocalizedMedia

  isFeatured: boolean
  isActive: boolean
  order: number

  createdAt: string
  updatedAt: string
}

export interface LeadershipData {
  section: LeadershipSection
  members: LeadershipMember[]
}

export interface PublicLeadershipData {
  section: LeadershipSection
  featuredLeader: LeadershipMember | null
  members: LeadershipMember[]
}

export interface SectionText {
  leadershipTitle: Localized
  leadershipDescription: Localized
  teamTitle: Localized
  teamDescription: Localized
}

export interface SectionFiles {
  bgImageEn?: File
  bgImageAr?: File
}

export interface MemberText {
  name: Localized
  role: Localized
  department: Localized
  bio: Localized
  isFeatured: boolean
  isActive: boolean
  order: number
}

export interface MemberFiles {
  imageEn?: File
  imageAr?: File
}

// ================= FORM DATA =================

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

// ================= API =================

export const leadershipApi = createApi({
  reducerPath: 'leadershipApi',

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }),

  tagTypes: ['Leadership'],

  endpoints: (builder) => ({
    // Public website
    getLeadership: builder.query<PublicLeadershipData, void>({
      query: () => '/leadership',

      transformResponse: (res: { data: PublicLeadershipData }) => res.data,
    }),

    // Admin content
    getLeadershipAdmin: builder.query<LeadershipData, void>({
      query: () => '/leadership/admin',

      transformResponse: (res: { data: LeadershipData }) => res.data,

      providesTags: [{ type: 'Leadership', id: 'ALL' }],
    }),

    // Update section
    updateLeadershipSection: builder.mutation<LeadershipSection, { data: SectionText; files?: SectionFiles }>({
      query: ({ data, files }) => ({
        url: '/leadership/section',
        method: 'PATCH',
        body: buildFormData(data, files),
      }),

      transformResponse: (res: { data: LeadershipSection }) => res.data,

      invalidatesTags: [{ type: 'Leadership', id: 'ALL' }],
    }),

    // Create member
    createLeadershipMember: builder.mutation<LeadershipMember, { data: MemberText; files?: MemberFiles }>({
      query: ({ data, files }) => ({
        url: '/leadership/members',
        method: 'POST',
        body: buildFormData(data, files),
      }),

      transformResponse: (res: { data: LeadershipMember }) => res.data,

      invalidatesTags: [{ type: 'Leadership', id: 'ALL' }],
    }),

    // Update member
    updateLeadershipMember: builder.mutation<
      LeadershipMember,
      {
        id: string
        data: Partial<MemberText>
        files?: MemberFiles
      }
    >({
      query: ({ id, data, files }) => ({
        url: `/leadership/members/${id}`,
        method: 'PATCH',
        body: buildFormData(data, files),
      }),

      transformResponse: (res: { data: LeadershipMember }) => res.data,

      invalidatesTags: [{ type: 'Leadership', id: 'ALL' }],
    }),

    // Delete member
    deleteLeadershipMember: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/leadership/members/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: [{ type: 'Leadership', id: 'ALL' }],
    }),
  }),
})

export const {
  useGetLeadershipQuery,
  useGetLeadershipAdminQuery,
  useUpdateLeadershipSectionMutation,
  useCreateLeadershipMemberMutation,
  useUpdateLeadershipMemberMutation,
  useDeleteLeadershipMemberMutation,
} = leadershipApi
