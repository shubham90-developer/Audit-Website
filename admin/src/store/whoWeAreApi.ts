// src/store/api/whoWeAreApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized } from './bannerApi'

/* ---------- Types (mirror the backend) ---------- */

export const WHO_ICONS = ['award', 'badge', 'shield', 'globe', 'layers', 'pin'] as const
export type WhoIcon = (typeof WHO_ICONS)[number]

export const WHO_ICON_OPTIONS: { value: WhoIcon; label: string }[] = [
  { value: 'award', label: 'Award' },
  { value: 'badge', label: 'Badge' },
  { value: 'shield', label: 'Shield' },
  { value: 'globe', label: 'Globe' },
  { value: 'layers', label: 'Layers' },
  { value: 'pin', label: 'Location pin' },
]

export interface WhoWeAreItem {
  _id: string
  icon: WhoIcon
  label: Localized
  value: Localized
  note: Localized
  order: number
}

export interface WhoWeAreSection {
  _id: string
  eyebrow: Localized
  headlinePrefix: Localized
  highlight: Localized
  headlineSuffix: Localized
  brandName: Localized
  body: Localized
  quote: Localized
  ctaLabel: Localized
  ctaHref: Localized
  watermark: Localized
  snapshotTitle: Localized
  snapshotTagline: Localized
  snapshotItems: WhoWeAreItem[] // already sorted by order
  createdAt: string
  updatedAt: string
}

/** Text fields of the section. All optional on update. */
export type SectionText = Omit<WhoWeAreSection, '_id' | 'snapshotItems' | 'createdAt' | 'updatedAt'>

/** Snapshot card payload. `order` is optional on create (the backend adds it last). */
export interface ItemText {
  icon: WhoIcon
  label: Localized
  value: Localized
  note?: Localized
  order?: number
}

/* ---------- API slice ---------- */

export const whoWeAreApi = createApi({
  reducerPath: 'whoWeAreApi',
  baseQuery: fetchBaseQuery({
    // The paths below include /v1/api, so NEXT_PUBLIC_API_URL must be the host only
    // (for example https://api.example.com).
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    // Admin writes need auth. Don't put the key in a NEXT_PUBLIC_ variable.
    // Use a server-side route or a login token, and add it in prepareHeaders.
  }),
  tagTypes: ['WhoWeAre'],
  endpoints: (builder) => ({
    getWhoWeAre: builder.query<WhoWeAreSection, void>({
      query: () => '/who-we-are',
      transformResponse: (res: { data: WhoWeAreSection }) => res.data,
      providesTags: [{ type: 'WhoWeAre', id: 'ALL' }],
    }),

    // PATCH /who-we-are (JSON, partial)
    updateSection: builder.mutation<WhoWeAreSection, Partial<SectionText>>({
      query: (data) => ({
        url: '/who-we-are',
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: { data: WhoWeAreSection }) => res.data,
      invalidatesTags: [{ type: 'WhoWeAre', id: 'ALL' }],
    }),

    // POST /who-we-are/items
    createItem: builder.mutation<WhoWeAreItem, ItemText>({
      query: (data) => ({
        url: '/who-we-are/items',
        method: 'POST',
        body: data,
      }),
      transformResponse: (res: { data: WhoWeAreItem }) => res.data,
      invalidatesTags: [{ type: 'WhoWeAre', id: 'ALL' }],
    }),

    // PATCH /who-we-are/items/:id
    updateItem: builder.mutation<WhoWeAreItem, { id: string; data: Partial<ItemText> }>({
      query: ({ id, data }) => ({
        url: `/who-we-are/items/${id}`,
        method: 'PATCH',
        body: data,
      }),
      transformResponse: (res: { data: WhoWeAreItem }) => res.data,
      invalidatesTags: [{ type: 'WhoWeAre', id: 'ALL' }],
    }),

    // DELETE /who-we-are/items/:id
    deleteItem: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/who-we-are/items/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'WhoWeAre', id: 'ALL' }],
    }),
  }),
})

export const {
  useGetWhoWeAreQuery,
  useUpdateSectionMutation: useUpdateWhoWeAreSectionMutation,
  useCreateItemMutation: useCreateWhoWeAreItemMutation,
  useUpdateItemMutation: useUpdateWhoWeAreItemMutation,
  useDeleteItemMutation: useDeleteWhoWeAreItemMutation,
} = whoWeAreApi
