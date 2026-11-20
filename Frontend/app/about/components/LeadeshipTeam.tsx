"use client";

import Image from "next/image";
import React, { useSyncExternalStore } from "react";
import Title from "@/app/components/Title";

import {
  useGetLeadershipQuery,
  type LeadershipLang,
  type LeadershipLocalized,
  type LeadershipLocalizedMedia,
} from "@/app/store/api/leadershipApi";

/* ----------------------------- Constants ----------------------------- */

const ACCENT = "#3ddc6e";
const ACCENT_DARK = "#00852B";

/* ----------------------------- Language ----------------------------- */

const getLanguage = (): LeadershipLang => {
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

const useLanguage = (): LeadershipLang =>
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
  value: LeadershipLocalized | undefined,
  lang: LeadershipLang,
): string => stripHtml(value?.[lang] ?? "");

const getImage = (
  media: LeadershipLocalizedMedia | undefined,
  lang: LeadershipLang,
): string | undefined =>
  media?.[lang]?.find((item) => item.url)?.url || undefined;

const splitHeading = (title: string) => {
  const words = title.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return { title: "", colorTitle: "" };
  }

  const splitAt = Math.min(2, words.length);

  return {
    title: words.slice(0, splitAt).join(" "),
    colorTitle: words.slice(splitAt).join(" "),
  };
};

/* ----------------------------- Skeleton ----------------------------- */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-gray-200 ${className}`}
  />
);

const LeadershipSkeleton = () => (
  <div
    className="relative mx-auto max-w-5xl px-4 sm:px-6"
    role="status"
    aria-label="Loading leadership team"
  >
    {/* Heading skeleton */}
    <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>

    {/* Member card skeletons */}
    <div className="mt-8 grid gap-5 sm:mt-10">
      {Array.from({ length: 2 }, (_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-2xl border border-[#3ddc6e]/30 bg-white p-3 shadow-sm sm:p-4 md:flex-row md:gap-6"
        >
          <Skeleton className="h-62 w-full rounded-lg sm:h-86 md:w-56 md:shrink-0 lg:w-64" />

          <div className="flex min-w-0 flex-1 flex-col gap-4 md:py-1">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />

            <div className="mt-2 space-y-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>

    <span className="sr-only">Loading...</span>
  </div>
);

/* ----------------------------- Component ----------------------------- */

const LeadeshipTeam = () => {
  const lang = useLanguage();

  const { data, isLoading, isError, refetch } = useGetLeadershipQuery();

  const section = data?.section;

  const members = [...(data?.members ?? [])]
    .filter((member) => member.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const heading = splitHeading(getText(section?.leadershipTitle, lang));

  const backgroundImage = getImage(section?.backgroundImage, lang);

  return (
    <section className="relative" dir={lang === "ar" ? "rtl" : "ltr"}>
      {/* Dynamic background image: no fallback */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="-z-10 object-cover opacity-20"
        />
      )}

      {/* Original decorative fades */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white to-transparent sm:h-32"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white to-transparent sm:h-32"
      />

      {isLoading ? (
        <LeadershipSkeleton />
      ) : isError ? (
        <div className="relative mx-auto flex min-h-72 flex-col items-center justify-center px-4 text-center">
          <p className="mb-4 text-sm text-gray-600">
            {lang === "ar"
              ? "تعذر تحميل بيانات فريق القيادة."
              : "Unable to load leadership team."}
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
        <div className="relative mx-auto min-h-48 px-4 text-center text-sm text-gray-600">
          {lang === "ar"
            ? "لا يوجد محتوى متاح حالياً."
            : "No leadership content available."}
        </div>
      ) : (
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          {/* API-driven heading */}
          <Title
            title={heading.title}
            colorTitle={heading.colorTitle}
            subtitle={getText(section.leadershipDescription, lang)}
            watermark=""
          />

          {/* API-driven member cards */}
          {members.length > 0 && (
            <div className="mt-8 grid gap-5 sm:mt-10">
              {members.map((member) => {
                const name = getText(member.name, lang);
                const role = getText(member.role, lang);
                const bio = getText(member.bio, lang);
                const imageUrl = getImage(member.image, lang);

                return (
                  <article
                    key={member._id}
                    className="flex flex-col gap-4 rounded-2xl border bg-white p-3 shadow-sm sm:p-4 md:flex-row md:gap-6"
                    style={{
                      borderColor: `${ACCENT}66`,
                    }}
                  >
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={name}
                        width={300}
                        height={500}
                        unoptimized
                        className="h-62 w-full rounded-lg object-cover object-top sm:h-86 md:w-56 md:shrink-0 md:self-stretch lg:w-64"
                      />
                    ) : (
                      <div className="h-62 w-full shrink-0 rounded-lg bg-gray-100 sm:h-86 md:w-56 lg:w-64" />
                    )}

                    <div className="flex min-w-0 flex-1 flex-col md:py-1">
                      {name && (
                        <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                          {name}
                        </h3>
                      )}

                      {role && (
                        <p
                          className="mt-2 text-xs font-semibold sm:text-sm"
                          style={{ color: ACCENT_DARK }}
                        >
                          {role}
                        </p>
                      )}

                      {bio && (
                        <p className="mt-3 whitespace-pre-line text-start text-sm leading-6 text-gray-600 sm:text-justify">
                          {bio}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default LeadeshipTeam;
