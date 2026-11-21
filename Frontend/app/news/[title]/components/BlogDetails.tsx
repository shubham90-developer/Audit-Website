"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";

import TopBanner from "./TopBanner";
import { useLang } from "@/app/services/hooks/useLang";
import { getNewsLabels } from "@/app/news/labels";
import { useNewsSection } from "@/app/news/hooks/useNews";
import { useGetBlogArticleBySlugQuery } from "@/app/store/api/blogApi";
import {
  formatNewsDate,
  isNewsArticle,
  pickMedia,
  pickPlain,
  pickText,
  NEWS_FALLBACK_IMAGE,
  readingMinutes,
} from "@/app/news/utils/news";

const DEFAULT_BANNER = "/img/banner/bg3.avif";

const card =
  "rounded-3xl border border-black/5 bg-white p-6 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.12)]";

/** Styles for the admin's rich-text HTML (no typography plugin in this project). */
const articleBody =
  "text-gray-700 text-lg leading-8 wrap-break-word " +
  "[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-950 " +
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-gray-950 " +
  "[&_p]:mb-5 " +
  "[&_ul]:mb-5 [&_ul]:list-disc [&_ul]:ps-6 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:ps-6 [&_li]:mb-2 " +
  "[&_a]:text-[#00852B] [&_a]:underline [&_strong]:font-semibold [&_strong]:text-gray-900 " +
  "[&_img]:my-6 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl " +
  "[&_blockquote]:border-s-4 [&_blockquote]:border-[#3ddc6e] [&_blockquote]:ps-5 [&_blockquote]:italic [&_blockquote]:text-gray-600";

const BlogDetails = () => {
  const lang = useLang();
  const t = getNewsLabels(lang);
  const { title: slug } = useParams<{ title: string }>();

  const article = useGetBlogArticleBySlugQuery(slug, { skip: !slug });
  const {
    data: section,
    news,
    isLoading: sectionLoading,
    isError: sectionError,
    refetch: refetchSection,
  } = useNewsSection();

  if (article.isLoading || sectionLoading) {
    return (
      <div
        aria-busy="true"
        aria-hidden="true"
        className="h-[70vh] animate-pulse bg-gray-950"
      />
    );
  }

  if (sectionError) {
    return (
      <section className="grid min-h-[50vh] place-items-center bg-white px-4 py-24 text-center">
        <div role="alert">
          <p className="text-lg font-semibold text-gray-900">{t.notFound}</p>
          <button
            type="button"
            onClick={() => refetchSection()}
            className="mt-5 cursor-pointer rounded-full bg-[#3ddc6e] px-6 py-2.5 text-sm font-bold text-black transition hover:bg-gray-950 hover:text-white"
          >
            {t.retry}
          </button>
        </div>
      </section>
    );
  }

  // Not found: unknown slug, unpublished, or an article from another category.
  if (article.isError || !isNewsArticle(article.data, news)) {
    return (
      <section className="grid min-h-[50vh] place-items-center bg-white px-4 py-24 text-center">
        <div>
          <p role="alert" className="text-lg font-semibold text-gray-900">
            {t.notFound}
          </p>
          <Link
            href="/news"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#3ddc6e] px-6 py-2.5 text-sm font-bold text-black transition hover:bg-gray-950 hover:text-white"
          >
            <FiArrowLeft aria-hidden className="rtl:rotate-180" />
            {t.backToNews}
          </Link>
        </div>
      </section>
    );
  }

  const current = article.data;
  const title = pickPlain(current.title, lang);
  const category = news.categoryById.get(current.categoryId);
  const categoryName = category ? pickPlain(category.name, lang) : "";
  const content = pickText(current.content, lang);
  const mainImage = pickMedia(
    current.mainImage,
    lang,
    pickMedia(current.cardImage, lang, NEWS_FALLBACK_IMAGE),
  );
  const publishedOn = formatNewsDate(current.publishedAt, lang);
  const updatedOn =
    current.updatedAt &&
    current.updatedAt.slice(0, 10) !== current.publishedAt.slice(0, 10)
      ? formatNewsDate(current.updatedAt, lang)
      : "";

  const others = news.articles.filter((item) => item._id !== current._id);
  // Same category first, then the latest of everything else.
  const related = [
    ...others.filter((item) => item.categoryId === current.categoryId),
    ...others.filter((item) => item.categoryId !== current.categoryId),
  ].slice(0, 2);
  const recent = others.slice(0, 3);

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <TopBanner
        eyebrow={pickPlain(section?.exploreLabel, lang)}
        bgImage={pickMedia(section?.heroImage, lang, DEFAULT_BANNER)}
        category={categoryName}
        title={pickPlain(section?.heroTitle, lang) || title}
        description={pickPlain(section?.heroDescription, lang)}
        publishedOn={publishedOn}
        updated={updatedOn}
        readTime={`${readingMinutes(content)} ${t.minRead}`}
      />

      {/* ------------------------- Content ------------------------- */}
      <section className="relative isolate bg-white px-4 py-10 sm:px-8 lg:py-16">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/banner/bg7.avif')" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-white/90"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-112.5"
          style={{
            background:
              "radial-gradient(ellipse 55% 75% at 50% 0%, rgba(61,220,110,0.18), transparent 75%)",
          }}
        />
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
            {/* LEFT: Article */}
            <article className="min-w-0 rounded-3xl border border-black/5 bg-white p-4 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.12)] sm:p-6 lg:p-8">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src={mainImage}
                  alt={title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>

              <h2 className="mt-8 text-2xl font-bold leading-tight text-gray-950 sm:text-3xl">
                {title}
              </h2>

              {content && (
                <div
                  className={`px-1 pt-8 sm:px-3 lg:px-4 ${articleBody}`}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}

              {/* Related */}
              {related.length > 0 && (
                <div className="mt-14">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold tracking-tight text-gray-950">
                      {t.related}
                    </h2>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-linear-to-r from-[#3ddc6e]/40 to-transparent"
                    />
                  </div>

                  <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                    {related.map((item) => (
                      <li key={item._id}>
                        <RelatedCard
                          slug={item.slug}
                          title={pickPlain(item.title, lang)}
                          tag={pickPlain(
                            news.categoryById.get(item.categoryId)?.name,
                            lang,
                          )}
                          image={pickMedia(
                            item.cardImage,
                            lang,
                            pickMedia(item.mainImage, lang),
                          )}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            {/* RIGHT: Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-8">
              <div className={card}>
                <h2 className="text-lg font-bold text-gray-950">{t.recent}</h2>
                {recent.length > 0 ? (
                  <ul className="mt-5 space-y-5">
                    {recent.map((item) => (
                      <li key={item._id}>
                        <Link
                          href={`/news/${item.slug}`}
                          className="group flex items-start gap-3"
                        >
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                            <Image
                              src={pickMedia(
                                item.cardImage,
                                lang,
                                pickMedia(item.mainImage, lang),
                              )}
                              alt=""
                              fill
                              sizes="80px"
                              className="object-cover transition duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="min-w-0">
                            <time
                              dateTime={item.publishedAt}
                              className="text-xs font-medium text-gray-400"
                            >
                              {formatNewsDate(item.publishedAt, lang)}
                            </time>
                            <h3 className="mt-1 line-clamp-3 text-sm font-semibold leading-5 text-gray-800 transition group-hover:text-[#00852B]">
                              {pickPlain(item.title, lang)}
                            </h3>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-sm text-gray-500">{t.empty}</p>
                )}
              </div>

              <div className={card}>
                <h2 className="text-lg font-bold text-gray-950">
                  {t.categories}
                </h2>
                <ul className="mt-4 space-y-1">
                  {news.categories
                    .filter((c) => news.countByCategory.has(c._id))
                    .map((c) => (
                      <li key={c._id}>
                        <Link
                          href="/news"
                          className="group flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-[#3ddc6e]/10 hover:text-gray-950"
                        >
                          <span>{pickPlain(c.name, lang)}</span>
                          <span className="grid min-w-7 place-items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 transition group-hover:bg-[#3ddc6e] group-hover:text-black">
                            {news.countByCategory.get(c._id)}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              <Link
                href="/news"
                className={`${card} group flex items-center justify-between gap-3 text-base font-bold text-gray-950 transition hover:border-[#3ddc6e]/50`}
              >
                {t.allArticles}
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gray-950 text-white transition group-hover:bg-[#3ddc6e] group-hover:text-black">
                  <FiArrowUpRight aria-hidden />
                </span>
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
};

/** Small card used in the "Related" row. */
const RelatedCard = ({
  slug,
  title,
  tag,
  image,
}: {
  slug: string;
  title: string;
  tag: string;
  image: string;
}) => (
  <Link
    href={`/news/${slug}`}
    className="group block overflow-hidden rounded-2xl border border-black/5 bg-white p-2 transition duration-300 hover:-translate-y-1 hover:border-[#3ddc6e]/50 hover:shadow-[0_20px_40px_-16px_rgba(61,220,110,0.35)]"
  >
    <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-gray-100">
      <Image
        src={image}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, 380px"
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      {tag && (
        <span className="absolute start-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#00852B] shadow-sm backdrop-blur">
          {tag}
        </span>
      )}
    </div>
    <div className="flex items-start justify-between gap-3 p-3">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        {title}
      </h3>
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-950 text-white transition group-hover:bg-[#3ddc6e] group-hover:text-black">
        <FiArrowUpRight aria-hidden />
      </span>
    </div>
  </Link>
);

export default BlogDetails;
