"use client";

import React, { useSyncExternalStore } from "react";
import { Mrs_Saint_Delafield } from "next/font/google";
import Image from "next/image";

import {
  useGetGlobalMarketsQuery,
  type MarketLang,
  type MarketLocalized,
  type MarketLocalizedMedia,
} from "@/app/store/api/globalMarketsApi";

/* ----------------------------- Constants ----------------------------- */

const script = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
});

const BG_IMAGE = "/img/banner/bg10.avif";
const TOP_FILL = "#fffaf1";
const GOLD = "#3ddc6e";

/*
 * Original images are retained as visual fallbacks.
 * Country names and other content always come from the API.
 */
const COUNTRY_IMAGES: Record<string, string> = {
  UAE: "/img/about/1.avif",
  Canada: "/img/about/2.avif",
  USA: "/img/about/3.avif",
  Panama: "/img/about/4.avif",
};

/* ----------------------------- Language ----------------------------- */

const getLanguage = (): MarketLang => {
  if (typeof document === "undefined") return "en";

  return document.documentElement.lang.toLowerCase().startsWith("ar")
    ? "ar"
    : "en";
};

const subscribeLanguage = (callback: () => void) => {
  if (typeof document === "undefined") {
    return () => {};
  }

  const observer = new MutationObserver(callback);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  return () => observer.disconnect();
};

const useLanguage = (): MarketLang =>
  useSyncExternalStore(subscribeLanguage, getLanguage, () => "en");

/* ----------------------------- Helpers ----------------------------- */

const stripHtml = (value: string): string => {
  if (!value) return "";

  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(?:p|div|h[1-6]|li)>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
};

const getText = (
  value: MarketLocalized | undefined,
  lang: MarketLang,
): string => stripHtml(value?.[lang] ?? "");

const getImage = (
  media: MarketLocalizedMedia | undefined,
  lang: MarketLang,
): string | undefined =>
  media?.[lang]?.find((item) => item.url)?.url || undefined;

/*
 * Preserve the original two-line handwritten tagline.
 * Uses the actual API text rather than hardcoded wording.
 */
const splitSideTitle = (value: string): [string, string] => {
  const words = value.trim().split(/\s+/);

  if (words.length <= 1) {
    return [value, ""];
  }

  const midpoint = Math.ceil(words.length / 2);

  return [words.slice(0, midpoint).join(" "), words.slice(midpoint).join(" ")];
};

/* ----------------------------- Skeleton ----------------------------- */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-white/20 ${className}`}
  />
);

const NextChapterSkeleton = () => (
  <div
    className="relative mx-auto max-w-6xl px-6"
    role="status"
    aria-label="Loading global markets"
  >
    <div className="mb-3 flex items-center gap-3">
      <Skeleton className="h-9 w-44 rounded-full" />
    </div>

    <div className="mt-6 space-y-3">
      <Skeleton className="h-9 w-full max-w-xl" />
      <Skeleton className="h-9 w-4/5 max-w-lg" />
    </div>

    <div className="mt-6 space-y-3">
      <Skeleton className="h-4 w-full max-w-md" />
      <Skeleton className="h-4 w-11/12 max-w-md" />
      <Skeleton className="h-4 w-3/4 max-w-md" />
    </div>

    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:ml-40 lg:w-fit">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-40 rounded-xl lg:w-40" />
      ))}
    </div>
  </div>
);

/* ----------------------------- Component ----------------------------- */

const NextChapter = () => {
  const lang = useLanguage();

  const { data, isLoading, isError, refetch } = useGetGlobalMarketsQuery();

  const section = data?.section;

  const markets = [...(data?.markets ?? [])]
    .filter((market) => market.isActive)
    .sort((a, b) => a.order - b.order);

  const backgroundImage = getImage(section?.bgImage, lang) || BG_IMAGE;

  const sideTitle = getText(section?.sideTitle, lang);
  const [sideLine1, sideLine2] = splitSideTitle(sideTitle);

  return (
    <section
      className="relative isolate -mt-px bg-black pb-16 pt-24 text-white lg:pt-28"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `url("${backgroundImage}")`,
        }}
      />

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-black/40 via-black/60 to-black/90"
      />

      {/* Top fade */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-24"
        style={{
          background: `linear-gradient(${TOP_FILL}, transparent)`,
        }}
      />

      {/* Original curved border */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-10 w-full overflow-visible lg:h-14"
      >
        <path d="M0 0H1440V60Q720 -60 0 60Z" fill={TOP_FILL} />

        <path
          d="M0 60Q720 -60 1440 60"
          fill="none"
          stroke={GOLD}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {isLoading ? (
        <NextChapterSkeleton />
      ) : isError ? (
        <div className="relative mx-auto flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-white/80">
            {lang === "ar"
              ? "تعذر تحميل الأسواق العالمية."
              : "Unable to load global markets."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-[#00852B] px-5 py-2 text-sm font-semibold text-white"
          >
            {lang === "ar" ? "إعادة المحاولة" : "Try Again"}
          </button>
        </div>
      ) : !section ? (
        <div className="relative mx-auto min-h-48 px-6 text-center text-white/80">
          {lang === "ar"
            ? "لا يوجد محتوى متاح حالياً."
            : "No global markets content available."}
        </div>
      ) : (
        <div className="relative mx-auto max-w-6xl px-6">
          {/* Handwritten tagline - constrained to right side */}
          {sideTitle && (
            <p
              className={`absolute top-0 hidden max-w-[42%] -rotate-6 text-7xl leading-tight font-extrabold text-[#3ddc6e] lg:block ${
                lang === "ar" ? "left-6 text-left" : "right-6 text-right"
              } ${lang === "en" ? script.className : ""}`}
            >
              <span className="block">{sideLine1}</span>
              {sideLine2 && <span className="block">{sideLine2}</span>}
              <span className="mt-1 block h-px w-full bg-[#3ddc6e]" />
            </p>
          )}

          {/* Badge */}
          <div className="mb-3 flex items-center gap-3">
            <span className="hidden h-px w-10 bg-[#3ddc6e] sm:block" />

            <span className="rounded-full border border-[#3ddc6e] bg-black/40 px-5 py-1.5 text-sm font-extrabold tracking-[0.2em] text-[#3ddc6e]">
              {getText(section.badge, lang)}
            </span>

            <span className="hidden h-px w-10 bg-[#3ddc6e] sm:block" />
          </div>

          {/* Heading */}
          <h2 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
            {getText(section.title, lang)}{" "}
            <span className="text-[#3ddc6e]">
              {getText(section.highlightedTitle, lang)}
            </span>
          </h2>

          {/* Description */}
          <p className="mt-5 max-w-md text-md leading-6 text-white/90">
            {getText(section.description, lang)}
          </p>

          {/* Country cards */}
          <div
            className={`mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 ${
              lang === "ar" ? "lg:mr-40" : "lg:ml-40"
            } lg:w-fit`}
          >
            {markets.map((market) => {
              const name = getText(market.title, lang);

              /*
               * Prefer uploaded API image.
               * Use original image when API image is empty.
               */
              const imageUrl =
                getImage(market.image, lang) || COUNTRY_IMAGES[market.title.en];

              return (
                <div
                  key={market._id}
                  className="relative h-40 overflow-hidden rounded-xl border border-[#3ddc6e] bg-black lg:w-40"
                >
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 50vw, 160px"
                      unoptimized
                      className="object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-linear-to-t from-[#0b1230] via-transparent to-transparent" />

                  <p className="absolute inset-x-0 bottom-2 text-center text-sm font-semibold">
                    {name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default NextChapter;
