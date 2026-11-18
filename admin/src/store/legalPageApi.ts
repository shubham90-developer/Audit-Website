import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
export type Lang = 'en' | 'ar'
export type Localized = Record<Lang, string>
export type LegalKind = 'privacy-policy' | 'terms-and-conditions'
export type Media = { url: string; publicId: string }
export type LegalSection = { _id?: string; title: Localized; body: Localized; bullets: Localized[]; order: number }
export type LegalPage = {
  _id?: string
  kind: LegalKind
  heroTitle: Localized
  heroDescription: Localized
  heroImage: Record<Lang, Media>
  intro: Localized
  sidebarTitle: Localized
  sections: LegalSection[]
}
export const legalPageApi = createApi({
  reducerPath: 'legalPageApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api' }),
  tagTypes: ['LegalPage'],
  endpoints: (builder) => ({
    getLegalPage: builder.query<LegalPage, LegalKind>({
      query: (kind) => `/legal-pages/${kind}`,
      transformResponse: (r: { data: LegalPage }) => r.data,
      providesTags: (_r, _e, kind) => [{ type: 'LegalPage', id: kind }],
    }),
    updateLegalPage: builder.mutation<LegalPage, { kind: LegalKind; data: LegalPage; images?: Partial<Record<Lang, File>> }>({
      query: ({ kind, data, images }) => {
        const body = new FormData()
        body.append('data', JSON.stringify(data))
        if (images?.en) body.append('heroImageEn', images.en)
        if (images?.ar) body.append('heroImageAr', images.ar)
        return { url: `/legal-pages/${kind}`, method: 'PUT', body }
      },
      transformResponse: (r: { data: LegalPage }) => r.data,
      invalidatesTags: (_r, _e, { kind }) => [{ type: 'LegalPage', id: kind }],
    }),
  }),
})
export const { useGetLegalPageQuery, useUpdateLegalPageMutation } = legalPageApi
