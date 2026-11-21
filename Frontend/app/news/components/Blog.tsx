"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

import { useLang } from "@/app/services/hooks/useLang";
import { getNewsLabels } from "@/app/news/labels";
import { useNewsSection } from "@/app/news/hooks/useNews";
import {
  formatNewsDate,
  NEWS_FALLBACK_IMAGE,
  pickMedia,
  pickPlain,
} from "@/app/news/utils/news";

const SKELETON_COUNT = 6;
const ALL = "all";

const Blog = () => {
  const lang = useLang();
  const t = getNewsLabels(lang);
  const { news, isLoading, isError, refetch } = useNewsSection();
  const [categoryId, setCategoryId] = useState(ALL);

  const posts = useMemo(
    () =>
      categoryId === ALL
        ? news.articles
        : news.articles.filter((article) => article.categoryId === categoryId),
    [news.articles, categoryId],
  );

  // Only show tabs for categories that have published articles.
  const tabs = news.categories.filter((c) => news.countByCategory.has(c._id));
  const hasArticles = news.articles.length > 0;

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative isolate bg-white py-12 sm:py-16 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/banner/bg7.avif')" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white/85" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-112.5"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at 50% 0%, rgba(61,220,110,0.15), transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* category tabs: centered when they fit, scroll sideways when they don't */}
        {hasArticles && (
          <div
            role="tablist"
            aria-label={t.categories}
            className="mx-auto flex w-fit max-w-full gap-1.5 overflow-x-auto rounded-full bg-gray-100 p-1.5 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            {[{ _id: ALL, name: { en: t.all, ar: t.all } }, ...tabs].map((c) => (
              <button
                key={c._id}
                type="button"
                role="tab"
                aria-selected={c._id === categoryId}
                onClick={() => setCategoryId(c._id)}
                className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-[#3ddc6e] sm:px-4 sm:text-sm ${
                  c._id === categoryId
                    ? "bg-black text-white"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                {c._id === ALL ? t.all : pickPlain(c.name, lang)}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div
            aria-busy="true"
            className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8"
          >
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="h-96 animate-pulse rounded-2xl bg-gray-200/70"
              />
            ))}
          </div>
        )}

        {isError && !isLoading && (
          <div
            role="alert"
            className="mx-auto mt-10 max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700"
          >
            <p>{t.loadError}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 cursor-pointer rounded-full bg-[#3ddc6e] px-5 py-2 text-sm font-bold text-black transition hover:bg-gray-950 hover:text-white"
            >
              {t.retry}
            </button>
          </div>
        )}

        {!isLoading && !isError && news.ready && !hasArticles && (
          <p className="mt-12 text-center text-sm text-gray-500">{t.empty}</p>
        )}

        {!isLoading && !isError && hasArticles && posts.length === 0 && (
          <p className="mt-12 text-center text-sm text-gray-500">{t.noResults}</p>
        )}

        {!isLoading && !isError && posts.length > 0 && (
          <ul className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {posts.map((article) => {
              const title = pickPlain(article.title, lang);
              const excerpt = pickPlain(article.excerpt, lang);
              const category = news.categoryById.get(article.categoryId);
              const image = pickMedia(
                article.cardImage,
                lang,
                pickMedia(article.mainImage, lang, NEWS_FALLBACK_IMAGE),
              );

              return (
                <li key={article._id}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#3ddc6e]/30 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#3ddc6e] hover:shadow-md">
                    <Link
                      href={`/news/${article.slug}`}
                      className="relative block aspect-3/2 overflow-hidden bg-gray-100"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </Link>

                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs">
                        {category && (
                          <span className="rounded-full bg-[#3ddc6e]/15 px-2.5 py-1 font-semibold text-[#00852B]">
                            {pickPlain(category.name, lang)}
                          </span>
                        )}
                        <time dateTime={article.publishedAt} className="text-gray-500">
                          {formatNewsDate(article.publishedAt, lang)}
                        </time>
                      </div>

                      <h2 className="mt-3 line-clamp-2 wrap-break-word text-base font-bold leading-snug text-gray-900 sm:text-lg">
                        <Link
                          href={`/news/${article.slug}`}
                          className="transition hover:text-[#00852B]"
                        >
                          {title}
                        </Link>
                      </h2>

                      {excerpt && (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                          {excerpt}
                        </p>
                      )}

                      <Link
                        href={`/news/${article.slug}`}
                        className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-sm font-semibold text-[#00852B]"
                      >
                        {t.readMore}
                        <HiArrowRight
                          className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180"
                          aria-hidden="true"
                        />
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default Blog;
