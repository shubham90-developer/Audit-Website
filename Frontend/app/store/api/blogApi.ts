import { baseApi } from './baseApi';
import type { ApiEnvelope, ContentRecord } from './types';

/** Public GET endpoints only; no admin write operations exposed. */
export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<ContentRecord[], void>({
      query: () => '/blog',
      transformResponse: (response: ApiEnvelope<ContentRecord[]>) => response.data,
    }),
    getBlogArticleBySlug: builder.query<ContentRecord, string>({
      query: (slug) => `/blog/articles/${encodeURIComponent(slug)}`,
      transformResponse: (response: ApiEnvelope<ContentRecord>) => response.data,
    }),
  }),
});

export const { useGetBlogsQuery, useLazyGetBlogsQuery, useGetBlogArticleBySlugQuery, useLazyGetBlogArticleBySlugQuery } = blogApi;
