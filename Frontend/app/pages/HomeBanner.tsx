"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import ThemeBtn from "../components/ThemeBtn";
import { useGetBannersQuery } from "../store/api/bannerApi";
import { FaAward, FaGoogle, FaHandshake } from "react-icons/fa";
import { SiTrustpilot } from "react-icons/si";
import { BsShieldCheck } from "react-icons/bs";

type Lang = "en" | "ar";

type Localized = {
  en?: string;
  ar?: string;
};

type MediaItem = {
  url?: string;
  publicId?: string;
};

type LocalizedMedia = {
  en?: MediaItem[];
  ar?: MediaItem[];
};

type BannerRecord = {
  titleHighlight?: Localized;
  titleRest?: Localized;
  intro?: Localized;
  speakLabel?: Localized;
  trustedNote?: Localized;

  primaryCta?: {
    label?: Localized;
    href?: Localized;
  };

  secondaryCta?: {
    label?: Localized;
    href?: Localized;
  };

  ftaCard?: {
    line1?: Localized;
    line2?: Localized;
    licenseNumber?: Localized;
  };

  partnerCard?: {
    title?: Localized;
    subtitle?: Localized;
  };

  experienceCard?: {
    value?: Localized;
    label?: Localized;
    tagline?: Localized;
  };

  reviewRatings?: {
    platform?: string;
    score?: number;
    label?: Localized;
  }[];

  bgImages?: LocalizedMedia;
  bgVideos?: LocalizedMedia;
  posterImage?: LocalizedMedia;
};

const WAVE_LTR = "M0.22,0 C0.12,0.12 0,0.25 0,0.38 C0,0.6 0.12,0.8 0,1";

const WAVE_RTL = "M0.78,0 C0.88,0.12 1,0.25 1,0.38 C1,0.6 0.88,0.8 1,1";

// Explicit Lang return type fixes the TypeScript error.
const getLanguage = (): Lang => {
  if (typeof document === "undefined") return "en";

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
  useSyncExternalStore(subscribeLanguage, getLanguage, (): Lang => "en");

const localized = (field: Localized | undefined, lang: Lang): string =>
  field?.[lang] ?? "";

const mediaUrl = (
  field: LocalizedMedia | undefined,
  lang: Lang,
): string | undefined => field?.[lang]?.find((item) => Boolean(item?.url))?.url;

const TrustCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-[#00852B] bg-white/10 px-2 py-3 text-center text-xs text-white shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#00A63C] hover:shadow-md sm:min-h-36 sm:px-3 sm:py-4 lg:bg-[#111]/80">
    {children}
  </div>
);

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 flex h-9 items-center justify-center text-4xl text-[#fab923] sm:mb-3 sm:h-14 sm:text-5xl">
    {children}
  </div>
);

const Review = ({
  icon,
  label,
  score,
}: {
  icon: React.ReactNode;
  label: string;
  score?: number;
}) => (
  <div className="flex w-full items-center justify-center gap-1.5 sm:gap-2">
    {icon}

    <div className="text-start">
      <div className="flex items-center gap-1">
        <span className="text-base font-bold sm:text-lg">{score ?? "—"}</span>

        <span className="text-xs tracking-tight text-[#FBBF24] sm:text-sm">
          ★★★★★
        </span>
      </div>

      <p className="text-[9px] leading-3.5 text-white/70 sm:text-[10px] sm:leading-4">
        {label}
      </p>
    </div>
  </div>
);

const BannerSkeleton = () => (
  <section
    className="relative overflow-hidden bg-[#111] text-white"
    aria-busy="true"
    aria-label="Loading banner"
  >
    <div className="mx-auto max-w-8xl px-4 pb-24 pt-12 sm:px-8 md:pb-28 lg:px-10 lg:pt-20">
      <div className="animate-pulse lg:w-[55%]">
        <div className="mb-4 h-12 w-4/5 rounded-lg bg-white/10" />
        <div className="mb-6 h-12 w-3/5 rounded-lg bg-white/10" />

        <div className="my-5 h-1 w-20 rounded-full bg-white/10" />

        <div className="mb-3 h-4 w-full rounded bg-white/10" />
        <div className="mb-3 h-4 w-11/12 rounded bg-white/10" />
        <div className="mb-6 h-4 w-3/4 rounded bg-white/10" />

        <div className="mt-6 flex gap-3">
          <div className="h-11 w-44 rounded-full bg-white/10" />
          <div className="h-11 w-44 rounded-full bg-white/10" />
        </div>

        <div className="mt-5 h-4 w-52 rounded bg-white/10" />

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex min-h-28 flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 sm:min-h-36"
            >
              <div className="h-10 w-10 rounded-full bg-white/10" />
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-4 w-1/2 rounded bg-white/10" />
            </div>
          ))}
        </div>

        <div className="mt-5 h-4 w-full rounded bg-white/10" />
      </div>
    </div>
  </section>
);

const HomeBanner = () => {
  const lang = useLanguage();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetBannersQuery();

  if (isLoading) {
    return <BannerSkeleton />;
  }

  if (isError && !data) {
    return (
      <section className="flex min-h-80 flex-col items-center justify-center gap-4 bg-[#111] px-4 text-center text-white">
        <p className="text-sm">
          {lang === "ar"
            ? "تعذر تحميل بيانات الصفحة الرئيسية"
            : "Unable to load homepage banner."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full bg-[#00852B] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00A63C]"
        >
          {lang === "ar" ? "إعادة المحاولة" : "Try Again"}
        </button>
      </section>
    );
  }

  const response: unknown = data;

  const banners: BannerRecord[] = Array.isArray(response)
    ? (response as BannerRecord[])
    : response &&
        typeof response === "object" &&
        "data" in response &&
        Array.isArray(response.data)
      ? (response.data as BannerRecord[])
      : [];

  const banner = banners[0];

  if (!banner) {
    return (
      <section className="flex min-h-72 items-center justify-center bg-[#111] px-4 text-center text-white">
        <p className="text-sm text-white/70">
          {lang === "ar"
            ? "لا توجد بيانات للبانر حالياً"
            : "No banner content is available."}
        </p>
      </section>
    );
  }

  const isRtl = lang === "ar";

  const wave = isRtl ? WAVE_RTL : WAVE_LTR;

  const clipPath = isRtl ? `${wave} L0,1 L0,0 Z` : `${wave} L1,1 L1,0 Z`;

  const clipId = isRtl ? "wave-clip-rtl" : "wave-clip";

  const backgroundImage = mediaUrl(banner.bgImages, lang);
  const backgroundVideo = mediaUrl(banner.bgVideos, lang);
  const posterImage = mediaUrl(banner.posterImage, lang);

  const googleReview = banner.reviewRatings?.find(
    (item) => item.platform === "google",
  );

  const trustpilotReview = banner.reviewRatings?.find(
    (item) => item.platform === "trustpilot",
  );

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      lang={lang}
      aria-busy={isFetching}
      className="relative bg-[#111] text-white"
    >
      {/* Text-side background image */}
      <div className="absolute inset-0 hidden lg:block">
        {backgroundImage && (
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className={`object-cover ${isRtl ? "object-right" : "object-left"}`}
          />
        )}

        <div
          className={`absolute inset-0 from-[#111]/95 via-[#111]/80 to-[#111]/40 ${
            isRtl ? "bg-linear-to-l" : "bg-linear-to-r"
          }`}
        />

        <div
          className={`absolute inset-0 from-[#00852B]/20 via-transparent to-transparent ${
            isRtl ? "bg-linear-to-l" : "bg-linear-to-r"
          }`}
        />
      </div>

      {/* Background video */}
      <div className="absolute inset-0 lg:inset-s-auto lg:w-1/2">
        <svg width="0" height="0" className="absolute">
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={clipPath} />
          </clipPath>
        </svg>

        {backgroundVideo && (
          <video
            key={`${lang}-${backgroundVideo}`}
            className={`h-full w-full object-cover ${
              isRtl
                ? "lg:[clip-path:url(#wave-clip-rtl)]"
                : "lg:[clip-path:url(#wave-clip)]"
            }`}
            src={backgroundVideo}
            poster={posterImage}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        )}

        <div
          className={`absolute inset-0 bg-[#111]/75 lg:bg-transparent lg:from-white/20 lg:via-transparent lg:to-transparent ${
            isRtl
              ? "lg:bg-linear-to-l lg:[clip-path:url(#wave-clip-rtl)]"
              : "lg:bg-linear-to-r lg:[clip-path:url(#wave-clip)]"
          }`}
        />

        <svg
          viewBox="0 0 1 1"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          <path
            d={wave}
            fill="none"
            stroke="#fab923"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Banner content */}
      <div className="relative z-10 mx-auto max-w-8xl px-4 pb-24 pt-12 sm:px-8 md:pb-28 lg:px-10 lg:pt-20">
        <div className="lg:w-[55%]">
          <h1
            className={`text-3xl font-extrabold sm:text-5xl ${
              isRtl ? "leading-snug sm:leading-snug" : "leading-tight"
            }`}
          >
            <span className="text-[#00852B]">
              {localized(banner.titleHighlight, lang)}
            </span>{" "}
            {localized(banner.titleRest, lang)}
          </h1>

          <div className="my-5 flex h-1 w-20 overflow-hidden rounded-full">
            <span className="w-2/3 bg-[#00852B]" />
            <span className="w-1/3 bg-[#F20D18]" />
          </div>

          <p className="max-w-lg text-sm leading-7">
            {localized(banner.intro, lang)}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {banner.primaryCta?.label?.[lang] && (
              <ThemeBtn>{localized(banner.primaryCta.label, lang)}</ThemeBtn>
            )}

            {banner.secondaryCta?.label?.[lang] && (
              <ThemeBtn>{localized(banner.secondaryCta.label, lang)}</ThemeBtn>
            )}
          </div>

          <p className="mt-3 text-xs font-medium">
            {localized(banner.speakLabel, lang)}
          </p>

          {/* Trust cards */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-4 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <TrustCard>
              <IconBox>
                <BsShieldCheck />
              </IconBox>

              <h3 className="text-xs font-bold leading-4 sm:min-h-11 sm:text-sm sm:leading-5">
                {localized(banner.ftaCard?.line1, lang)}
                <br />
                {localized(banner.ftaCard?.line2, lang)}
              </h3>

              <span className="mt-2 rounded-full bg-[#00852B] px-3 py-1 text-[10px] font-bold sm:mt-3 sm:px-5 sm:py-1.5 sm:text-xs">
                {localized(banner.ftaCard?.licenseNumber, lang)}
              </span>
            </TrustCard>

            <TrustCard>
              <IconBox>
                <FaHandshake />
              </IconBox>

              <h3 className="flex items-center text-xs font-bold leading-4 sm:min-h-11 sm:text-sm sm:leading-5">
                {localized(banner.partnerCard?.title, lang)}
              </h3>

              <p className="mt-2 text-[11px] leading-4 text-white/70 sm:mt-3 sm:text-xs sm:leading-5">
                {localized(banner.partnerCard?.subtitle, lang)}
              </p>
            </TrustCard>

            <TrustCard>
              <IconBox>
                <FaAward />
              </IconBox>

              <h3 className="text-2xl font-extrabold text-[#20C968] sm:text-3xl">
                {localized(banner.experienceCard?.value, lang)}
              </h3>

              <p className="mt-1 text-xs font-semibold sm:mt-2 sm:text-sm">
                {localized(banner.experienceCard?.label, lang)}
              </p>

              <p className="mt-1 text-[11px] font-bold text-[#F20D18] sm:mt-2 sm:text-xs">
                {localized(banner.experienceCard?.tagline, lang)}
              </p>
            </TrustCard>

            <TrustCard>
              <div className="flex w-full flex-col gap-2.5 sm:gap-4">
                <Review
                  icon={
                    <FaGoogle className="shrink-0 text-2xl text-[#4285F4] sm:text-3xl" />
                  }
                  label={localized(googleReview?.label, lang)}
                  score={googleReview?.score}
                />

                <div className="h-px w-full bg-white/15" />

                <Review
                  icon={
                    <SiTrustpilot className="shrink-0 text-2xl text-[#00B67A] sm:text-3xl" />
                  }
                  label={localized(trustpilotReview?.label, lang)}
                  score={trustpilotReview?.score}
                />
              </div>
            </TrustCard>
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs leading-6">
            <BsShieldCheck size={16} className="mt-1 shrink-0 text-[#fab923]" />

            {localized(banner.trustedNote, lang)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
