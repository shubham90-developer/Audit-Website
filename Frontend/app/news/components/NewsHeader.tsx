"use client";

import Breadcrumb from "@/app/components/Breadcrumb";
import { useLang } from "@/app/services/hooks/useLang";
import { useGetBlogSectionQuery } from "@/app/store/api/blogApi";
import { pickMedia, pickPlain } from "@/app/news/utils/news";

const DEFAULT_BANNER = "/img/banner/bg4.avif";

/** Placeholder with the same size and layout as <Breadcrumb />, shown while the banner loads. */
const NewsHeaderSkeleton = () => (
  <section
    aria-busy="true"
    className="relative isolate flex min-h-85 items-center justify-center overflow-hidden bg-[#080d09] px-4 py-20 text-center text-white sm:min-h-97.5 lg:min-h-110"
  >
    <div className="absolute inset-0 -z-20 bg-black/70" />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-105"
      style={{
        background:
          "radial-gradient(ellipse 55% 75% at 50% 0%, rgba(61,220,110,0.30), rgba(61,220,110,0.10) 45%, transparent 75%)",
      }}
    />

    <div
      aria-hidden="true"
      className="relative mx-auto flex w-full max-w-4xl animate-pulse flex-col items-center justify-center"
    >
      {/* Title */}
      <div className="h-9 w-3/4 max-w-xl rounded-lg bg-white/15 sm:h-11 md:h-14" />

      {/* Divider */}
      <div className="my-6 flex items-center justify-center gap-2">
        <span className="h-px w-10 bg-[#3ddc6e]/30" />
        <span className="h-1.5 w-10 rounded-full bg-[#3ddc6e]/40" />
        <span className="h-px w-10 bg-[#3ddc6e]/30" />
      </div>

      {/* Subtitle */}
      <div className="flex w-full max-w-2xl flex-col items-center gap-3">
        <div className="h-4 w-full rounded bg-white/10 sm:h-5" />
        <div className="h-4 w-4/5 rounded bg-white/10 sm:h-5" />
      </div>

      {/* Breadcrumb trail */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <div className="h-3.5 w-12 rounded bg-white/10" />
        <div className="h-3.5 w-3.5 rounded-full bg-[#3ddc6e]/30" />
        <div className="h-3.5 w-24 rounded bg-[#3ddc6e]/30" />
      </div>
    </div>
  </section>
);

/**
 * Page banner for /news.
 * Title, description and background image come from the blog API
 * (admin: Blogs > Banner Settings). A skeleton shows while it loads.
 */
const NewsHeader = () => {
  const lang = useLang();
  const { data: section, isLoading, isError } = useGetBlogSectionQuery();

  if (isLoading) return <NewsHeaderSkeleton />;

  // The articles list below shows its own error and retry message.
  if (isError || !section) return null;

  return (
    <Breadcrumb
      title={pickPlain(section.heroTitle, lang)}
      subtitle={pickPlain(section.heroDescription, lang)}
      image={pickMedia(section.heroImage, lang, DEFAULT_BANNER)}
      crumbs={[]}
    />
  );
};

export default NewsHeader;
