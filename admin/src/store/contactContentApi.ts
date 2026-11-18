import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'
export type { Localized } from './bannerApi'
export type CardKey = 'phone' | 'email' | 'whatsapp' | 'address'
export type FeatureIcon = 'headphones' | 'clock' | 'users' | 'shield'
export interface ContactCard {
  _id?: string
  key: CardKey
  label: Localized
  value: Localized
  href: string
  order: number
  isActive: boolean
}
export interface ContactFeature {
  _id?: string
  icon: FeatureIcon
  title: Localized
  description: Localized
  order: number
  isActive: boolean
}
export interface ContactContent {
  _id: string
  heroBadge: Localized
  heroTitle: Localized
  heroHighlight: Localized
  heroDescription: Localized
  heroBgImage: LocalizedMedia
  heroVideo: LocalizedMedia
  contactCards: ContactCard[]
  sectionBadge: Localized
  sectionTitle: Localized
  sectionHighlight: Localized
  sectionDescription: Localized
  sectionNote: Localized
  sectionBgImage: LocalizedMedia
  features: ContactFeature[]
  formTitle: Localized
  formDescription: Localized
  formDisclaimer: Localized
}
export type TextKey =
  | 'heroBadge'
  | 'heroTitle'
  | 'heroHighlight'
  | 'heroDescription'
  | 'sectionBadge'
  | 'sectionTitle'
  | 'sectionHighlight'
  | 'sectionDescription'
  | 'sectionNote'
  | 'formTitle'
  | 'formDescription'
  | 'formDisclaimer'
export type ContactContentText = Pick<ContactContent, TextKey | 'contactCards' | 'features'>
export type ContactContentFiles = Partial<
  Record<'heroBgImageEn' | 'heroBgImageAr' | 'heroVideoEn' | 'heroVideoAr' | 'sectionBgImageEn' | 'sectionBgImageAr', File>
>
const formData = (data: ContactContentText, files: ContactContentFiles) => {
  const fd = new FormData()
  for (const [key, value] of Object.entries(data)) fd.append(key, JSON.stringify(value))
  for (const [key, value] of Object.entries(files)) if (value instanceof File) fd.append(key, value)
  return fd
}
export const contactContentApi = createApi({
  reducerPath: 'contactContentApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }),
  tagTypes: ['ContactContent'],
  endpoints: (builder) => ({
    getContactContent: builder.query<ContactContent, void>({
      query: () => '/contact-content',
      transformResponse: (res: { data: ContactContent }) => res.data,
      providesTags: ['ContactContent'],
    }),
    updateContactContent: builder.mutation<ContactContent, { data: ContactContentText; files: ContactContentFiles }>({
      query: ({ data, files }) => ({ url: '/contact-content', method: 'PATCH', body: formData(data, files) }),
      transformResponse: (res: { data: ContactContent }) => res.data,
      invalidatesTags: ['ContactContent'],
    }),
  }),
})
export const { useGetContactContentQuery, useUpdateContactContentMutation } = contactContentApi
