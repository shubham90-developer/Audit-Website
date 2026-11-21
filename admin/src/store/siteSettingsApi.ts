import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export type Localized = { en: string; ar: string }
export type Media = { url: string; publicId: string }
export interface SiteSettings {
  _id?: string
  companyName: Localized
  tagline: Localized
  address: Localized
  officeHours: Localized
  footerDescription: Localized
  copyright: Localized
  footerQuickLinksTitle: Localized
  footerServicesTitle: Localized
  footerContactTitle: Localized
  headerFollowTitle: Localized
  whatsappCta: Localized
  phone: string
  alternatePhone: string
  email: string
  whatsapp: string
  googleMapsUrl: string
  mapEmbedUrl: string
  socials: { instagram: string; facebook: string; youtube: string; linkedin: string; x: string }
  logo: Media
  footerLogo: Media
  favicon: Media
}
export const siteSettingsApi = createApi({
  reducerPath: 'siteSettingsApi',
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
  tagTypes: ['SiteSettings'],
  endpoints: (builder) => ({
    getSiteSettings: builder.query<SiteSettings, void>({
      query: () => '/settings',
      transformResponse: (r: { data: SiteSettings }) => r.data,
      providesTags: ['SiteSettings'],
    }),
    updateSiteSettings: builder.mutation<SiteSettings, { data: SiteSettings; files: Partial<Record<'logo' | 'footerLogo' | 'favicon', File>> }>({
      query: ({ data, files }) => {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        Object.entries(files).forEach(([key, file]) => {
          if (file) body.append(key, file)
        })
        return { url: '/settings', method: 'PATCH', body }
      },
      transformResponse: (r: { data: SiteSettings }) => r.data,
      invalidatesTags: ['SiteSettings'],
    }),
  }),
})
export const { useGetSiteSettingsQuery, useUpdateSiteSettingsMutation } = siteSettingsApi
