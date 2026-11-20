"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import Title from "@/app/components/Title";

import {
  useGetLeadershipQuery,
  type LeadershipLang,
  type LeadershipLocalized,
  type LeadershipLocalizedMedia,
} from "@/app/store/api/leadershipApi";

/* ----------------------------- Constants ----------------------------- */

const ACCENT = "#3ddc6e";

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

  return {
    title: words.slice(0, 3).join(" "),
    colorTitle: words.slice(3).join(" "),
  };
};

/* ----------------------------- Skeletons ----------------------------- */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-gray-200 ${className}`}
  />
);

const TeamSkeleton = () => (
  <div
    className="mx-auto max-w-5xl px-4 sm:px-6"
    role="status"
    aria-label="Loading team members"
  >
    {/* Heading skeleton */}
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>

    {/* Coverflow skeleton */}
    <div className="relative mt-8 h-80 sm:mt-10 sm:h-96">
      {[-2, -1, 0, 1, 2].map((offset) => {
        const abs = Math.abs(offset);
        const scale = offset === 0 ? 1.15 : abs === 1 ? 0.92 : 0.82;

        return (
          <div
            key={offset}
            className={`absolute left-1/2 top-1/2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:w-48 ${
              abs === 2 ? "max-sm:opacity-0" : ""
            }`}
            style={{
              transform: `translate(-50%, -50%) translateX(${
                offset * 110
              }px) scale(${scale})`,
              zIndex: 10 - abs,
            }}
          >
            <Skeleton className="h-40 w-full rounded-none" />

            <div className="space-y-3 px-3 py-3">
              <Skeleton className="h-2 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        );
      })}
    </div>

    {/* Controls skeleton */}
    <div className="mt-6 flex items-center justify-center gap-4">
      <Skeleton className="h-9 w-9 rounded-full" />
      <Skeleton className="h-2 w-24" />
      <Skeleton className="h-9 w-9 rounded-full" />
    </div>

    <span className="sr-only">Loading...</span>
  </div>
);

/* ----------------------------- Component ----------------------------- */

const Team = () => {
  const lang = useLanguage();

  const { data, isLoading, isError, refetch } = useGetLeadershipQuery();

  const [active, setActive] = useState(0);

  const section = data?.section;

  /*
   * Use active non-featured members for the team carousel.
   * Featured leadership member is displayed in LeadeshipTeam.
   */
  const members = [...(data?.members ?? [])]
    .filter(
      (member) =>
        member.isActive !== false &&
        !(
          member as typeof member & {
            isFeatured?: boolean;
          }
        ).isFeatured,
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const total = members.length;

  useEffect(() => {
    setActive((previous) => (total > 0 ? previous % total : 0));
  }, [total]);

  const go = (index: number) => {
    if (total === 0) return;
    setActive(((index % total) + total) % total);
  };

  const offsetOf = (index: number) => {
    if (total === 0) return 0;

    let distance = index - active;

    if (distance > total / 2) distance -= total;
    if (distance < -total / 2) distance += total;

    return distance;
  };

  const heading = splitHeading(getText(section?.teamTitle, lang));

  return (
    <section
      className="relative py-12 sm:py-16"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {isLoading ? (
        <TeamSkeleton />
      ) : isError ? (
        <div className="mx-auto flex min-h-72 max-w-5xl flex-col items-center justify-center px-4 text-center">
          <p className="mb-4 text-sm text-gray-600">
            {lang === "ar"
              ? "تعذر تحميل أعضاء الفريق."
              : "Unable to load team members."}
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
        <div className="mx-auto min-h-48 max-w-5xl px-4 text-center text-sm text-gray-600">
          {lang === "ar"
            ? "لا يوجد محتوى متاح حالياً."
            : "No team content available."}
        </div>
      ) : (
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Dynamic heading */}
          <Title
            title={heading.title}
            colorTitle={heading.colorTitle}
            subtitle={getText(section.teamDescription, lang)}
            watermark=""
          />

          {/* Coverflow */}
          {total > 0 && (
            <>
              <div className="relative mt-8 h-80 [--step:62px] sm:mt-10 sm:h-96 sm:[--step:120px] lg:[--step:160px]">
                {members.map((member, index) => {
                  const distance = offsetOf(index);
                  const abs = Math.abs(distance);
                  const isActive = distance === 0;

                  const scale = isActive ? 1.15 : abs === 1 ? 0.92 : 0.82;

                  const name = getText(member.name, lang);
                  const role = getText(member.role, lang);

                  const department = getText(
                    (
                      member as typeof member & {
                        department?: LeadershipLocalized;
                      }
                    ).department,
                    lang,
                  );

                  const imageUrl = getImage(member.image, lang);

                  return (
                    <article
                      key={member._id}
                      onClick={() => !isActive && go(index)}
                      className={`absolute left-1/2 top-1/2 w-44 overflow-hidden rounded-xl border bg-white transition-all duration-500 sm:w-48 ${
                        isActive ? "shadow-xl" : "cursor-pointer shadow-sm"
                      } ${
                        abs > 2
                          ? "pointer-events-none opacity-0"
                          : abs === 2
                            ? "max-sm:pointer-events-none max-sm:opacity-0"
                            : ""
                      }`}
                      style={{
                        transform: `translate(-50%, -50%) translateX(calc(var(--step) * ${distance})) scale(${scale})`,
                        zIndex: 10 - abs,
                        borderColor: isActive ? ACCENT : "#e5e7eb",
                      }}
                    >
                      {/* Dynamic member image */}
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={name}
                          width={300}
                          height={300}
                          unoptimized
                          className={`h-40 w-full object-cover object-top transition ${
                            isActive ? "" : "grayscale"
                          }`}
                        />
                      ) : (
                        <div className="h-40 w-full bg-gray-100" />
                      )}

                      <div className="space-y-1 px-3 py-3 text-left">
                        {department && (
                          <p className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-widest text-gray-500">
                            {isActive && (
                              <span
                                className="h-0.5 w-3 shrink-0"
                                style={{
                                  backgroundColor: ACCENT,
                                }}
                              />
                            )}
                            {department}
                          </p>
                        )}

                        {name && (
                          <h3 className="text-sm font-bold leading-tight text-gray-900">
                            {name}
                          </h3>
                        )}

                        {role && (
                          <p className="text-xs text-gray-600">{role}</p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Navigation controls */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => go(active - 1)}
                  aria-label="Previous team member"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-gray-300 bg-white text-gray-800 transition hover:border-gray-500"
                >
                  <HiChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2.5">
                  {members.map((member, index) => (
                    <button
                      key={member._id}
                      type="button"
                      onClick={() => go(index)}
                      aria-label={`Show ${getText(member.name, lang)}`}
                      aria-current={index === active}
                      className={`h-1.5 rounded-full transition-all ${
                        index === active ? "w-5" : "w-1.5 bg-gray-300"
                      }`}
                      style={
                        index === active
                          ? { backgroundColor: ACCENT }
                          : undefined
                      }
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => go(active + 1)}
                  aria-label="Next team member"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-gray-300 bg-white text-gray-800 transition hover:border-gray-500"
                >
                  <HiChevronRight className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};

export default Team;
