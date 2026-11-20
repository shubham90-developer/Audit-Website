"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ThemeBtn from "@/app/components/ThemeBtn";

import { BsBarChartFill, BsBuilding, BsStarFill } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";
import type { IconType } from "react-icons";

import { useGetAboutUsQuery } from "@/app/store/api/aboutUsApi";

/* ----------------------------- Types ----------------------------- */

type Lang = "en" | "ar";

interface Localized {
  en: string;
  ar: string;
}

interface Media {
  url: string;
  publicId?: string;
}

interface LocalizedMedia {
  en: Media[];
  ar: Media[];
}

interface HeroStat {
  _id?: string;
  value: string;
  label: Localized;
  icon: string;
}

interface AboutHeroData {
  title: Localized;
  subtitle: Localized;
  intro1: Localized;
  intro2: Localized;
  cta1Label: Localized;
  cta1Href: string;
  cta2Label: Localized;
  cta2Href: string;
  speakLabel: Localized;
  heroImage: LocalizedMedia;
  bgImage: LocalizedMedia;
  stats: HeroStat[];
}

interface AboutUsResponse {
  hero?: AboutHeroData;
}

/* ----------------------------- Icons ----------------------------- */

const ICON_MAP: Record<string, IconType> = {
  building: BsBuilding,
  chart: BsBarChartFill,
  star: BsStarFill,
  google: FaGoogle,
};

/* ----------------------------- Language ----------------------------- */

const getLanguage = (): Lang => {
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

const useLanguage = (): Lang =>
  useSyncExternalStore(subscribeLanguage, getLanguage, () => "en");

/* ----------------------------- Helpers ----------------------------- */

/**
 * Remove HTML tags from rich text editor content.
 * Preserve readable text and common HTML entities.
 */
const stripHtml = (value: string): string => {
  if (!value) return "";

  const text = value
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

  return text;
};

const getText = (value: Localized | undefined, lang: Lang): string =>
  stripHtml(value?.[lang] ?? "");

const getImage = (
  media: LocalizedMedia | undefined,
  lang: Lang,
): string | undefined => {
  return media?.[lang]?.[0]?.url || undefined;
};

/* ----------------------------- Skeleton ----------------------------- */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-white/15 ${className}`}
  />
);

const AboutHeroSkeleton = () => (
  <div
    className="mx-auto max-w-7xl space-y-10 px-4 sm:px-8 lg:px-10"
    role="status"
    aria-label="Loading about hero"
  >
    {/* Text + photo skeleton */}
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      <div>
        <Skeleton className="mb-3 h-11 w-3/4" />
        <Skeleton className="mb-3 h-11 w-full" />
        <Skeleton className="h-11 w-4/5" />

        <div className="mt-7 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="mt-6 space-y-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-3/4" />
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Skeleton className="h-11 w-48 rounded-lg" />
          <Skeleton className="h-11 w-36 rounded-lg" />
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Skeleton className="h-px w-16" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Hero image skeleton */}
      <Skeleton className="h-72 w-full rounded-2xl sm:h-96 lg:h-115" />
    </div>

    {/* Stats skeleton */}
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="flex items-center justify-center gap-3 rounded-2xl border border-[#3ddc6e]/40 bg-white/10 px-3 py-5 backdrop-blur-md sm:gap-4 sm:px-4 sm:py-6"
        >
          <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />

          <div className="space-y-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      ))}
    </div>

    <span className="sr-only">Loading...</span>
  </div>
);

/* ----------------------------- Component ----------------------------- */

export default function AboutHero() {
  const router = useRouter();
  const lang = useLanguage();

  const { data, isLoading, isError, refetch } = useGetAboutUsQuery();

  const content = data as AboutUsResponse | undefined;
  const hero = content?.hero;

  const bgImage = getImage(hero?.bgImage, lang);
  const heroImage = getImage(hero?.heroImage, lang);

  const handleNavigation = (href?: string) => {
    if (!href) return;

    if (/^https?:\/\//i.test(href)) {
      window.location.assign(href);
      return;
    }

    if (href.startsWith("/") && !href.startsWith("//")) {
      router.push(href);
    } else if (!href.startsWith("//")) {
      router.push(`/${href}`);
    }
  };

  return (
    <section
      className="relative isolate bg-[#111] py-16 text-white lg:py-24"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Dynamic background image */}
      {bgImage && (
        <Image
          src={bgImage}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
          className="-z-20 object-cover"
        />
      )}

      {/* Existing gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[#111]/85 lg:bg-linear-to-r lg:from-[#111]/95 lg:via-[#111]/80 lg:to-[#111]/40" />

      {/* Loading skeleton */}
      {isLoading ? (
        <AboutHeroSkeleton />
      ) : isError ? (
        <div className="mx-auto flex min-h-75 flex-col items-center justify-center px-4 text-center">
          <p className="mb-4 text-sm text-white/80">
            {lang === "ar"
              ? "تعذر تحميل المحتوى."
              : "Unable to load About Us content."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-[#00852B] px-5 py-2 text-sm font-semibold text-white"
          >
            {lang === "ar" ? "إعادة المحاولة" : "Try Again"}
          </button>
        </div>
      ) : !hero ? (
        <AboutHeroSkeleton />
      ) : (
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-8 lg:px-10">
          {/* Text + photo */}
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              {/* Dynamic heading */}
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                <span className="text-[#3ddc6e]">
                  {getText(hero.title, lang)}
                </span>

                <br />

                {getText(hero.subtitle, lang)}
              </h1>

              {/* Dynamic introduction */}
              <p className="mt-5 max-w-xl text-base leading-8 text-white/90">
                {getText(hero.intro1, lang)}
              </p>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
                {getText(hero.intro2, lang)}
              </p>

              {/* Dynamic CTA buttons */}
              <div className="mt-7 flex flex-wrap gap-3">
                {getText(hero.cta1Label, lang) && (
                  <ThemeBtn onClick={() => handleNavigation(hero.cta1Href)}>
                    {getText(hero.cta1Label, lang)}
                  </ThemeBtn>
                )}

                {getText(hero.cta2Label, lang) && (
                  <ThemeBtn onClick={() => handleNavigation(hero.cta2Href)}>
                    {getText(hero.cta2Label, lang)}
                  </ThemeBtn>
                )}
              </div>

              {/* Dynamic speak label */}
              {getText(hero.speakLabel, lang) && (
                <p className="mt-6 flex items-center gap-3 text-sm text-white/70">
                  <span className="h-px w-16 bg-linear-to-r from-[#3ddc6e] to-transparent" />

                  {getText(hero.speakLabel, lang)}
                </p>
              )}
            </div>

            {/* Dynamic hero photo */}
            {heroImage ? (
              <div className="relative h-72 overflow-hidden rounded-2xl border border-[#3ddc6e]/30 sm:h-96 lg:h-115">
                <Image
                  src={heroImage}
                  alt={getText(hero.title, lang)}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <Skeleton className="h-72 w-full rounded-2xl sm:h-96 lg:h-115" />
            )}
          </div>

          {/* Dynamic stats */}
          {hero.stats?.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {hero.stats.map((stat, index) => {
                const Icon = ICON_MAP[stat.icon];

                return (
                  <div
                    key={stat._id ?? index}
                    className="flex items-center justify-center gap-3 rounded-2xl border border-[#3ddc6e]/40 bg-white/10 px-3 py-5 shadow-sm backdrop-blur-md transition-colors duration-300 hover:border-[#3ddc6e] hover:bg-white/15 sm:gap-4 sm:px-4 sm:py-6"
                  >
                    {Icon && (
                      <span
                        className={`shrink-0 text-3xl sm:text-4xl ${
                          stat.icon === "star"
                            ? "text-[#00B67A]"
                            : stat.icon === "google"
                              ? "text-[#4285F4]"
                              : "text-[#3ddc6e]"
                        }`}
                      >
                        <Icon />
                      </span>
                    )}

                    <div>
                      <p className="text-xl font-bold leading-none sm:text-2xl">
                        {stripHtml(stat.value)}
                      </p>

                      <p className="mt-1 text-xs text-white/75">
                        {getText(stat.label, lang)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-[#3ddc6e]/40 bg-white/10 px-4 py-6"
                >
                  <Skeleton className="mb-3 h-7 w-20" />
                  <Skeleton className="h-3 w-28" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
