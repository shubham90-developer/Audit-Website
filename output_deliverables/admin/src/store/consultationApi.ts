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

export interface IConsultationSection {
  _id: string
  title: ILocalized
  colorTitle: ILocalized
  subtitle: ILocalized
  watermark: ILocalized
  bulletPoints: ILocalized[]
  bgImage?: IMedia
}

export interface IConsultationEnquiry {
  _id: string
  fullName: string
  email: string
  phone: string
  companyName?: string
  serviceRequired: string
  turnoverRange?: string
  notes?: string
  status: 'new' | 'contacted' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface ConsultationResponse {
  section: IConsultationSection
  enquiries: IConsultationEnquiry[]
}

export const consultationApi = createApi({
  reducerPath: 'consultationApi',
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
  tagTypes: ['Consultation'],
  endpoints: (builder) => ({
    getConsultationData: builder.query<ConsultationResponse, void>({
      query: () => '/book-consultation',
      providesTags: ['Consultation'],
    }),

    updateConsultationSection: builder.mutation<IConsultationSection, FormData>({
      query: (body) => ({
        url: '/book-consultation/section',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Consultation'],
    }),

    getConsultationEnquiries: builder.query<IConsultationEnquiry[], { status?: string } | void>({
      query: (params) => {
        let url = '/book-consultation/enquiries'
        if (params?.status) url += `?status=${params.status}`
        return url
      },
      providesTags: ['Consultation'],
    }),

    updateConsultationStatus: builder.mutation<IConsultationEnquiry, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/book-consultation/enquiries/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Consultation'],
    }),

    deleteConsultationEnquiry: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/book-consultation/enquiries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Consultation'],
    }),
  }),
})

export const {
  useGetConsultationDataQuery,
  useUpdateConsultationSectionMutation,
  useGetConsultationEnquiriesQuery,
  useUpdateConsultationStatusMutation,
  useDeleteConsultationEnquiryMutation,
} = consultationApi
