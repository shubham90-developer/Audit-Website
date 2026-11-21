import { baseApi } from "./baseApi";
import type { ApiEnvelope } from "./types";

/*
 * Public blog / insights API (read-only).
 *
 * Backend (Express, mounted at /v1/api):
 *   GET /blog                     -> whole insights section (categories + articles)
 *   GET /blog/articles/:slug      -> one PUBLISHED article by slug
 *
 * Blog shapes differ from the services shapes: media here is a single
 * object per language ({ en: { url }, ar: { url } }), not an array.
 * Rich-text fields (title, excerpt, content) are HTML from the admin editor.
 *
 * Endpoints are injected into the shared `baseApi`, so the store in
 * app/store/index.ts needs no changes.
 */

export type BlogLang = "en" | "ar";

export interface BlogLocalized {
  en: string;
  ar: string;
}

export interface BlogMedia {
  url: string;
  publicId: string;
}

export interface BlogLocalizedMedia {
  en: BlogMedia;
  ar: BlogMedia;
}

export interface BlogCategory {
  _id: string;
  name: BlogLocalized;
  slug: string;
  order: number;
  active: boolean;
}

export interface BlogArticle {
  _id: string;
  categoryId: string;
  slug: string;
  /** Rich text (HTML) */
  title: BlogLocalized;
  /** Rich text (HTML) */
  excerpt: BlogLocalized;
  /** Rich text (HTML) */
  content: BlogLocalized;
  cardImage: BlogLocalizedMedia;
  mainImage: BlogLocalizedMedia;
  publishedAt: string;
  status: "draft" | "published";
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogSection {
  _id: string;
  key: string;
  heroTitle: BlogLocalized;
  heroDescription: BlogLocalized;
  heroImage: BlogLocalizedMedia;
  exploreLabel: BlogLocalized;
  categories: BlogCategory[];
  /** Includes drafts: always filter by status before showing publicly. */
  articles: BlogArticle[];
}

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogSection: builder.query<BlogSection, void>({
      query: () => "/blog",
      transformResponse: (response: ApiEnvelope<BlogSection>) => response.data,
    }),

    getBlogArticleBySlug: builder.query<BlogArticle, string>({
      query: (slug) => `/blog/articles/${encodeURIComponent(slug)}`,
      transformResponse: (response: ApiEnvelope<BlogArticle>) => response.data,
    }),
  }),
});

export const {
  useGetBlogSectionQuery,
  useGetBlogArticleBySlugQuery,
} = blogApi;
