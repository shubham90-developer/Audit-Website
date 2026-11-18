import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export type EnquiryStatus = 'new' | 'contacted' | 'in_progress' | 'closed'
export interface Enquiry {
  _id: string
  name: string
  companyName: string
  email: string
  countryCode: string
  mobile: string
  service: string
  requirements: string
  language: 'en' | 'ar'
  status: EnquiryStatus
  adminNotes: string
  createdAt: string
  updatedAt: string
}
interface ListResponse {
  success: boolean
  data: Enquiry[]
  pagination: { page: number; limit: number; total: number; pages: number }
}
export interface EnquiryListParams {
  page?: number
  limit?: number
  status?: EnquiryStatus | ''
}

export const enquiryApi = createApi({
  reducerPath: 'enquiryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api',
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken')
        if (token) headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ['Enquiries'],
  endpoints: (builder) => ({
    getEnquiries: builder.query<ListResponse, EnquiryListParams | void>({
      query: (params) => ({ url: '/enquiries', params: params || undefined }),
      providesTags: ['Enquiries'],
    }),
    updateEnquiry: builder.mutation<Enquiry, { id: string; status?: EnquiryStatus; adminNotes?: string }>({
      query: ({ id, ...body }) => ({ url: `/enquiries/${id}`, method: 'PATCH', body }),
      transformResponse: (response: { data: Enquiry }) => response.data,
      invalidatesTags: ['Enquiries'],
    }),
    deleteEnquiry: builder.mutation<void, string>({
      query: (id) => ({ url: `/enquiries/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Enquiries'],
    }),
  }),
})
export const { useGetEnquiriesQuery, useUpdateEnquiryMutation, useDeleteEnquiryMutation } = enquiryApi
