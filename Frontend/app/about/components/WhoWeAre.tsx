"use client";

import React, { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mrs_Saint_Delafield } from "next/font/google";
import type { IconType } from "react-icons";

import { FiAward, FiGlobe, FiLayers, FiMapPin, FiShield } from "react-icons/fi";
import { HiOutlineBadgeCheck } from "react-icons/hi";

import ThemeBtn from "@/app/components/ThemeBtn";

import {
  useGetWhoWeAreQuery,
  type Lang,
  type Localized,
  type SnapshotIcon,
} from "@/app/store/api/whoWeAreApi";

/* ----------------------------- Constants ----------------------------- */

const script = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
});

const BG_IMAGE = "/img/banner/bg8.avif";
const CARD_HEADER_IMAGE = "/img/banner/bg3.avif";

const ICON_MAP: Record<SnapshotIcon, IconType> = {
  award: FiAward,
  badge: HiOutlineBadgeCheck,
  shield: FiShield,
  globe: FiGlobe,
  layers: FiLayers,
  pin: FiMapPin,
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

const stripHtml = (value: string): string => {
  if (!value) return "";

  const withoutTags = value
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

  return withoutTags;
};

const getText = (value: Localized | undefined, lang: Lang): string =>
  stripHtml(value?.[lang] ?? "");

/* ----------------------------- Skeleton ----------------------------- */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-slate-200 ${className}`}
  />
);

const WhoWeAreSkeleton = () => (
  <div
    className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10"
    role="status"
    aria-label="Loading Who We Are"
  >
    {/* Left side skeleton */}
    <div>
      <div className="flex items-center gap-3">
        <Skeleton className="hidden h-px w-12 sm:block" />
        <Skeleton className="h-10 w-44 rounded-full" />
      </div>

      <div className="mt-8 space-y-3">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-5/6" />
        <Skeleton className="h-11 w-3/4" />
      </div>

      <div className="mt-8 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="mt-8 rounded-r-2xl border-s-4 border-[#3ddc6e]/40 bg-white/70 px-6 py-5">
        <Skeleton className="mb-3 h-4 w-full" />
        <Skeleton className="mb-3 h-4 w-11/12" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      <Skeleton className="mt-10 h-12 w-48 rounded-lg" />
    </div>

    {/* Right side skeleton */}
    <div>
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10">
        <div className="flex flex-wrap justify-between gap-4 bg-slate-800 px-6 py-7">
          <div className="h-4 w-36 animate-pulse rounded bg-white/20" />
          <div className="h-4 w-40 animate-pulse rounded bg-white/20" />
        </div>

        <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="flex items-start gap-4 bg-white p-6">
              <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />

              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Skeleton className="ms-auto mt-16 h-12 w-64" />
    </div>

    <span className="sr-only">Loading...</span>
  </div>
);

/* ----------------------------- Component ----------------------------- */

export default function WhoWeAre() {
  const router = useRouter();
  const lang = useLanguage();

  const { data: section, isLoading, isError, refetch } = useGetWhoWeAreQuery();

  const handleNavigation = () => {
    if (!section) return;

    const href = section.ctaHref?.[lang];

    if (!href) return;

    // External URL
    if (/^https?:\/\//i.test(href)) {
      window.location.assign(href);
      return;
    }

    // Internal route
    if (href.startsWith("/") && !href.startsWith("//")) {
      router.push(href);
    } else if (!href.startsWith("//")) {
      router.push(`/${href}`);
    }
  };

  return (
    <section
      className="relative isolate bg-[#fdf9f3] py-16 lg:py-24"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Background image */}
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-30"
      />

      {/* Cream gradient */}
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-white/40 via-[#fdf9f3]/90 to-[#fdf9f3]" />

      {/* Decorative glows */}
      <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-[#3ddc6e]/15 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 right-0 -z-10 h-80 w-80 rounded-full bg-[#3ddc6e]/20 blur-3xl" />

      {/* Loading state */}
      {isLoading ? (
        <WhoWeAreSkeleton />
      ) : isError || !section ? (
        <div className="mx-auto flex min-h-75 flex-col items-center justify-center px-4 text-center">
          <p className="mb-4 text-sm text-slate-600">
            {lang === "ar"
              ? "تعذر تحميل محتوى من نحن."
              : "Unable to load Who We Are content."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-[#00852B] px-5 py-2 text-sm font-semibold text-white"
          >
            {lang === "ar" ? "إعادة المحاولة" : "Try Again"}
          </button>
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10">
          {/* Left: story */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="hidden h-px w-12 bg-[#3ddc6e] sm:block" />

              <span className="rounded-full border border-[#3ddc6e]/60 bg-[#fffaf0] px-6 py-2 text-sm font-bold uppercase tracking-[0.25em] text-[#3ddc6e] shadow-sm">
                {getText(section.eyebrow, lang)}
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              {getText(section.headlinePrefix, lang)}{" "}
              <span className="relative inline-block text-[#3ddc6e]">
                {getText(section.highlight, lang)}

                <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-[#3ddc6e]/50" />
              </span>{" "}
              {getText(section.headlineSuffix, lang)}
            </h2>

            {/* Body */}
            <p className="mt-8 max-w-xl text-base leading-8 text-slate-600">
              <strong className="font-semibold text-slate-900">
                {getText(section.brandName, lang)}
              </strong>{" "}
              {getText(section.body, lang)}
            </p>

            {/* Quote */}
            {getText(section.quote, lang) && (
              <blockquote className="relative mt-8 max-w-xl rounded-r-2xl border-s-4 border-[#3ddc6e] bg-white/70 py-4 pe-5 ps-6 text-[17px] italic leading-8 text-slate-700 shadow-sm backdrop-blur-sm">
                <span
                  aria-hidden="true"
                  className="absolute -top-4 left-4 select-none font-serif text-6xl leading-none text-[#3ddc6e]/60"
                >
                  “
                </span>

                {getText(section.quote, lang)}
              </blockquote>
            )}

            {/* CTA */}
            {getText(section.ctaLabel, lang) && (
              <div className="mt-10">
                <ThemeBtn onClick={handleNavigation}>
                  {getText(section.ctaLabel, lang)}
                </ThemeBtn>
              </div>
            )}
          </div>

          {/* Right: firm snapshot */}
          <div>
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10">
              {/* Header */}
              <div className="relative isolate flex flex-wrap items-center justify-between gap-2 px-6 py-7 text-white">
                <Image
                  src={CARD_HEADER_IMAGE}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="-z-20 object-cover"
                />

                <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#111]/90 to-[#111]/70" />

                <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#3ddc6e]">
                  <span className="h-px w-8 bg-[#3ddc6e]" />

                  {getText(section.snapshotTitle, lang)}
                </span>

                <span className="text-sm italic text-white/90">
                  {getText(section.snapshotTagline, lang)}
                </span>
              </div>

              {/* Snapshot cards */}
              <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
                {[...(section.snapshotItems ?? [])]
                  .sort((a, b) => a.order - b.order)
                  .map((item, index) => {
                    const Icon = ICON_MAP[item.icon];

                    return (
                      <div
                        key={item._id ?? index}
                        className="group flex items-start gap-4 bg-white p-6 transition-colors duration-300 hover:bg-[#f3fff0]"
                      >
                        {/* Icon */}
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#fdf6e6] text-2xl text-[#3ddc6e] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#3ddc6e] group-hover:text-white">
                          {Icon && <Icon />}
                        </span>

                        <div className="min-w-0">
                          {/* Label */}
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            {getText(item.label, lang)}
                          </p>

                          {/* Value */}
                          {getText(item.value, lang) && (
                            <p className="mt-1 text-xl font-bold text-slate-900">
                              {getText(item.value, lang)}
                            </p>
                          )}

                          {/* Note */}
                          {getText(item.note, lang) && (
                            <p className="mt-1 text-sm leading-5 text-slate-600">
                              {getText(item.note, lang)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Signature */}
            {getText(section.watermark, lang) && (
              <p
                className={`${
                  lang === "en" ? script.className : ""
                } -rotate-6 mt-16 flex items-center justify-end gap-2 font-[cursive] text-6xl text-[#8a5a00]`}
              >
                {getText(section.watermark, lang)}

                <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc6e]" />
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
