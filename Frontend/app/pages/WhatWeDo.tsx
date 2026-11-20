"use client";

import { useState, useSyncExternalStore } from "react";
import type { IconType } from "react-icons";

import {
  FiBookOpen,
  FiBriefcase,
  FiChevronRight,
  FiPercent,
  FiRefreshCw,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";

import Title from "../components/Title";
import { useGetWhatWeDoQuery } from "../store/api/whatWeDoApi";

type Lang = "en" | "ar";

type Localized = {
  en: string;
  ar: string;
};

type Media = {
  url: string;
  publicId?: string;
};

type LocalizedMedia = {
  en: Media[];
  ar: Media[];
};

interface WhatWeDoSection {
  _id: string;
  title: Localized;
  colorTitle: Localized;
  subtitle: Localized;
  watermark: Localized;
}

interface WhatWeDoService {
  _id: string;
  name: Localized;
  desc: Localized;
  icon: string;
  items: Localized[];
  image: LocalizedMedia;
  order: number;
}

interface WhatWeDoData {
  section: WhatWeDoSection | null;
  services: WhatWeDoService[];
}

// Existing decorative section background.
// The current What We Do API does not have a background field.
const BG_IMAGE = "/img/banner/bg2.avif";

const WAVE_LTR =
  "M0.12,0 C0,0.25 0.22,0.45 0.08,0.7 C0.02,0.85 0.1,0.95 0.05,1";

const WAVE_RTL =
  "M0.88,0 C1,0.25 0.78,0.45 0.92,0.7 C0.98,0.85 0.9,0.95 0.95,1";

const ICONS: Record<string, IconType> = {
  shield: FiShield,
  percent: FiPercent,
  briefcase: FiBriefcase,
  trending: FiTrendingUp,
  book: FiBookOpen,
};

// Icon fallback only, not content fallback.
const Ico = ({ name, className }: { name: string; className?: string }) => {
  const Icon = ICONS[name] ?? FiBriefcase;

  return <Icon className={className} />;
};

// Language synchronization with existing LanguageToggle.tsx
const getLanguage = (): Lang => {
  if (typeof document === "undefined") {
    return "en";
  }

  return document.documentElement.lang === "ar" ? "ar" : "en";
};

const subscribeLanguage = (callback: () => void) => {
  window.addEventListener("languagechange", callback);

  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("languagechange", callback);

    window.removeEventListener("storage", callback);
  };
};

const useLanguage = (): Lang =>
  useSyncExternalStore(subscribeLanguage, getLanguage, () => "en");

const localized = (value: Localized | undefined, lang: Lang): string =>
  value?.[lang] ?? "";

const getImage = (
  image: LocalizedMedia | undefined,
  lang: Lang,
): string | undefined =>
  image?.[lang]?.find((media) => Boolean(media?.url))?.url;

// Loading skeleton matching existing layout
const WhatWeDoSkeleton = () => {
  return (
    <div className="animate-pulse" role="status" aria-label="Loading services">
      {/* Heading skeleton */}
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
        <div className="h-10 w-64 rounded-lg bg-white/15 sm:w-96" />

        <div className="h-4 w-72 max-w-full rounded bg-white/10" />

        <div className="h-4 w-52 rounded bg-white/10" />
      </div>

      {/* Tabs and panel skeleton */}
      <div className="mx-auto mt-10 grid max-w-6xl gap-4 lg:grid-cols-[230px_1fr]">
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-black/60 px-3"
            >
              <div className="h-5 w-5 rounded bg-white/15" />

              <div className="h-4 flex-1 rounded bg-white/15" />
            </div>
          ))}
        </div>

        <div className="relative min-h-80 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]">
          <div className="absolute inset-y-0 end-0 hidden w-2/5 bg-white/10 md:block" />

          <div className="relative p-6 md:w-[65%]">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/15" />

              <div className="h-5 w-40 rounded bg-white/15" />
            </div>

            <div className="ms-2 mt-2 h-0.5 w-8 bg-[#fab923]/30" />

            <div className="mt-5 space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-10 rounded-md border border-white/5 bg-white/10"
                />
              ))}
            </div>

            <div className="mt-5 h-3 w-full rounded bg-white/10" />

            <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

const WhatWeDo = () => {
  const lang = useLanguage();
  const isRtl = lang === "ar";

  const [activeId, setActiveId] = useState<string | null>(null);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetWhatWeDoQuery();

  // The existing API hook types its response as ContentRecord.
  // The backend returns { section, services } inside data.
  const content = data as WhatWeDoData | undefined;

  const section = content?.section;

  const services = Array.isArray(content?.services)
    ? [...content.services].sort((a, b) => a.order - b.order)
    : [];

  // Preserve selected tab when data refetches.
  // If the selected service was deleted, show the first available.
  const current =
    services.find((service) => service._id === activeId) ?? services[0];

  const wave = isRtl ? WAVE_RTL : WAVE_LTR;

  const waveClip = isRtl ? `${wave} L0,1 L0,0 Z` : `${wave} L1,1 L1,0 Z`;

  const waveId = isRtl ? "wwd-wave-rtl" : "wwd-wave";

  const name = localized(current?.name, lang);
  const description = localized(current?.desc, lang);

  const items = current?.items ?? [];

  // No static image fallback.
  const imageUrl = "/img/banner/1.jpg";
  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      lang={lang}
      aria-busy={isFetching}
      className="relative -mt-10 bg-[#111] pb-28 pt-28 text-white [clip-path:url(#wwd-top)] lg:-mt-20 lg:pt-32"
    >
      {/* Original clipping paths */}
      <svg
        width="0"
        height="0"
        className="absolute hidden md:block"
        aria-hidden="true"
      >
        <clipPath id="wwd-top" clipPathUnits="objectBoundingBox">
          <path d="M0,0.12 Q0.5,-0.1 1,0.12 L1,1 L0,1 Z" />
        </clipPath>

        <clipPath id={waveId} clipPathUnits="objectBoundingBox">
          <path d={waveClip} />
        </clipPath>
      </svg>

      {/* Existing decorative background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BG_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/75" />

      <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-10">
        {isLoading ? (
          <WhatWeDoSkeleton />
        ) : isError && !data ? (
          // API error
          <div
            role="alert"
            className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-black/60 px-6 py-16 text-center"
          >
            <p className="text-sm text-red-400">
              {isRtl ? "تعذر تحميل الخدمات." : "Unable to load services."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-[#00852B] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#006d23]"
            >
              <FiRefreshCw />

              {isRtl ? "إعادة المحاولة" : "Try Again"}
            </button>
          </div>
        ) : !section || services.length === 0 ? (
          // No hardcoded service fallback
          <div
            role="status"
            className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-black/60 px-6 py-16 text-center"
          >
            <p className="text-sm text-white/70">
              {isRtl
                ? "لا توجد خدمات متاحة حالياً."
                : "No services are currently available."}
            </p>
          </div>
        ) : (
          <>
            {/* Dynamic heading from API */}
            <Title
              title={localized(section.title, lang)}
              colorTitle={localized(section.colorTitle, lang)}
              subtitle={localized(section.subtitle, lang)}
              watermark={localized(section.watermark, lang)}
              titleClassName="text-white"
              colorTitleClassName="text-green-500"
              subtitleClassName="text-white/70"
              watermarkClassName="text-white/[0.06]"
            />

            <div className="mx-auto mt-10 grid max-w-6xl gap-4 lg:grid-cols-[230px_1fr]">
              {/* Dynamic service tabs */}
              <div className="space-y-2">
                {services.map((service) => {
                  const selected = service._id === current._id;

                  return (
                    <button
                      key={service._id}
                      type="button"
                      onClick={() => setActiveId(service._id)}
                      aria-pressed={selected}
                      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-start text-md font-medium transition-colors ${
                        selected
                          ? "border-transparent bg-[#00852B] text-white"
                          : "border-white/10 bg-black/60 hover:border-[#fab923]/50"
                      }`}
                    >
                      <Ico name={service.icon} className="shrink-0 text-base" />

                      <span className="flex-1">
                        {localized(service.name, lang)}
                      </span>

                      <FiChevronRight
                        className={`shrink-0 ${isRtl ? "rotate-180" : ""}`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic active service panel */}
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]">
                {/* Image at inline-end edge */}
                {imageUrl && (
                  <div className="absolute inset-y-0 inset-e-0 hidden w-2/5 md:block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      key={`${current._id}-${lang}-${imageUrl}`}
                      src={imageUrl}
                      alt={name}
                      onError={(event) => {
                        event.currentTarget.hidden = true;
                      }}
                      className={`h-full w-full object-cover ${
                        isRtl
                          ? "[clip-path:url(#wwd-wave-rtl)]"
                          : "[clip-path:url(#wwd-wave)]"
                      }`}
                    />

                    {/* Original wave outline */}
                    <svg
                      viewBox="0 0 1 1"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 h-full w-full"
                    >
                      <path
                        d={wave}
                        fill="none"
                        stroke="#fab923"
                        strokeWidth="1.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                )}

                <div className="relative p-6 md:w-[65%]">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#fab923]/60 text-[#fab923]">
                      <Ico name={current.icon} />
                    </span>

                    <h3 className="text-base font-bold">{name}</h3>
                  </div>

                  <span className="ms-2 mt-2 block h-0.5 w-8 bg-[#fab923]" />

                  {/* Dynamic service items */}
                  <ul className="mt-5 space-y-2">
                    {items.map((item, index) => (
                      <li
                        key={`${current._id}-${index}`}
                        className="flex items-center gap-3 rounded-md border border-white/5 bg-white/5 px-3 py-2 text-md font-medium"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#fab923]" />

                        {localized(item, lang)}
                      </li>
                    ))}
                  </ul>

                  {/* Dynamic description */}
                  <p
                    className={`mt-4 text-xs text-white/70 ${
                      isRtl ? "leading-6" : "leading-5"
                    }`}
                  >
                    {description}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default WhatWeDo;
