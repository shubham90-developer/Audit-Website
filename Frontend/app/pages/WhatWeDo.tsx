"use client";

import { useState } from "react";
import type { IconType } from "react-icons";
import {
  FiBookOpen,
  FiBriefcase,
  FiChevronRight,
  FiPercent,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import servicesJson from "../api/services.json";
import Title from "../components/Title";

type Lang = "en" | "ar";

const BG_IMAGE = "/img/banner/bg2.avif";
// LTR wave (photo on the right) and its mirror for RTL (photo on the left)
const WAVE_LTR =
  "M0.12,0 C0,0.25 0.22,0.45 0.08,0.7 C0.02,0.85 0.1,0.95 0.05,1";
const WAVE_RTL =
  "M0.88,0 C1,0.25 0.78,0.45 0.92,0.7 C0.98,0.85 0.9,0.95 0.95,1";

/**
 * Tabs come from api/services.json (same data as the navbar).
 * For Arabic, add optional fields next to the English ones:
 *   { "name": "...", "name_ar": "...", "desc": "...", "desc_ar": "...",
 *     "services": [{ "name": "...", "name_ar": "..." }] }
 * Anything missing falls back to English.
 */
type Service = {
  id: number;
  name: string;
  name_ar?: string;
  icon: string;
  desc: string;
  desc_ar?: string;
  services: { name: string; name_ar?: string }[];
};
const services = servicesJson as Service[];

const t = {
  en: {
    title: "What We",
    colorTitle: "Do",
    subtitle:
      "Comprehensive financial and tax solutions tailored for your business growth.",
    watermark: "Ahmed Al Mazroei",
  },
  ar: {
    title: "ما",
    colorTitle: "نقدّمه",
    subtitle: "حلول مالية وضريبية شاملة مصممة لدعم نمو أعمالك.",
    watermark: "أحمد المزروعي",
  },
} as const;

// Panel photo per tab, in the same order as services.json.
const IMAGES = [
  "/img/banner/1.jpg",
  "/img/banner/2.jpg",
  "/img/banner/3.jpg",
  "/img/banner/4.jpg",
  "/img/banner/7.jpg",
];

const ICONS: Record<string, IconType> = {
  shield: FiShield,
  percent: FiPercent,
  briefcase: FiBriefcase,
  trending: FiTrendingUp,
  book: FiBookOpen,
};

const Ico = ({ name, className }: { name: string; className?: string }) => {
  const I = ICONS[name] ?? FiBriefcase;
  return <I className={className} />;
};

const WhatWeDo = ({ lang = "en" }: { lang?: Lang }) => {
  const isRtl = lang === "ar";
  const tr = t[lang];
  const wave = isRtl ? WAVE_RTL : WAVE_LTR;
  const waveClip = isRtl ? `${wave} L0,1 L0,0 Z` : `${wave} L1,1 L1,0 Z`;
  const waveId = isRtl ? "wwd-wave-rtl" : "wwd-wave";

  const [active, setActive] = useState(0);
  const current = services[active];
  const pick = (en: string, ar?: string) => (isRtl && ar ? ar : en);

  const icon = current.icon;
  const name = pick(current.name, current.name_ar);
  const text = pick(current.desc, current.desc_ar);
  const items = current.services.map((s) => pick(s.name, s.name_ar));
  const img = IMAGES[active] ?? IMAGES[0];

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      lang={lang}
      className="relative -mt-10 bg-[#111] pb-28 pt-28 text-white [clip-path:url(#wwd-top)] lg:-mt-20 lg:pt-32"
    >
      <svg width="0" height="0" className="absolute hidden md:block">
        <clipPath id="wwd-top" clipPathUnits="objectBoundingBox">
          <path d="M0,0.12 Q0.5,-0.1 1,0.12 L1,1 L0,1 Z" />
        </clipPath>
        <clipPath id={waveId} clipPathUnits="objectBoundingBox">
          <path d={waveClip} />
        </clipPath>
      </svg>

      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BG_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-10">
        {/* Heading */}
        <Title
          title={tr.title}
          colorTitle={tr.colorTitle}
          subtitle={tr.subtitle}
          watermark={tr.watermark}
          titleClassName="text-white"
          colorTitleClassName="text-green-500"
          subtitleClassName="text-white/70"
          watermarkClassName="text-white/[0.06]"
        />

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 lg:grid-cols-[230px_1fr]">
          {/* Tabs */}
          <div className="space-y-2">
            {services.map((s, i) => (
              <button
                key={s.name}
                type="button"
                onClick={() => setActive(i)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-start text-md font-medium transition-colors ${
                  i === active
                    ? "border-transparent  bg-[#00852B]  text-white"
                    : "border-white/10 bg-black/60 hover:border-[#fab923]/50"
                }`}
              >
                <Ico name={s.icon} className="shrink-0 text-base" />
                <span className="flex-1">{pick(s.name, s.name_ar)}</span>
                <FiChevronRight
                  className={`shrink-0 ${isRtl ? "rotate-180" : ""}`}
                />
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d]">
            {/* Photo sits at the inline-end edge (right in LTR, left in RTL) */}
            <div className="absolute inset-y-0 inset-e-0 hidden w-2/5 md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={name}
                onError={(e) => (e.currentTarget.hidden = true)}
                className={`h-full w-full object-cover ${
                  isRtl
                    ? "[clip-path:url(#wwd-wave-rtl)]"
                    : "[clip-path:url(#wwd-wave)]"
                }`}
              />
              <svg
                viewBox="0 0 1 1"
                preserveAspectRatio="none"
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

            <div className="relative p-6 md:w-[65%]">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#fab923]/60 text-[#fab923]">
                  <Ico name={icon} />
                </span>
                <h3 className="text-base font-bold">{name}</h3>
              </div>
              <span className="ms-2 mt-2 block h-0.5 w-8 bg-[#fab923]" />

              <ul className="mt-5 space-y-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 rounded-md border border-white/5 bg-white/5 px-3 py-2 text-md font-medium"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#fab923]" />
                    {item}
                  </li>
                ))}
              </ul>

              <p
                className={`mt-4 text-xs text-white/70 ${
                  isRtl ? "leading-6" : "leading-5"
                }`}
              >
                {text}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
