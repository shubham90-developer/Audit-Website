"use client";

import Image from "next/image";
import { Mrs_Saint_Delafield } from "next/font/google";
import React, { useSyncExternalStore } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useGetMeetTheTeamQuery } from "../store/api/meetTheTeamApi";

const script = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400" });

type Lang = "en" | "ar";
type Localized = { en: string; ar: string };
type Media = { url: string; publicId?: string };
type MeetTheTeamContent = {
  leftTitle?: Localized;
  scriptTitle?: Localized;
  watermark?: Localized;
  image?: { en?: Media[]; ar?: Media[] };
};

const MARQUEE_SECONDS = 60;
const VIDEO_SRC = "/img/banner/1.mp4";
const VIDEO_POSTER = "/img/banner/11.avif";
const BACKGROUND_IMAGE = "/img/banner/bg1.avif";
const TOP_FILL = "#ffffff";

const getLanguage = (): Lang =>
  typeof document !== "undefined" &&
  document.documentElement.lang.toLowerCase().startsWith("ar")
    ? "ar"
    : "en";

const subscribeLanguage = (notify: () => void) => {
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });
  window.addEventListener("site-language-change", notify);
  window.addEventListener("languagechange", notify);
  return () => {
    observer.disconnect();
    window.removeEventListener("site-language-change", notify);
    window.removeEventListener("languagechange", notify);
  };
};

const useLanguage = (): Lang =>
  useSyncExternalStore(subscribeLanguage, getLanguage, () => "en");

const localized = (value: Localized | undefined, lang: Lang) =>
  value?.[lang] ?? "";

const IntroVideoSkeleton = () => (
  <section
    className="relative isolate bg-white py-28 lg:py-40"
    role="status"
    aria-label="Loading Meet the Team"
  >
    <div className="mx-auto grid max-w-332 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_640px_1fr] xl:px-0">
      <div className="h-20 animate-pulse rounded bg-gray-200" />
      <div className="aspect-video animate-pulse rounded-3xl bg-gray-200" />
      <div className="h-32 animate-pulse rounded bg-gray-200" />
    </div>
  </section>
);

const IntroVideo = () => {
  const lang = useLanguage();
  const isArabic = lang === "ar";
  const { data, isLoading, isError, refetch } = useGetMeetTheTeamQuery();

  if (isLoading) return <IntroVideoSkeleton />;

  if (isError && !data) {
    return (
      <section
        className="flex min-h-72 flex-col items-center justify-center gap-4 bg-white px-4 text-center"
        dir={isArabic ? "rtl" : "ltr"}
      >
        <p className="text-sm text-red-600">
          {isArabic
            ? "تعذر تحميل محتوى القسم."
            : "Unable to load Meet the Team content."}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-full bg-[#00852B] px-6 py-2 text-sm font-semibold text-white hover:bg-[#006d23]"
        >
          <FiRefreshCw />
          {isArabic ? "إعادة المحاولة" : "Try Again"}
        </button>
      </section>
    );
  }

  // The RTK Query endpoint already transforms response.data.
  const content = data as MeetTheTeamContent | undefined;
  if (!content) {
    return (
      <section className="bg-white px-4 py-16 text-center text-gray-600">
        {isArabic
          ? "لا توجد بيانات متاحة حالياً."
          : "No Meet the Team content is currently available."}
      </section>
    );
  }

  const leftTitle = localized(content.leftTitle, lang);
  const scriptTitle = localized(content.scriptTitle, lang);
  const marqueeText = localized(content.watermark, lang);
  const mediaUrl = content.image?.[lang]?.[0]?.url;
  const isVideo = Boolean(
    mediaUrl &&
    (mediaUrl.includes("/video/upload/") ||
      /\.(mp4|webm|mov)(?:[?#]|$)/i.test(mediaUrl)),
  );

  return (
    <section
      dir={isArabic ? "rtl" : "ltr"}
      lang={lang}
      className="relative isolate bg-white py-28 lg:py-40"
    >
      <Image
        src={BACKGROUND_IMAGE}
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-linear-to-b from-white via-white/60 to-white"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-[#00852B]/20 via-[#00852B]/5 to-transparent"
      />

      {marqueeText && (
        <div
          dir="ltr"
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 overflow-hidden"
        >
          <div
            style={{ animationDuration: `${MARQUEE_SECONDS}s` }}
            className="flex w-max animate-[slide_linear_infinite] whitespace-nowrap text-[180px] font-black leading-none text-black/4 motion-reduce:animate-none"
          >
            <span dir={isArabic ? "rtl" : "ltr"}>
              {`${marqueeText} • `.repeat(4)}
            </span>
            <span dir={isArabic ? "rtl" : "ltr"}>
              {`${marqueeText} • `.repeat(4)}
            </span>
          </div>
        </div>
      )}
      <style>{`@keyframes slide{to{transform:translateX(-50%)}}`}</style>

      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-10 w-full lg:h-14"
      >
        <path d="M0 0H1440V0Q720 120 0 0Z" fill={TOP_FILL} />
        <path
          d="M0 0Q720 120 1440 0"
          fill="none"
          stroke="#00852B"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="mx-auto grid max-w-332 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_640px_1fr] xl:px-0">
        <div
          className={`text-center ${isArabic ? "lg:text-right" : "lg:text-left"}`}
        >
          <h2 className="font-serif text-3xl leading-snug text-[#111]">
            {leftTitle}
          </h2>
          <span className="mx-auto mt-4 block h-0.5 w-18 bg-[#00852B] lg:mx-0" />
        </div>

        <div className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-[0_30px_60px_-25px_rgba(0,0,0,0.5)]">
          {mediaUrl && !isVideo ? (
            <Image
              src={mediaUrl}
              alt={leftTitle}
              fill
              unoptimized
              sizes="(min-width: 1024px) 640px, 100vw"
              className="object-cover"
            />
          ) : (
            <video
              key={isVideo ? mediaUrl : VIDEO_SRC}
              src={isVideo ? mediaUrl : VIDEO_SRC}
              poster={VIDEO_POSTER}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div
          className={`text-center ${isArabic ? "lg:text-right" : "lg:text-left"}`}
        >
          <p
            className={`${isArabic ? "" : script.className} -rotate-6 text-5xl leading-[0.95] text-[#111] sm:text-6xl`}
          >
            {scriptTitle}
          </p>
          <span className="mx-auto mt-5 block h-0.5 w-16 bg-[#00852B] lg:mx-0" />
        </div>
      </div>
    </section>
  );
};

export default IntroVideo;
