"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";

import { useGetWhoWeServeQuery } from "../store/api/whoWeServeApi";

/* ----------------------------- Types ----------------------------- */

type Lang = "en" | "ar";

interface Localized {
  en: string;
  ar: string;
}

interface Media {
  url: string;
  publicId: string;
}

interface LocalizedMedia {
  en: Media[];
  ar: Media[];
}

interface WhoWeServeSection {
  _id: string;
  pillTitle: Localized;
  pillHighlight: Localized;
  whyTitle: Localized;
  brandName: Localized;
  whyIntroStart: Localized;
  whyIntroBold: Localized;
  whyIntroEnd: Localized;
  leftBg: LocalizedMedia;
}

interface WhoWeServeCard {
  _id: string;
  kind: "serve" | "why";
  title: Localized;
  text: Localized;
  image: LocalizedMedia;
  order: number;
}

interface WhoWeServeData {
  section: WhoWeServeSection | null;
  serve: WhoWeServeCard[];
  why: WhoWeServeCard[];
}

/* ------------------------- Language ----------------------------- */

const getLanguage = (): Lang => {
  if (typeof document === "undefined") return "en";

  return document.documentElement.lang === "ar" ? "ar" : "en";
};

const subscribeLanguage = (callback: () => void) => {
  window.addEventListener("languagechange", callback);
  window.addEventListener("site-language-change", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("languagechange", callback);
    window.removeEventListener("site-language-change", callback);
    window.removeEventListener("storage", callback);
  };
};

const useLanguage = (): Lang =>
  useSyncExternalStore(subscribeLanguage, getLanguage, (): Lang => "en");

const localized = (value: Localized | undefined, lang: Lang): string =>
  value?.[lang] ?? "";

const getMedia = (
  value: LocalizedMedia | undefined,
  lang: Lang,
): string | undefined => value?.[lang]?.find((item) => Boolean(item?.url))?.url;

/* ------------------------ Connecting Lines ----------------------- */

const BADGE_X = 600;
const SVG_H = 120;

const linePath = (x: number) =>
  `M ${BADGE_X} 0 C ${BADGE_X} 70, ${x} 50, ${x} ${SVG_H}`;

const ConnectingLines = ({ count }: { count: number }) => {
  if (count === 0) return null;

  // Distribute connection endpoints according to API card count.
  const centers = Array.from(
    { length: count },
    (_, i) => ((i + 0.5) * 1200) / count,
  );

  return (
    <svg
      viewBox={`0 0 1200 ${SVG_H}`}
      aria-hidden="true"
      className="mx-auto hidden w-full max-w-6xl xl:block"
    >
      {centers.map((x, i) => (
        <g key={i}>
          <path
            id={`wws-path-${i}`}
            d={linePath(x)}
            className="fill-none stroke-[#fab923] opacity-60"
            strokeWidth="1.5"
          />

          <circle
            r="4"
            className="fill-[#fab923] drop-shadow-[0_0_4px_#fab923] motion-reduce:hidden"
          >
            <animateMotion
              dur="2.6s"
              begin={`${i * 0.45}s`}
              repeatCount="indefinite"
            >
              <mpath href={`#wws-path-${i}`} />
            </animateMotion>
          </circle>
        </g>
      ))}
    </svg>
  );
};

/* ------------------------ Image Component ------------------------ */

const CardImage = ({
  src,
  alt,
  size,
}: {
  src?: string;
  alt: string;
  size: "serve" | "why";
}) => {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={size === "serve" ? 160 : 128}
      height={size === "serve" ? 160 : 128}
      quality={100}
      sizes={size === "serve" ? "96px" : "64px"}
      unoptimized
      className="size-full object-cover"
    />
  );
};

/* -------------------------- Skeleton ---------------------------- */

const WhoWeServeSkeleton = () => {
  return (
    <section
      className="relative isolate grid grid-cols-1 text-[#2b2620] lg:mt-10 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.8fr_1fr]"
      aria-busy="true"
      aria-label="Loading Who We Serve"
    >
      {/* Left skeleton */}
      <div className="relative px-4 py-10 sm:px-8 md:pb-20 lg:py-12 lg:pb-24 lg:pl-14 lg:pr-12">
        <div className="absolute inset-x-0 top-0 h-84 animate-pulse bg-[#14100a]/20 lg:[clip-path:polygon(0_0,94%_0,100%_50%,94%_100%,0_100%)]" />

        <div className="relative">
          <div className="mx-auto h-12 w-64 animate-pulse rounded-full bg-[#14100a]/80 sm:w-80" />

          <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-x-4 gap-y-20 min-[480px]:grid-cols-2 xl:mt-28 xl:grid-cols-4 xl:gap-x-0">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="relative rounded-3xl border border-[#f3d9a4] bg-white px-4 pb-6 pt-14 text-center shadow-lg xl:mx-2"
              >
                <div className="absolute -top-12 left-1/2 size-24 -translate-x-1/2 animate-pulse rounded-full border-[3px] border-[#00852B]/40 bg-gray-200" />

                <div className="mx-auto h-3 w-6 animate-pulse rounded bg-gray-200" />

                <div className="mx-auto mt-3 h-5 w-4/5 animate-pulse rounded bg-gray-200" />

                <div className="mx-auto my-4 h-0.5 w-8 bg-[#00852B]/30" />

                <div className="space-y-2">
                  <div className="h-3 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right skeleton */}
      <aside className="relative px-4 py-10 sm:px-8 md:pb-20 lg:py-12 lg:pb-24 lg:pl-12 lg:pr-10">
        <div className="h-8 w-4/5 animate-pulse rounded bg-gray-200" />

        <div className="mt-3 h-8 w-2/3 animate-pulse rounded bg-gray-200" />

        <div className="my-6 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-gray-200" />
          ))}
        </div>

        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-t border-[#eadfcb] py-4">
            <div className="size-16 flex-none animate-pulse rounded-xl bg-gray-200" />

            <div className="flex-1 space-y-3">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />

              <div className="h-3 animate-pulse rounded bg-gray-200" />

              <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </aside>
    </section>
  );
};

/* ------------------------- Main Component ------------------------ */

const WhoWeServe = () => {
  const lang = useLanguage();
  const isRtl = lang === "ar";

  const { data, isLoading, isFetching, isError, refetch } =
    useGetWhoWeServeQuery();

  if (isLoading) {
    return <WhoWeServeSkeleton />;
  }

  if (isError && !data) {
    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        className="flex min-h-72 flex-col items-center justify-center gap-4 px-4 py-16 text-center"
        role="alert"
      >
        <p className="text-sm text-red-600">
          {isRtl
            ? "تعذر تحميل بيانات هذا القسم."
            : "Unable to load Who We Serve information."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-full bg-[#00852B] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#006d23]"
        >
          <FiRefreshCw />

          {isRtl ? "إعادة المحاولة" : "Try Again"}
        </button>
      </section>
    );
  }

  // Public API returns { section, serve, why }.
  const content = data as unknown as WhoWeServeData | undefined;

  const section = content?.section;

  const serveItems = Array.isArray(content?.serve)
    ? [...content.serve].sort((a, b) => a.order - b.order)
    : [];

  const whyItems = Array.isArray(content?.why)
    ? [...content.why].sort((a, b) => a.order - b.order)
    : [];

  if (!section) {
    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        className="px-4 py-16 text-center"
        role="status"
      >
        <p className="text-sm text-[#5b534a]">
          {isRtl
            ? "لا توجد بيانات متاحة حالياً."
            : "No information is currently available."}
        </p>
      </section>
    );
  }

  const leftBg = getMedia(section.leftBg, lang);

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      lang={lang}
      aria-busy={isFetching}
      className="relative isolate grid grid-cols-1 text-[#2b2620] lg:mt-10 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.8fr_1fr]"
    >
      {/* LEFT */}
      <div className="relative px-4 py-10 sm:px-8 md:pb-20 lg:py-12 lg:pb-24 lg:pl-14 lg:pr-12">
        {/* Dynamic pointer-shaped background */}
        <div
          className="absolute inset-x-0 top-0 h-84 bg-cover bg-top lg:[clip-path:polygon(0_0,94%_0,100%_50%,94%_100%,0_100%)]"
          style={leftBg ? { backgroundImage: `url("${leftBg}")` } : undefined}
        >
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative">
          {/* Dynamic heading */}
          <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-[#fab923]/40 bg-[#14100a] px-6 py-2 text-base font-bold uppercase tracking-[0.12em] text-white shadow-lg sm:px-10 sm:py-2.5 sm:text-2xl">
            <span className="h-px w-8 bg-[#00852B]" />

            <span>
              {localized(section.pillTitle, lang)}{" "}
              <span className="text-[#00852B]">
                {localized(section.pillHighlight, lang)}
              </span>
            </span>

            <span className="h-px w-8 bg-[#00852B]" />
          </div>

          {/* Animated connecting lines */}
          <ConnectingLines count={serveItems.length} />

          {/* Dynamic serve cards */}
          {serveItems.length > 0 ? (
            <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-x-4 gap-y-20 min-[480px]:grid-cols-2 xl:mt-0 xl:grid-cols-4 xl:gap-x-0">
              {serveItems.map((item, i) => {
                const title = localized(item.title, lang);
                const text = localized(item.text, lang);
                const imageUrl = getMedia(item.image, lang);

                return (
                  <article
                    key={item._id}
                    className="relative rounded-3xl border border-[#f3d9a4] bg-linear-to-b from-white to-[#d9f1e1] px-4 pb-6 pt-14 text-center shadow-lg xl:mx-2"
                  >
                    {/* Dynamic card image */}
                    {imageUrl && (
                      <div className="absolute -top-12 left-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-[#00852B] bg-[#14100a] shadow-md">
                        <CardImage src={imageUrl} alt={title} size="serve" />
                      </div>
                    )}

                    <span className="text-xs font-bold text-[#00852B]">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <h3 className="mt-1 text-base font-semibold leading-snug">
                      {title}
                    </h3>

                    <hr className="mx-auto my-3 w-8 border-t-2 border-[#00852B]" />

                    <p className="text-sm leading-relaxed text-[#5b534a]">
                      {text}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-20 text-center text-sm text-[#5b534a]">
              {isRtl
                ? "لا توجد فئات متاحة حالياً."
                : "No categories are currently available."}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <aside className="relative px-4 py-10 sm:px-8 md:pb-20 lg:py-12 lg:pb-24 lg:pl-12 lg:pr-10">
        {/* Dynamic heading */}
        <h2 className="mb-3 text-2xl font-bold leading-tight sm:text-3xl">
          {localized(section.whyTitle, lang)}{" "}
          <span className="text-[#00852B]">
            {localized(section.brandName, lang)}
          </span>
        </h2>

        {/* Dynamic introduction with bold section */}
        <p className="mb-6 text-justify text-base leading-relaxed">
          {localized(section.whyIntroStart, lang)}{" "}
          <strong>{localized(section.whyIntroBold, lang)}</strong>{" "}
          {localized(section.whyIntroEnd, lang)}
        </p>

        {/* Dynamic why cards */}
        {whyItems.length > 0 ? (
          <ul>
            {whyItems.map((item) => {
              const title = localized(item.title, lang);
              const text = localized(item.text, lang);
              const imageUrl = getMedia(item.image, lang);

              return (
                <li
                  key={item._id}
                  className="flex gap-4 border-t border-[#eadfcb] py-4"
                >
                  {imageUrl && (
                    <div className="size-16 flex-none overflow-hidden rounded-xl bg-white/70 shadow-sm">
                      <CardImage src={imageUrl} alt={title} size="why" />
                    </div>
                  )}

                  <div>
                    <h4 className="mb-1 text-lg font-bold leading-snug">
                      {title}
                    </h4>

                    <p className="text-justify text-sm leading-relaxed text-[#5b534a]">
                      {text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-[#5b534a]">
            {isRtl
              ? "لا توجد معلومات إضافية حالياً."
              : "No additional information is available."}
          </p>
        )}
      </aside>
    </section>
  );
};

export default WhoWeServe;
