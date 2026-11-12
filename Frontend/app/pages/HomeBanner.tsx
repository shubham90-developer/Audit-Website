"use client";

import React from "react";
import Image from "next/image";
import ThemeBtn from "../components/ThemeBtn";
import { FaAward, FaGoogle, FaHandshake } from "react-icons/fa";
import { SiTrustpilot } from "react-icons/si";
import { BsShieldCheck } from "react-icons/bs";

type Lang = "en" | "ar";

const VIDEO_SRC = "/img/banner/1.mp4";
const POSTER_SRC = "/images/dubai-hero.jpg";
const LEFT_BG = "/img/banner/bg7.avif"; // text-side background image

// LTR wave (video on the right) and its mirror for RTL (video on the left)
const WAVE_LTR = "M0.22,0 C0.12,0.12 0,0.25 0,0.38 C0,0.6 0.12,0.8 0,1";
const WAVE_RTL = "M0.78,0 C0.88,0.12 1,0.25 1,0.38 C1,0.6 0.88,0.8 1,1";

const t = {
  en: {
    titleHighlight: "Expert Advice ",
    titleRest: "to Help You Grow",
    intro:
      "Independent audit, accounting and tax services for businesses across the UAE, from an Emirati firm with more than 25 years of experience.",
    ctaCall: "Book Free 20-Min Call",
    ctaTax: "Explore Tax Services",
    speak: "— Speak Directly with an Expert —",
    ftaLine1: "FTA Approved",
    ftaLine2: "Tax Agency",
    ftaNo: "No. 30008692",
    partner: "Business Setup Partner",
    partnerSub: "for Dubai Free Zones",
    years: "25+ YEARS",
    yearsSub: "of Experience",
    yearsCount: "You Can Count On",
    google: "from 200+ Google Reviews",
    trustpilot: "from 75+ Trustpilot Reviews",
    trusted:
      "Trusted by 1,000+ Businesses in the UAE and worldwide to stay compliant and find the best opportunities.",
  },
  ar: {
    titleHighlight: "نصائح الخبراء ",
    titleRest: "لمساعدتك على النمو",
    intro:
      "خدمات تدقيق ومحاسبة وضرائب مستقلة للشركات في جميع أنحاء الإمارات، من شركة إماراتية تتمتع بخبرة تزيد عن 25 عامًا.",
    ctaCall: "احجز مكالمة مجانية لمدة 20 دقيقة",
    ctaTax: "استكشف الخدمات الضريبية",
    speak: "— تحدّث مباشرة مع خبير —",
    ftaLine1: "وكالة ضريبية",
    ftaLine2: "معتمدة من الهيئة الاتحادية للضرائب",
    ftaNo: "رقم 30008692",
    partner: "شريك تأسيس الأعمال",
    partnerSub: "للمناطق الحرة في دبي",
    years: "+25 عامًا",
    yearsSub: "من الخبرة",
    yearsCount: "يمكنك الاعتماد عليها",
    google: "من أكثر من 200 تقييم على Google",
    trustpilot: "من أكثر من 75 تقييمًا على Trustpilot",
    trusted:
      "يثق بنا أكثر من 1,000 شركة في الإمارات وحول العالم للحفاظ على الامتثال واغتنام أفضل الفرص.",
  },
} as const;

// Compact on mobile, full size from sm up.
const TrustCard = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-[#00852B] bg-white/10 px-2 py-3 text-center text-xs text-white shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#00A63C] hover:shadow-md sm:min-h-36 sm:px-3 sm:py-4 lg:bg-[#111]/80">
    {children}
  </div>
);

// Icons inherit this font size (1em), so one class controls them all.
const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-2 flex h-9 items-center justify-center text-4xl text-[#fab923] sm:mb-3 sm:h-14 sm:text-5xl">
    {children}
  </div>
);

const Review = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex w-full items-center justify-center gap-1.5 sm:gap-2">
    {icon}
    <div className="text-start">
      <div className="flex items-center gap-1">
        <span className="text-base font-bold sm:text-lg">4.8</span>
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

const HomeBanner = ({ lang = "en" }: { lang?: Lang }) => {
  const isRtl = lang === "ar";
  const tr = t[lang];
  const wave = isRtl ? WAVE_RTL : WAVE_LTR;
  // Closing edge of the clip shape: opposite side of the wave
  const clipPath = isRtl ? `${wave} L0,1 L0,0 Z` : `${wave} L1,1 L1,0 Z`;
  const clipId = isRtl ? "wave-clip-rtl" : "wave-clip";

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      lang={lang}
      className="relative bg-[#111] text-white"
    >
      {/* Text-side background image (desktop only) */}
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src={LEFT_BG}
          alt=""
          fill
          sizes="100vw"
          className={`object-cover ${isRtl ? "object-right" : "object-left"}`}
        />
        {/* dark gradient keeps the text readable and fades toward the video */}
        <div
          className={`absolute inset-0 from-[#111]/95 via-[#111]/80 to-[#111]/40 ${
            isRtl ? "bg-linear-to-l" : "bg-linear-to-r"
          }`}
        />
        {/* soft green glow on the text side */}
        <div
          className={`absolute inset-0 from-[#00852B]/20 via-transparent to-transparent ${
            isRtl ? "bg-linear-to-l" : "bg-linear-to-r"
          }`}
        />
      </div>

      {/* Background video: full on mobile/tablet, half with wave on desktop.
          Sits at the inline-end edge (right in LTR, left in RTL). */}
      <div className="absolute inset-0 lg:inset-s-auto lg:w-1/2">
        <svg width="0" height="0" className="absolute">
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <path d={clipPath} />
          </clipPath>
        </svg>

        <video
          className={`h-full w-full object-cover ${
            isRtl
              ? "lg:[clip-path:url(#wave-clip-rtl)]"
              : "lg:[clip-path:url(#wave-clip)]"
          }`}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Overlay: dark on mobile for readability, light gradient on desktop */}
        <div
          className={`absolute inset-0 bg-[#111]/75 lg:bg-transparent lg:from-white/20 lg:via-transparent lg:to-transparent ${
            isRtl
              ? "lg:bg-linear-to-l lg:[clip-path:url(#wave-clip-rtl)]"
              : "lg:bg-linear-to-r lg:[clip-path:url(#wave-clip)]"
          }`}
        />

        {/* Wave outline (desktop only) */}
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

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-8xl px-4 pb-24 pt-12 sm:px-8 md:pb-28 lg:px-10 lg:pt-20">
        <div className="lg:w-[55%]">
          <h1
            className={`text-3xl font-extrabold sm:text-5xl ${
              isRtl ? "leading-snug sm:leading-snug" : "leading-tight"
            }`}
          >
            <span className="text-[#00852B]">{tr.titleHighlight}</span>
            {tr.titleRest}
          </h1>

          <div className="my-5 flex h-1 w-20 overflow-hidden rounded-full">
            <span className="w-2/3 bg-[#00852B]" />
            <span className="w-1/3 bg-[#F20D18]" />
          </div>

          <p className="max-w-lg text-sm leading-7">{tr.intro}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <ThemeBtn>{tr.ctaCall}</ThemeBtn>
            <ThemeBtn>{tr.ctaTax}</ThemeBtn>
          </div>

          <p className="mt-3 text-xs font-medium">{tr.speak}</p>

          {/* Trust Cards */}
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:mt-8 sm:gap-4 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <TrustCard>
              <IconBox>
                <BsShieldCheck />
              </IconBox>
              <h3 className="text-xs font-bold leading-4 sm:min-h-11 sm:text-sm sm:leading-5">
                {tr.ftaLine1}
                <br />
                {tr.ftaLine2}
              </h3>
              <span className="mt-2 rounded-full bg-[#00852B] px-3 py-1 text-[10px] font-bold sm:mt-3 sm:px-5 sm:py-1.5 sm:text-xs">
                {tr.ftaNo}
              </span>
            </TrustCard>

            <TrustCard>
              <IconBox>
                <FaHandshake />
              </IconBox>
              <h3 className="flex items-center text-xs font-bold leading-4 sm:min-h-11 sm:text-sm sm:leading-5">
                {tr.partner}
              </h3>
              <p className="mt-2 text-[11px] leading-4 text-white/70 sm:mt-3 sm:text-xs sm:leading-5">
                {tr.partnerSub}
              </p>
            </TrustCard>

            <TrustCard>
              <IconBox>
                <FaAward />
              </IconBox>
              <h3 className="text-2xl font-extrabold text-[#20C968] sm:text-3xl">
                {tr.years}
              </h3>
              <p className="mt-1 text-xs font-semibold sm:mt-2 sm:text-sm">
                {tr.yearsSub}
              </p>
              <p className="mt-1 text-[11px] font-bold text-[#F20D18] sm:mt-2 sm:text-xs">
                {tr.yearsCount}
              </p>
            </TrustCard>

            <TrustCard>
              <div className="flex w-full flex-col gap-2.5 sm:gap-4">
                <Review
                  icon={
                    <FaGoogle className="shrink-0 text-2xl text-[#4285F4] sm:text-3xl" />
                  }
                  label={tr.google}
                />
                <div className="h-px w-full bg-white/15" />
                <Review
                  icon={
                    <SiTrustpilot className="shrink-0 text-2xl text-[#00B67A] sm:text-3xl" />
                  }
                  label={tr.trustpilot}
                />
              </div>
            </TrustCard>
          </div>

          <p className="mt-5 flex items-start gap-2 text-xs leading-6">
            <BsShieldCheck size={16} className="mt-1 shrink-0 text-[#fab923]" />
            {tr.trusted}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeBanner;
