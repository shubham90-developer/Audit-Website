// src/store/api/bannerApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

/* ---------- Types (mirror the backend interface) ---------- */

export type Localized<T = string> = { en: T; ar: T }

export interface BannerMedia {
  url: string
  publicId: string
}

export interface LocalizedMedia {
  en: BannerMedia[]
  ar: BannerMedia[]
}

export interface CtaButton {
  label: Localized
  href: Localized
  variant: 'primary' | 'secondary'
}

export interface FtaCard {
  line1: Localized
  line2: Localized
  licenseNumber: Localized
}

export interface PartnerCard {
  title: Localized
  subtitle: Localized
}

export interface ExperienceCard {
  value: Localized
  label: Localized
  tagline: Localized
}

export interface ReviewRating {
  platform: 'google' | 'trustpilot'
  score: number
  label: Localized
}

/** Text fields. Used for create and as the base for updates. */
export interface BannerText {
  establishmentYear: Localized
  titleHighlight: Localized
  titleRest: Localized
  intro: Localized
  speakLabel: Localized
  primaryCta: CtaButton
  secondaryCta: CtaButton
  ftaCard: FtaCard
  partnerCard: PartnerCard
  experienceCard: ExperienceCard
  reviewRatings: ReviewRating[]
  trustedNote: Localized
}

/** Full banner as returned by the API. Dates arrive as ISO strings. */
export interface Banner extends BannerText {
  _id: string
  bgImages: LocalizedMedia
  bgVideos: LocalizedMedia
  posterImage: LocalizedMedia
  createdAt: string
  updatedAt: string
}

/** Multer field names the backend accepts. Must match the router. */
export type MediaFieldName = 'bgImagesEn' | 'bgImagesAr' | 'posterImageEn' | 'posterImageAr' | 'bgVideosEn' | 'bgVideosAr'

export type BannerFiles = Partial<Record<MediaFieldName, File[]>>

export interface CreateBannerArg {
  data: BannerText
  files?: BannerFiles
}

export interface UpdateBannerArg {
  id: string
  data?: Partial<BannerText>
  files?: BannerFiles
  /** publicIds of existing media to delete */
  removePublicIds?: string[]
}

/* ---------- Multipart builder ---------- */

// The backend parses any field that starts with { or [ as JSON,
// so objects and arrays are stringified and everything else is sent as-is.
const buildFormData = (data?: object, files?: BannerFiles): FormData => {
  const fd = new FormData()

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue
      fd.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
    }
  }

  if (files) {
    for (const [field, list] of Object.entries(files) as [MediaFieldName, File[]][]) {
      list?.forEach((file) => fd.append(field, file))
    }
  }

  return fd
}

/* ---------- API slice ---------- */

export const bannerApi = createApi({
  reducerPath: 'bannerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    // Add auth here if the banner routes need it:
    // prepareHeaders: (headers) => { headers.set("authorization", `Bearer ${token}`); return headers; },
  }),
  tagTypes: ['Banner'],
  endpoints: (builder) => ({
    getBanners: builder.query<Banner[], void>({
      query: () => '/banners',
      transformResponse: (res: { data: Banner[] }) => res.data,
      providesTags: (result) =>
        result
          ? [...result.map((b) => ({ type: 'Banner' as const, id: b._id })), { type: 'Banner' as const, id: 'LIST' }]
          : [{ type: 'Banner' as const, id: 'LIST' }],
    }),

    createBanner: builder.mutation<Banner, CreateBannerArg>({
      query: ({ data, files }) => ({
        url: '/banners',
        method: 'POST',
        // Don't set Content-Type. fetchBaseQuery adds the multipart boundary.
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: Banner }) => res.data,
      invalidatesTags: [{ type: 'Banner', id: 'LIST' }],
    }),

    updateBanner: builder.mutation<Banner, UpdateBannerArg>({
      query: ({ id, data, files, removePublicIds }) => ({
        url: `/banners/${id}`,
        method: 'PATCH',
        body: buildFormData({ ...data, ...(removePublicIds && { removePublicIds }) }, files),
      }),
      transformResponse: (res: { data: Banner }) => res.data,
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Banner', id },
        { type: 'Banner', id: 'LIST' },
      ],
    }),

    deleteBanner: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/banners/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Banner', id },
        { type: 'Banner', id: 'LIST' },
      ],
    }),
  }),
})

export const { useGetBannersQuery, useCreateBannerMutation, useUpdateBannerMutation, useDeleteBannerMutation } = bannerApi
