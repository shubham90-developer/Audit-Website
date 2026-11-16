// src/store/api/partnerApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Localized, LocalizedMedia } from './bannerApi'

/* ---------- Types (mirror the backend Partner model) ---------- */

export interface Partner {
  _id: string
  title: Localized
  text: Localized
  logo: LocalizedMedia
  order: number
  createdAt: string
  updatedAt: string
}

export interface PartnerText {
  title: Localized
  text: Localized
  order?: number
}

export interface PartnerLogoFiles {
  logoEn?: File
  logoAr?: File
}

export interface CreatePartnerArg {
  data: PartnerText
  files?: PartnerLogoFiles
}

export interface UpdatePartnerArg {
  id: string
  data?: Partial<PartnerText>
  files?: PartnerLogoFiles
  /** publicIds of existing logos to delete */
  removePublicIds?: string[]
}

/* ---------- Multipart builder ---------- */

// Objects and arrays are sent as JSON strings. The backend parses them back.
const buildFormData = (data?: object, files?: PartnerLogoFiles): FormData => {
  const fd = new FormData()

  if (data) {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined || value === null) continue
      fd.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
    }
  }

  if (files?.logoEn) fd.append('logoEn', files.logoEn)
  if (files?.logoAr) fd.append('logoAr', files.logoAr)

  return fd
}

/* ---------- API slice ---------- */

export const partnerApi = createApi({
  reducerPath: 'partnerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/`,
    // Admin writes need the x-admin-key header. Use a server-side route or a
    // login token here. Don't put the key in a NEXT_PUBLIC_ variable.
    // prepareHeaders: (headers) => { headers.set("x-admin-key", key); return headers; },
  }),
  tagTypes: ['Partner'],
  endpoints: (builder) => ({
    getPartners: builder.query<Partner[], void>({
      query: () => '/partners',
      transformResponse: (res: { data: Partner[] }) => res.data,
      providesTags: (result) =>
        result
          ? [...result.map((p) => ({ type: 'Partner' as const, id: p._id })), { type: 'Partner' as const, id: 'LIST' }]
          : [{ type: 'Partner' as const, id: 'LIST' }],
    }),

    createPartner: builder.mutation<Partner, CreatePartnerArg>({
      query: ({ data, files }) => ({
        url: '/partners',
        method: 'POST',
        // Don't set Content-Type. fetchBaseQuery adds the multipart boundary.
        body: buildFormData(data, files),
      }),
      transformResponse: (res: { data: Partner }) => res.data,
      invalidatesTags: [{ type: 'Partner', id: 'LIST' }],
    }),

    updatePartner: builder.mutation<Partner, UpdatePartnerArg>({
      query: ({ id, data, files, removePublicIds }) => ({
        url: `/partners/${id}`,
        method: 'PATCH',
        body: buildFormData({ ...data, ...(removePublicIds && { removePublicIds }) }, files),
      }),
      transformResponse: (res: { data: Partner }) => res.data,
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Partner', id },
        { type: 'Partner', id: 'LIST' },
      ],
    }),

    deletePartner: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/partners/${id}`, method: 'DELETE' }),
      invalidatesTags: (_result, _err, id) => [
        { type: 'Partner', id },
        { type: 'Partner', id: 'LIST' },
      ],
    }),
  }),
})

export const { useGetPartnersQuery, useCreatePartnerMutation, useUpdatePartnerMutation, useDeletePartnerMutation } = partnerApi
