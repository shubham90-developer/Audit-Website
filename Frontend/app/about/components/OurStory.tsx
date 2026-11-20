"use client";

import Image from "next/image";
import React, { useMemo, useSyncExternalStore } from "react";

import {
  useGetOurStoryQuery,
  type StoryLang,
  type StoryLocalized,
  type StoryLocalizedMedia,
} from "@/app/store/api/ourStoryApi";

/* ----------------------------- Language ----------------------------- */

const getLanguage = (): StoryLang => {
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

const useLanguage = (): StoryLang =>
  useSyncExternalStore(subscribeLanguage, getLanguage, () => "en");

/* ----------------------------- Helpers ----------------------------- */

const stripHtml = (value: string): string => {
  if (!value) return "";

  const clean = value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|h[1-6]|li)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();

  return clean;
};

const getText = (value: StoryLocalized | undefined, lang: StoryLang): string =>
  stripHtml(value?.[lang] ?? "");

const getImage = (
  media: StoryLocalizedMedia | undefined,
  lang: StoryLang,
): string | undefined => media?.[lang]?.[0]?.url || undefined;

/* ----------------------------- Skeleton ----------------------------- */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-gray-200 ${className}`}
  />
);

const OurStorySkeleton = () => (
  <div
    className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.6fr_1fr]"
    role="status"
    aria-label="Loading Our Story"
  >
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Skeleton className="h-px w-10" />
        <Skeleton className="h-9 w-36 rounded-full" />
        <Skeleton className="h-px w-10" />
      </div>

      <div className="mb-6 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 shrink-0 rounded-full" />

            <div className="flex-1 rounded-xl border border-[#3ddc6e]/20 bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-6" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              <div className="mt-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-2xl border border-[#3ddc6e]/40 bg-neutral-700/80 p-8">
      <Skeleton className="mb-5 h-9 w-9 bg-white/20" />

      <div className="space-y-3">
        <Skeleton className="h-4 w-full bg-white/20" />
        <Skeleton className="h-4 w-11/12 bg-white/20" />
        <Skeleton className="h-4 w-full bg-white/20" />
        <Skeleton className="h-4 w-3/4 bg-white/20" />
      </div>

      <Skeleton className="my-5 h-px w-12 bg-white/20" />

      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-3/4 bg-white/20" />
          <Skeleton className="h-3 w-1/2 bg-white/20" />
        </div>
      </div>
    </div>

    <span className="sr-only">Loading...</span>
  </div>
);

/* ----------------------------- Component ----------------------------- */

const OurStory = () => {
  const lang = useLanguage();

  const { data, isLoading, isError, refetch } = useGetOurStoryQuery();

  // The API already unwraps response.data.
  const section = data?.section;

  const steps = useMemo(
    () => [...(data?.steps ?? [])].sort((a, b) => a.order - b.order),
    [data?.steps],
  );

  const bgImage = getImage(section?.bgImage, lang);
  const authorImage = getImage(section?.authorImage, lang);

  return (
    <section
      className="relative bg-[#fffaf1] py-16"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Dynamic full-width background image */}
      {bgImage && (
        <Image
          src={bgImage}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-cover"
        />
      )}

      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-[#fdfbf8] to-transparent" />

      {isLoading ? (
        <OurStorySkeleton />
      ) : isError ? (
        <div className="relative mx-auto flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-sm text-red-600">
            {lang === "ar" ? "تعذر تحميل قصتنا." : "Unable to load Our Story."}
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
        <div className="relative mx-auto min-h-48 px-6 text-center text-sm text-gray-600">
          {lang === "ar"
            ? "لا يوجد محتوى متاح حالياً."
            : "No story content available."}
        </div>
      ) : (
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Left: heading + timeline */}
          <div>
            {/* Dynamic badge */}
            <div className="mb-6 flex items-center gap-3">
              <span className="hidden h-px w-10 bg-[#3ddc6e] sm:block" />

              <span className="rounded-full border border-[#3ddc6e] bg-white px-5 py-1.5 text-sm font-extrabold tracking-[0.2em] text-[#3ddc6e]">
                {getText(section.badge, lang)}
              </span>

              <span className="hidden h-px w-10 bg-[#3ddc6e] sm:block" />
            </div>

            {/* Dynamic narrative */}
            {getText(section.narrative, lang) && (
              <p className="mb-6 max-w-2xl whitespace-pre-line leading-relaxed text-gray-900">
                {getText(section.narrative, lang)}
              </p>
            )}

            {/* Dynamic timeline */}
            <ul className="space-y-3">
              {steps.map((step, index) => {
                const stepImage = getImage(step.image, lang);

                return (
                  <li
                    key={step._id}
                    className="relative flex items-center gap-4"
                  >
                    {/* Dynamic step image */}
                    {stepImage ? (
                      <Image
                        src={stepImage}
                        alt={getText(step.title, lang)}
                        width={100}
                        height={100}
                        unoptimized
                        className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-[#3ddc6e] ring-offset-2 ring-offset-white"
                      />
                    ) : (
                      <div className="h-16 w-16 shrink-0 rounded-full border-2 border-[#3ddc6e]/30 bg-white/60" />
                    )}

                    <div className="flex-1 rounded-xl border border-[#3ddc6e]/30 bg-white px-4 py-3 shadow-sm">
                      <div className="flex items-baseline gap-3">
                        <span className="text-lg font-semibold text-[#3ddc6e]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <h3 className="text-sm font-bold text-gray-900">
                          {getText(step.title, lang)}
                        </h3>
                      </div>

                      <p className="mt-1 ps-9 whitespace-pre-line text-xs leading-relaxed text-gray-600">
                        {getText(step.text, lang)}
                      </p>
                    </div>

                    {index < steps.length - 1 && (
                      <span
                        className={`absolute -bottom-2.5 h-1 w-1 rounded-full bg-[#3ddc6e] ${
                          lang === "ar" ? "right-8" : "left-8"
                        }`}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right: dynamic quote card */}
          <figure className="rounded-2xl border border-[#3ddc6e]/70 bg-neutral-700/80 p-8 text-white shadow-xl backdrop-blur-md">
            <span
              aria-hidden="true"
              className="text-4xl font-black leading-none text-[#3ddc6e]"
            >
              “
            </span>

            <blockquote className="mt-2 whitespace-pre-line text-lg italic leading-relaxed">
              {getText(section.quote, lang)}
            </blockquote>

            <div className="my-5 h-px w-12 bg-[#3ddc6e]/60" />

            <figcaption className="flex items-center gap-3">
              {/* Dynamic author image */}
              {authorImage ? (
                <Image
                  src={authorImage}
                  alt={getText(section.authorName, lang)}
                  width={100}
                  height={100}
                  unoptimized
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[#3ddc6e]"
                />
              ) : (
                <div className="h-12 w-12 shrink-0 rounded-full border-2 border-[#3ddc6e]/40 bg-white/10" />
              )}

              <div>
                <p className="text-xs font-bold">
                  {getText(section.authorName, lang)}
                </p>

                <p className="text-xs text-gray-300">
                  {getText(section.authorRole, lang)}
                </p>
              </div>
            </figcaption>
          </figure>
        </div>
      )}

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#fffaf1] to-transparent" />
    </section>
  );
};

export default OurStory;
