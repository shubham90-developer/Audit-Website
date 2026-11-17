// src/store/aboutUsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types ---------- */

// Icon keys the public site maps to icons
export const STAT_ICON_OPTIONS: { value: string; label: string }[] = [
  { value: 'building', label: 'Building' },
  { value: 'chart', label: 'Chart (bars)' },
  { value: 'star', label: 'Star' },
  { value: 'google', label: 'Google' },
]

export interface HeroStat {
  value: string
  label: Localized
  icon: string
}

export interface AboutHero {
  title: Localized
  subtitle: Localized
  intro1: Localized
  intro2: Localized
  cta1Label: Localized
  cta1Href: string
  cta2Label: Localized
  cta2Href: string
  speakLabel: Localized
  heroImage: LocalizedMedia
  bgImage: LocalizedMedia
  stats: HeroStat[]
}

export interface AboutUs {
  _id: string
  hero: AboutHero
  // the other About page sections are not edited here yet
  whoWeAre?: Record<string, unknown>
  ourStory?: Record<string, unknown>
  ourValues?: Record<string, unknown>
  nextChapter?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

// Everything in the hero except the two images
export type HeroText = Omit<AboutHero, 'heroImage' | 'bgImage'>

export interface HeroFiles {
  heroImageEn?: File
  heroImageAr?: File
  heroBgEn?: File
  heroBgAr?: File
}

/* ---------- Multipart builder ---------- */

const buildHeroFormData = (hero: HeroText, files?: HeroFiles): FormData => {
  const fd = new FormData()
  fd.append('hero', JSON.stringify(hero))

  if (files) {
    for (const [field, file] of Object.entries(files)) {
      if (file instanceof File) fd.append(field, file)
    }
  }

  return fd
}

/* ---------- API slice ---------- */

export const aboutUsApi = createApi({
  reducerPath: 'aboutUsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
  }),
  tagTypes: ['AboutUs'],
  endpoints: (builder) => ({
    getAboutUs: builder.query<AboutUs, void>({
      query: () => '/about-us',
      transformResponse: (res: { data: AboutUs }) => res.data,
      providesTags: [{ type: 'AboutUs', id: 'ONE' }],
    }),

    updateHero: builder.mutation<AboutUs, { hero: HeroText; files?: HeroFiles }>({
      query: ({ hero, files }) => ({
        url: '/about-us',
        method: 'PATCH',
        body: buildHeroFormData(hero, files),
      }),
      transformResponse: (res: { data: AboutUs }) => res.data,
      invalidatesTags: [{ type: 'AboutUs', id: 'ONE' }],
    }),
  }),
})

export const { useGetAboutUsQuery, useUpdateHeroMutation } = aboutUsApi
