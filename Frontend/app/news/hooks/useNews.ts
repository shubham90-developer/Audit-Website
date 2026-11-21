"use client";

import { useMemo } from "react";

import { useGetBlogSectionQuery } from "@/app/store/api/blogApi";
import { getNewsData } from "@/app/news/utils/news";

/** Loads the blog section once (RTK Query caches it) and derives the insights list. */
export const useNewsSection = () => {
  const query = useGetBlogSectionQuery();
  const news = useMemo(() => getNewsData(query.data), [query.data]);

  return { ...query, news };
};
