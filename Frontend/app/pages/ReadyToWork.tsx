"use client";

import React, { useSyncExternalStore } from "react";
import {
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineUsers,
} from "react-icons/hi2";
import { useRouter } from "next/navigation";

import ThemeBtn from "../components/ThemeBtn";
import RippleBg from "../about/components/RippleBg";
import { useGetReadyToWorkQuery } from "../store/api/readyToWorkApi";

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

interface ReadyToWorkSection {
  _id?: string;
  title: Localized;
  highlight: Localized;
  description: Localized;
  buttonLabel: Localized;
  buttonHref: string;
  tagOne: Localized;
  tagTwo: Localized;
  bgImage: {
    en: Media[];
    ar: Media[];
  };
}

type FeatureIcon = "users" | "shield" | "chart" | "clock";

interface ReadyToWorkFeature {
  _id: string;
  icon: FeatureIcon;
  label: Localized;
  order: number;
}

interface ReadyToWorkResponse {
  section: ReadyToWorkSection | null;
  features: ReadyToWorkFeature[];
}

/* ----------------------------- Constants ----------------------------- */

const TOP_FILL = "#ffffff";
const BOTTOM_FILL = "#ffffff";

const ICON_MAP = {
  users: HiOutlineUsers,
  shield: HiOutlineShieldCheck,
  chart: HiOutlineChartBar,
  clock: HiOutlineClock,
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

const localizedText = (value: Localized | undefined, lang: Lang): string =>
  value?.[lang] ?? "";

const getBackgroundImage = (
  section: ReadyToWorkSection | null,
  lang: Lang,
): string | undefined => section?.bgImage?.[lang]?.[0]?.url;

/* ----------------------------- Skeleton ----------------------------- */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-white/15 ${className}`}
  />
);

const ReadyToWorkSkeleton = () => (
  <div
    className="mx-auto flex max-w-332 flex-col items-center px-4 sm:px-6"
    role="status"
    aria-label="Loading section"
  >
    <div className="relative w-full max-w-3xl rounded-2xl border border-[#00852B]/70 bg-black/45 px-8 pb-8 pt-12 backdrop-blur-md">
      <Skeleton className="mx-auto mb-6 h-px w-8" />

      <Skeleton className="mx-auto mb-3 h-9 w-2/3" />
      <Skeleton className="mx-auto h-9 w-1/2" />

      <div className="mt-7 space-y-3">
        <Skeleton className="mx-auto h-3 w-full" />
        <Skeleton className="mx-auto h-3 w-11/12" />
        <Skeleton className="mx-auto h-3 w-3/4" />
      </div>

      <Skeleton className="mx-auto mt-7 h-11 w-44 rounded-lg" />

      <div className="mt-5 flex items-center justify-center gap-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>

    <div className="mt-14 grid w-full max-w-157.5 grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="flex flex-col items-center rounded-xl border border-[#00852B]/50 bg-black/50 px-2 py-5 backdrop-blur-md"
        >
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="mt-3 h-3 w-20" />
          <Skeleton className="mt-2 h-3 w-16" />
        </div>
      ))}
    </div>

    <span className="sr-only">Loading...</span>
  </div>
);

/* ----------------------------- Component ----------------------------- */

const ReadyToWork = () => {
  const router = useRouter();
  const lang = useLanguage();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetReadyToWorkQuery();

  const content = data as ReadyToWorkResponse | undefined;

  const section = content?.section ?? null;

  const features = content?.features ?? [];

  const sortedFeatures = [...features].sort((a, b) => a.order - b.order);

  const backgroundImage = getBackgroundImage(section, lang);

  const showSkeleton =
    isLoading || (!section && !isError) || (isFetching && !content);

  const handleConsultation = () => {
    if (!section?.buttonHref) return;

    const href = section.buttonHref;

    if (/^https?:\/\//i.test(href)) {
      window.location.assign(href);
      return;
    }

    router.push(href.startsWith("/") ? href : `/${href}`);
  };

  return (
    <section
      className="relative isolate -mt-px bg-black py-24 text-white lg:py-32"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Dynamic background image */}
      {backgroundImage && <RippleBg src={backgroundImage} />}

      {/* Background gradients */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#000_0%,transparent_30%,transparent_70%,#000_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-linear-to-b from-black/50 via-black/20 to-black/70"
      />

      {/* Top curve */}
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
          stroke="#00852B"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Main content */}
      {showSkeleton ? (
        <ReadyToWorkSkeleton />
      ) : isError ? (
        <div className="mx-auto flex min-h-75 flex-col items-center justify-center px-4 text-center">
          <p className="mb-4 text-sm text-white/80">
            {lang === "ar"
              ? "تعذر تحميل المحتوى."
              : "Unable to load this section."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-[#00852B] px-5 py-2 text-sm font-semibold text-white"
          >
            {lang === "ar" ? "إعادة المحاولة" : "Try Again"}
          </button>
        </div>
      ) : section ? (
        <div className="mx-auto flex max-w-332 flex-col items-center px-4 sm:px-6">
          {/* Main card */}
          <div className="relative w-full max-w-3xl rounded-2xl border border-[#00852B]/70 bg-black/45 px-8 pb-8 pt-12 text-center backdrop-blur-md">
            <span className="absolute left-1/2 top-7 h-px w-8 -translate-x-1/2 bg-white/50" />

            <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
              {localizedText(section.title, lang)}
              <br />
              {localizedText(section.highlight, lang)}
            </h2>

            <p className="mt-5 text-sm leading-6 text-white/85">
              {localizedText(section.description, lang)}
            </p>

            <ThemeBtn className="mt-3" onClick={handleConsultation}>
              {localizedText(section.buttonLabel, lang)}
            </ThemeBtn>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="h-px w-9 bg-[#00852B]" />

              <span>{localizedText(section.tagOne, lang)}</span>

              <span>{localizedText(section.tagTwo, lang)}</span>

              <span className="h-px w-9 bg-[#00852B]" />
            </div>
          </div>

          {/* Dynamic feature tiles */}
          {sortedFeatures.length > 0 && (
            <div className="mt-14 grid w-full max-w-157.5 grid-cols-2 gap-3 sm:grid-cols-4">
              {sortedFeatures.map((feature) => {
                const Icon = ICON_MAP[feature.icon] ?? HiOutlineUsers;

                return (
                  <div
                    key={feature._id}
                    className="flex flex-col items-center rounded-xl border border-[#00852B]/50 bg-black/50 px-2 py-5 text-center backdrop-blur-md"
                  >
                    <Icon
                      className="h-6 w-6 text-[#3ddc6e]"
                      aria-hidden="true"
                    />

                    <p className="mt-2 text-xs font-semibold leading-4">
                      {localizedText(feature.label, lang)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <ReadyToWorkSkeleton />
      )}

      {/* Bottom curve */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-10 w-full overflow-visible lg:h-14"
      >
        <path d="M0 60H1440V0Q720 120 0 0Z" fill={BOTTOM_FILL} />
        <path
          d="M0 0Q720 120 1440 0"
          fill="none"
          stroke="#00852B"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </section>
  );
};

export default ReadyToWork;
