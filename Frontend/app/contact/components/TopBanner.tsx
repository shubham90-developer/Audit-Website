"use client";

import type { ElementType } from "react";
import { FaWhatsapp } from "react-icons/fa";
import {
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";

import { useGetContactContentQuery } from "@/app/store/api/contactContentApi";
import { useLang } from "@/app/services/hooks/useLang";

/* ------------------------- Content helpers ------------------------- */

type Lang = "en" | "ar";
type Localized = { en: string; ar: string };
type MediaItem = { url: string };
type LocalizedMedia = { en: MediaItem[]; ar: MediaItem[] };
type Sortable = { isActive: boolean; order: number };

/** Value in the active language, falling back to the other one when empty. */
const pickText = (value: Localized | undefined, lang: Lang) => {
  const other: Lang = lang === "en" ? "ar" : "en";
  const primary = value?.[lang] ?? "";
  return primary.trim() ? primary : (value?.[other] ?? "");
};

/** Plain text from HTML (admin text fields may be rich text). */
const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const pickPlain = (value: Localized | undefined, lang: Lang) =>
  stripHtml(pickText(value, lang));

/** First uploaded URL for the active language, falling back to the other one. */
const pickMediaUrl = (media: LocalizedMedia | undefined, lang: Lang) => {
  const other: Lang = lang === "en" ? "ar" : "en";
  return (
    media?.[lang]?.find((m) => m.url)?.url ||
    media?.[other]?.find((m) => m.url)?.url ||
    ""
  );
};

/** Active items only, in admin order. */
const activeSorted = <T extends Sortable>(items: T[] | undefined): T[] =>
  (items ?? [])
    .filter((item) => item.isActive)
    .sort((a, b) => a.order - b.order);

/* ----------------------- Loading and error UI ----------------------- */

const UI = {
  en: {
    loadError: "We couldn't load this content right now.",
    retry: "Try again",
  },
  ar: {
    loadError: "تعذّر تحميل هذا المحتوى حالياً.",
    retry: "حاول مرة أخرى",
  },
} as const;

const Skeleton = ({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) => (
  <span
    aria-hidden="true"
    className={`block animate-pulse rounded-md ${
      tone === "dark" ? "bg-white/10" : "bg-gray-200/80"
    } ${className}`}
  />
);

const ContentError = ({
  message,
  retryLabel,
  onRetry,
  tone = "light",
}: {
  message: string;
  retryLabel: string;
  onRetry: () => void;
  tone?: "light" | "dark";
}) => (
  <div
    role="alert"
    className={`rounded-2xl border p-5 text-center text-sm ${
      tone === "dark"
        ? "border-white/15 text-white/80"
        : "border-red-200 bg-red-50 text-red-700"
    }`}
  >
    <p>{message}</p>
    <button
      type="button"
      onClick={onRetry}
      className="mt-4 cursor-pointer rounded-full bg-[#3ddc6e] px-5 py-2 text-sm font-bold text-black transition hover:bg-gray-950 hover:text-white"
    >
      {retryLabel}
    </button>
  </div>
);

const CARD_ICONS: Record<string, ElementType> = {
  phone: HiOutlinePhone,
  email: HiOutlineEnvelope,
  whatsapp: FaWhatsapp,
  address: HiOutlineMapPin,
};

const CARD_CLASS =
  "group flex min-h-[88px] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.08] p-3.5 shadow-[0_5px_20px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#3ddc6e]/50 hover:bg-white/[0.12] hover:shadow-[0_10px_30px_rgba(61,220,110,0.10)]";

const TopBanner = () => {
  const lang = useLang();
  const t = UI[lang];
  const { data, isLoading, isError, refetch } = useGetContactContentQuery();

  const bgImage = data ? pickMediaUrl(data.heroBgImage, lang) : "";
  const video = data ? pickMediaUrl(data.heroVideo, lang) : "";
  const cards = data ? activeSorted(data.contactCards) : [];

  const badge = data ? pickPlain(data.heroBadge, lang) : "";
  const title = data ? pickPlain(data.heroTitle, lang) : "";
  const highlight = data ? pickPlain(data.heroHighlight, lang) : "";
  const description = data ? pickPlain(data.heroDescription, lang) : "";

  return (
    <section
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative isolate bg-[#080d09] py-12 text-white sm:py-14 lg:py-16"
    >
      {/* Background (only when the admin has uploaded one) */}
      {bgImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-center"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-20 bg-black/65" />

      {/* Green Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-0 -z-10 h-112.5 w-150 rounded-full blur-[130px]"
        style={{ background: "rgba(61,220,110,0.13)" }}
      />

      {/* Right video panel */}
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[48%] lg:block">
        {isLoading && (
          <Skeleton tone="dark" className="h-full w-full rounded-none" />
        )}

        {!isLoading && video && (
          <>
            <video
              key={video}
              src={video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
              style={{ clipPath: "ellipse(100% 78% at 100% 50%)" }}
            />

            <div className="absolute inset-0 bg-linear-to-l from-transparent via-black/5 to-black/30" />

            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            >
              <path
                d="M23.2 0A100 78 0 0 0 23.2 100"
                fill="none"
                stroke="#3ddc6e"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main content */}
        <div className="relative max-w-xl lg:max-w-[48%]">
          {isError ? (
            <ContentError
              tone="dark"
              message={t.loadError}
              retryLabel={t.retry}
              onRetry={() => refetch()}
            />
          ) : (
            <>
              {isLoading ? (
                <Skeleton tone="dark" className="h-7 w-44 rounded-full" />
              ) : (
                badge && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#3ddc6e]/30 bg-[#3ddc6e]/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7bea9c]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc6e]" />
                    {badge}
                  </span>
                )
              )}

              {isLoading ? (
                <div className="mt-5 space-y-3">
                  <Skeleton tone="dark" className="h-10 w-3/4" />
                  <Skeleton tone="dark" className="h-10 w-1/2" />
                </div>
              ) : (
                (title || highlight) && (
                  <h1 className="mt-5 text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[52px]">
                    {title}
                    {title && highlight && <br />}
                    {highlight && (
                      <span className="text-[#3ddc6e]">{highlight}</span>
                    )}
                  </h1>
                )
              )}

              <div className="mt-5 h-1 w-14 rounded-full bg-[#3ddc6e]" />

              {isLoading ? (
                <div className="mt-5 max-w-md space-y-2">
                  <Skeleton tone="dark" className="h-4 w-full" />
                  <Skeleton tone="dark" className="h-4 w-4/5" />
                </div>
              ) : (
                description && (
                  <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:text-base">
                    {description}
                  </p>
                )
              )}
            </>
          )}
        </div>

        {/* Contact cards */}
        {!isError && (
          <div className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className={`${CARD_CLASS} pointer-events-none`}>
                  <Skeleton
                    tone="dark"
                    className="h-10 w-10 shrink-0 rounded-xl"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton tone="dark" className="h-2.5 w-16" />
                    <Skeleton tone="dark" className="h-3 w-full" />
                  </div>
                </div>
              ))}

            {!isLoading &&
              cards.map((card) => {
                const Icon = CARD_ICONS[card.key] ?? HiOutlineMapPin;
                const label = pickPlain(card.label, lang);
                const value = pickPlain(card.value, lang);
                const href = card.href;
                const external = href.startsWith("http");

                const content = (
                  <>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#3ddc6e]/20 bg-[#3ddc6e]/10 text-[#3ddc6e] transition-all duration-300 group-hover:bg-[#3ddc6e] group-hover:text-[#101c13]">
                      <Icon className="h-4.5 w-4.5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-[#3ddc6e]">
                        {label}
                      </span>
                      <span className="mt-1 block wrap-break-word text-xs font-medium leading-5 text-white/90 sm:text-[13px]">
                        {value}
                      </span>
                    </span>
                  </>
                );

                return href ? (
                  <a
                    key={card._id ?? card.key}
                    href={href}
                    className={CARD_CLASS}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={card._id ?? card.key} className={CARD_CLASS}>
                    {content}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopBanner;
