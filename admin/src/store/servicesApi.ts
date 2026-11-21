import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia, BannerMedia } from './bannerApi'

// imgPicker.tsx imports `Media` from this file
export type Media = BannerMedia

export interface IServiceDetail {
  _id?: string
  title: Localized
  description: Localized
  img: LocalizedMedia
}

export interface IService {
  _id: string

  title: Localized
  desc: Localized

  iconImg: LocalizedMedia
  cardImg: LocalizedMedia
  mainImg: LocalizedMedia

  bgImage: LocalizedMedia
  bgVideo: LocalizedMedia

  details: IServiceDetail[]

  createdAt: string
  updatedAt: string
}

export interface ServicesBanner {
  _id: string

  title: Localized
  subtitle: Localized
  bgImage: LocalizedMedia

  createdAt: string
  updatedAt: string
}

export interface ServicesBannerText {
  title: Localized
  subtitle: Localized
}

export interface ServicesBannerFiles {
  bgImageEn?: File
  bgImageAr?: File
}

export interface ServiceText {
  title: Localized
  desc: Localized
  details: {
    _id?: string
    title: Localized
    description: Localized
  }[]
}

export interface ServiceFiles {
  iconImgEn?: File
  iconImgAr?: File

  cardImgEn?: File
  cardImgAr?: File

  mainImgEn?: File
  mainImgAr?: File

  bgImageEn?: File
  bgImageAr?: File

  bgVideoEn?: File
  bgVideoAr?: File

  [key: `detailImageEn_${number}`]: File | undefined
  [key: `detailImageAr_${number}`]: File | undefined
}

const buildFormData = (data?: object, files?: object): FormData => {
  const fd = new FormData()

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return

      fd.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
    })
  }

  if (files) {
    Object.entries(files).forEach(([key, file]) => {
      if (file instanceof File) {
        fd.append(key, file)
      }
    })
  }

  return fd
}

export const servicesApi = createApi({
  reducerPath: 'servicesApi',

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),

  tagTypes: ['Services', 'ServicesBanner'],

  endpoints: (builder) => ({
    getAdminServices: builder.query<IService[], void>({
      query: () => '/services',

      transformResponse: (res: { data: IService[] }) => res.data,

      providesTags: ['Services'],
    }),

    getServicesBanner: builder.query<ServicesBanner, void>({
      query: () => '/services/page-banner',

      transformResponse: (res: { data: ServicesBanner }) => res.data,

      providesTags: ['ServicesBanner'],
    }),

    updateServicesBanner: builder.mutation<ServicesBanner, { data: ServicesBannerText; files?: ServicesBannerFiles }>({
      query: ({ data, files }) => ({
        url: '/services/page-banner',
        method: 'PATCH',
        body: buildFormData(data, files),
      }),

      transformResponse: (res: { data: ServicesBanner }) => res.data,

      invalidatesTags: ['ServicesBanner'],
    }),

    getServiceById: builder.query<IService, string>({
      query: (id) => `/services/${id}`,

      transformResponse: (res: { data: IService }) => res.data,

      providesTags: ['Services'],
    }),

    createService: builder.mutation<IService, { data: ServiceText; files?: ServiceFiles }>({
      query: ({ data, files }) => ({
        url: '/services',
        method: 'POST',
        body: buildFormData(data, files),
      }),

      transformResponse: (res: { data: IService }) => res.data,

      invalidatesTags: ['Services'],
    }),

    updateService: builder.mutation<
      IService,
      {
        id: string
        data: Partial<ServiceText>
        files?: ServiceFiles
      }
    >({
      query: ({ id, data, files }) => ({
        url: `/services/${id}`,
        method: 'PATCH',
        body: buildFormData(data, files),
      }),

      transformResponse: (res: { data: IService }) => res.data,

      invalidatesTags: ['Services'],
    }),

    deleteService: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/services/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: ['Services'],
    }),
  }),
})

export const {
  useGetAdminServicesQuery,
  useGetServicesBannerQuery,
  useUpdateServicesBannerMutation,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = servicesApi
