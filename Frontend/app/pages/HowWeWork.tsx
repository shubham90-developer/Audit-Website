"use client";

import Image from "next/image";
import React, { useSyncExternalStore } from "react";
import type { IconType } from "react-icons";
import {
  FiFileText,
  FiHeadphones,
  FiSettings,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import Title from "../components/Title";
import { useGetHowWeWorkQuery } from "../store/api/howWeWorkApi";

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

interface HowWeWorkSection {
  title: Localized;
  colorTitle: Localized;
  subtitle: Localized;
  watermark: Localized;
  backgroundImage?: LocalizedMedia;
  image?: LocalizedMedia;
}

interface HowWeWorkStep {
  _id: string;
  title: Localized;
  desc: Localized;
  icon?: string;
  order: number;
}

interface HowWeWorkData {
  section: HowWeWorkSection | null;
  steps: HowWeWorkStep[];
}

type ApiResponse =
  | HowWeWorkData
  | {
      status: string;
      data: HowWeWorkData;
    };

/* ----------------------------- Language ----------------------------- */

const getLanguage = (): Lang => {
  if (typeof document === "undefined") return "en";

  return document.documentElement.lang.toLowerCase().startsWith("ar")
    ? "ar"
    : "en";
};

const subscribeLanguage = (callback: () => void) => {
  const observer = new MutationObserver(callback);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  window.addEventListener("languagechange", callback);
  window.addEventListener("site-language-change", callback);
  window.addEventListener("storage", callback);

  return () => {
    observer.disconnect();
    window.removeEventListener("languagechange", callback);
    window.removeEventListener("site-language-change", callback);
    window.removeEventListener("storage", callback);
  };
};

const useLanguage = (): Lang =>
  useSyncExternalStore(subscribeLanguage, getLanguage, () => "en");

const localized = (value: Localized | undefined, lang: Lang): string =>
  value?.[lang] ?? "";

const mediaUrl = (
  media: LocalizedMedia | undefined,
  lang: Lang,
): string | undefined => media?.[lang]?.find((item) => item?.url)?.url;

/* ----------------------------- Icons ----------------------------- */

const ICON_MAP: Record<string, IconType> = {
  headset: FiHeadphones,
  headphones: FiHeadphones,
  "fi-headphones": FiHeadphones,
  fiheadphones: FiHeadphones,
  document: FiFileText,
  file: FiFileText,
  "file-text": FiFileText,
  "fi-file-text": FiFileText,
  fifiletext: FiFileText,
  settings: FiSettings,
  "fi-settings": FiSettings,
  fisettings: FiSettings,
  shield: FiShield,
  "fi-shield": FiShield,
  fishield: FiShield,
};

const ICON_COLORS: Record<string, string> = {
  sky: "text-sky-400",
  blue: "text-sky-400",
  white: "text-white",
  gold: "text-[#fab923]",
  yellow: "text-[#fab923]",
  green: "text-[#3ddc6e]",
};

const DEFAULT_ICONS: IconType[] = [
  FiHeadphones,
  FiFileText,
  FiSettings,
  FiShield,
];

const DEFAULT_COLORS = [
  "text-sky-400",
  "text-white",
  "text-[#fab923]",
  "text-[#3ddc6e]",
];

const resolveIcon = (name: string | undefined, index: number): IconType =>
  ICON_MAP[name?.toLowerCase() ?? ""] ??
  DEFAULT_ICONS[index % DEFAULT_ICONS.length];

const resolveColor = (color: string | undefined, index: number): string =>
  ICON_COLORS[color?.toLowerCase() ?? ""] ??
  DEFAULT_COLORS[index % DEFAULT_COLORS.length];

/* ----------------------------- Skeleton ----------------------------- */

const HowWeWorkSkeleton = () => (
  <section
    className="relative isolate bg-[#F4F8F5] px-4 py-16 sm:px-6 lg:py-20"
    role="status"
    aria-label="Loading how we work"
  >
    <div className="mx-auto flex max-w-249 flex-col items-center gap-4">
      <div className="h-10 w-64 animate-pulse rounded bg-black/10" />
      <div className="h-5 w-48 animate-pulse rounded bg-black/10" />
    </div>

    <div className="mx-auto mt-8 grid max-w-249 overflow-hidden rounded-2xl bg-[#0a0a0c] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] lg:grid-cols-[1fr_2fr]">
      <div className="h-80 animate-pulse bg-white/10 lg:h-auto" />

      <div className="space-y-10 px-6 py-10 sm:px-8 lg:pl-6 lg:pr-14">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-white/15" />

            <div className="flex-1 space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-white/15" />
              <div className="h-5 w-40 animate-pulse rounded bg-white/15" />
              <div className="h-3 w-full animate-pulse rounded bg-white/15" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ----------------------------- Component ----------------------------- */

const HowWeWork = () => {
  const lang = useLanguage();
  const isArabic = lang === "ar";

  const { data, isLoading, isError, refetch } = useGetHowWeWorkQuery();

  if (isLoading) {
    return <HowWeWorkSkeleton />;
  }

  if (isError && !data) {
    return (
      <section
        dir={isArabic ? "rtl" : "ltr"}
        className="flex min-h-72 flex-col items-center justify-center gap-4 bg-[#F4F8F5] px-4 text-center"
      >
        <p className="text-sm text-red-600">
          {isArabic
            ? "تعذر تحميل البيانات."
            : "Unable to load How We Work information."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-full bg-[#00852B] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#006d23]"
        >
          <FiRefreshCw />
          {isArabic ? "إعادة المحاولة" : "Try Again"}
        </button>
      </section>
    );
  }

  const response = data as ApiResponse | undefined;

  const content = response && "data" in response ? response.data : response;

  const section = content?.section;

  const steps = Array.isArray(content?.steps)
    ? [...content.steps].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  if (!section) {
    return (
      <section
        dir={isArabic ? "rtl" : "ltr"}
        className="bg-[#F4F8F5] px-4 py-16 text-center text-sm text-gray-600"
      >
        {isArabic
          ? "لا توجد بيانات متاحة حالياً."
          : "No information is currently available."}
      </section>
    );
  }

  const backgroundImage = mediaUrl(section.backgroundImage, lang);

  const cardImage = mediaUrl(section.image, lang);

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      lang={lang}
      className="relative isolate bg-[#F4F8F5] px-4 py-16 sm:px-6 lg:py-20"
    >
      {/* Dynamic background image */}
      {
        <Image
          src={backgroundImage || "/img/banner/bg5.avif"}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="-z-20 object-cover"
        />
      }

      {/* White gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-white via-white/60 to-white"
      />

      {/* Dynamic heading */}
      <Title
        title={localized(section.title, lang)}
        colorTitle={localized(section.colorTitle, lang)}
        subtitle={localized(section.subtitle, lang)}
        watermark={localized(section.watermark, lang)}
      />

      {/* Card */}
      <div className="mx-auto mt-8 grid max-w-249 overflow-hidden rounded-2xl bg-[#0a0a0c] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] lg:grid-cols-[1fr_2fr]">
        {/* Dynamic card image */}
        <div
          className={`relative h-80 border-[#fab923]/60 lg:h-auto ${
            isArabic ? "lg:border-l" : "lg:border-r"
          }`}
        >
          {cardImage && (
            <Image
              src={cardImage}
              alt={localized(section.title, lang) || "How We Work"}
              fill
              unoptimized
              sizes="(min-width: 1024px) 332px, 100vw"
              className="object-cover"
            />
          )}
        </div>

        {/* Dynamic steps */}
        <ol
          className={`px-6 py-10 sm:px-8 ${
            isArabic ? "lg:pr-6 lg:pl-14" : "lg:pl-6 lg:pr-14"
          }`}
        >
          {steps.map((step, i) => {
            const Icon = resolveIcon(step.icon, i);
            const color = resolveColor(undefined, i);

            return (
              <li
                key={step._id}
                className="relative flex gap-4 pb-10 last:pb-0"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1 top-12 w-px bg-white/20 ${
                      isArabic ? "right-5.25" : "left-5.25"
                    }`}
                  />
                )}

                {/* Icon */}
                <span
                  className={`relative z-10 grid h-11 w-11 flex-none place-items-center rounded-full border bg-[#14100a] ${
                    i === 1
                      ? "border-[#fab923] shadow-[0_0_16px_-2px_#fab923]"
                      : "border-white/20"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
                </span>

                {/* Text */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-[#3ddc6e]">
                    {isArabic ? `الخطوة ${i + 1}.` : `Step ${i + 1}.`}
                  </p>

                  <h3 className="text-sm font-semibold leading-5 text-white">
                    {localized(step.title, lang)}
                  </h3>

                  <p className="mt-0.5 text-xs leading-4.25 text-white/70">
                    {localized(step.desc, lang)}
                  </p>
                </div>
              </li>
            );
          })}

          {steps.length === 0 && (
            <li className="text-center text-sm text-white/60">
              {isArabic
                ? "لا توجد خطوات متاحة حالياً."
                : "No steps are currently available."}
            </li>
          )}
        </ol>
      </div>
    </section>
  );
};

export default HowWeWork;
