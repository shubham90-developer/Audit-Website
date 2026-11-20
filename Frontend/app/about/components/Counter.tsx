"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { IconType } from "react-icons";
import { FiGlobe, FiRefreshCw } from "react-icons/fi";
import {
  HiOutlineDocumentCheck,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlineShieldCheck,
  HiOutlineUsers,
} from "react-icons/hi2";

import { useGetNumbersPresenceQuery } from "@/app/store/api/numbersPresenceApi";
const GOLD = "text-[#00852B]";

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

interface NumbersSection {
  numbersTitle: Localized;
  securityTitle: Localized;
  securityText: Localized;
  insuranceText: Localized;
  globalLabel: Localized;
  globalTitle: Localized;
  globalText: Localized;
  sectionBg: LocalizedMedia;
  panelBg: LocalizedMedia;
}

interface NumbersStat {
  _id: string;
  icon: string;
  color: string;
  value: number;
  suffix: string;
  label: Localized;
  order: number;
}

interface NumbersOffice {
  _id: string;
  city: Localized;
  country: Localized;
  flagCode: string;
  image: LocalizedMedia;
  order: number;
}

interface NumbersPresenceData {
  section: NumbersSection | null;
  stats: NumbersStat[];
  offices: NumbersOffice[];
}

/* ---------------- Language ---------------- */

const getLanguage = (): Lang => {
  if (typeof document === "undefined") return "en";
  return document.documentElement.lang === "ar" ? "ar" : "en";
};

const subscribeLanguage = (callback: () => void) => {
  const observer = new MutationObserver(callback);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  window.addEventListener("languagechange", callback);
  window.addEventListener("site-language-change", callback);

  return () => {
    observer.disconnect();
    window.removeEventListener("languagechange", callback);
    window.removeEventListener("site-language-change", callback);
  };
};

const useLanguage = (): Lang =>
  useSyncExternalStore(subscribeLanguage, getLanguage, () => "en");

const tr = (value: Localized | undefined, lang: Lang): string =>
  value?.[lang] ?? "";

const getImage = (
  value: LocalizedMedia | undefined,
  lang: Lang,
): string | undefined => value?.[lang]?.find((item) => item?.url)?.url;

/* ---------------- Rich Text ---------------- */

// Handles plain text and HTML from the admin rich-text editor.
// HTML is displayed as text until sanitized/rendered by a trusted
// rich-text renderer, avoiding unsafe HTML injection.
const PlainRichText = ({
  value,
  className,
}: {
  value: string;
  className?: string;
}) => {
  const plain = value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(?:p|div|h[1-6])>/gi, " ")
    .replace(/<[^>]*>/g, "");

  return <span className={className}>{plain}</span>;
};

/* ---------------- Icons ---------------- */

const ICONS: Record<string, IconType> = {
  users: HiOutlineUsers,
  globe: HiOutlineGlobeAlt,
  document: HiOutlineDocumentCheck,
  mappin: HiOutlineMapPin,
};

const COLORS: Record<string, string> = {
  violet: "text-violet-300",
  emerald: "text-emerald-300",
  green: "text-[#00852B]",
  teal: "text-teal-300",
};

const getIcon = (name: string): IconType =>
  ICONS[name] ?? HiOutlineDocumentCheck;

const getColor = (color: string): string => COLORS[color] ?? GOLD;

/* ---------------- Count Up ---------------- */

const useCountUp = (target: number, duration = 2000) => {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let started = false;

    setValue(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;

        started = true;
        observer.disconnect();

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setValue(target);
          return;
        }

        const start = performance.now();

        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);

          setValue(Math.round(target * (1 - (1 - p) ** 4)));

          if (p < 1) {
            raf = requestAnimationFrame(tick);
          }
        };

        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { ref, value };
};

/* ---------------- Stat ---------------- */

const Stat = ({
  stat,
  first,
  lang,
}: {
  stat: NumbersStat;
  first: boolean;
  lang: Lang;
}) => {
  const { ref, value } = useCountUp(Number(stat.value) || 0);

  const Icon = getIcon(stat.icon);
  const color = getColor(stat.color);

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center px-3 text-center"
    >
      {!first && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-linear-to-b from-transparent via-white/25 to-transparent sm:block"
        />
      )}

      <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />

      <span className="mt-3 text-3xl font-bold leading-9 tabular-nums">
        {value.toLocaleString(lang === "ar" ? "ar-AE" : "en-US")}
        {stat.suffix}
      </span>

      <span className="mt-1 min-h-9 text-[13px] leading-4.5 text-white/70">
        {tr(stat.label, lang)}
      </span>
    </div>
  );
};

/* ---------------- Skeleton ---------------- */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded bg-white/15 ${className}`} />
);

const CounterSkeleton = () => (
  <section
    className="relative isolate overflow-x-clip bg-[#0c0a07] text-white lg:pb-24"
    role="status"
    aria-label="Loading global presence"
  >
    <div className="mx-auto max-w-332 space-y-12 px-4 py-10 sm:px-6 lg:space-y-16 xl:px-0">
      <div className="grid overflow-hidden rounded-3xl border border-[#00852B]/40 bg-[#0c0a07] lg:grid-cols-[636fr_692fr]">
        <div className="px-5 py-10 sm:px-8 lg:py-12">
          <Skeleton className="mx-auto mb-8 h-8 w-64" />

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6 border-t border-white/10 px-5 py-10 lg:border-t-0">
          <Skeleton className="h-22.5 w-22.5 shrink-0 rounded-full" />

          <div className="w-full space-y-3">
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>

      <div className="grid items-center gap-10 md:grid-cols-[184px_minmax(0,1fr)] xl:grid-cols-[184px_minmax(0,1fr)_625px]">
        <Skeleton className="mx-auto h-46 w-46 rounded-full" />

        <div className="space-y-4">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:col-span-2 xl:col-span-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-4 rounded-2xl border border-white/15 bg-white/5 px-2 py-7"
            >
              <Skeleton className="h-14 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- Main Component ---------------- */

const Counter = () => {
  const lang = useLanguage();
  const isRtl = lang === "ar";

  const { data, isLoading, isFetching, isError, refetch } =
    useGetNumbersPresenceQuery();

  if (isLoading) {
    return <CounterSkeleton />;
  }

  if (isError && !data) {
    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        role="alert"
        className="flex min-h-72 flex-col items-center justify-center gap-4 bg-[#0c0a07] px-4 text-center text-white"
      >
        <p className="text-sm text-red-300">
          {isRtl
            ? "تعذر تحميل بيانات الشركة."
            : "Unable to load company information."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="flex items-center gap-2 rounded-full bg-[#00852B] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#006d23]"
        >
          <FiRefreshCw />
          {isRtl ? "إعادة المحاولة" : "Try Again"}
        </button>
      </section>
    );
  }

  // The existing API unwraps the backend response.
  const content = data as NumbersPresenceData | undefined;

  const section = content?.section;

  const stats = Array.isArray(content?.stats)
    ? [...content.stats].sort((a, b) => a.order - b.order)
    : [];

  const offices = Array.isArray(content?.offices)
    ? [...content.offices].sort((a, b) => a.order - b.order)
    : [];

  if (!section) {
    return (
      <section
        dir={isRtl ? "rtl" : "ltr"}
        className="bg-[#0c0a07] px-4 py-16 text-center text-sm text-white/70"
      >
        {isRtl
          ? "لا توجد بيانات متاحة حالياً."
          : "No company information is currently available."}
      </section>
    );
  }

  const sectionBg = getImage(section.sectionBg, lang);
  const panelBg = getImage(section.panelBg, lang);

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      lang={lang}
      aria-busy={isFetching}
      className="relative isolate overflow-x-clip text-white lg:pb-24"
    >
      {/* Section background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[#0c0a07] [clip-path:polygon(0_111px,15%_241px,85%_241px,100%_111px,100%_100%,0_100%)] lg:[clip-path:polygon(0_143px,15%_273px,85%_273px,100%_143px,100%_100%,0_100%)]"
      >
        {sectionBg && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url("${sectionBg}")`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.35)_50%,rgba(0,0,0,0.55)_75%,#000_100%)]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.6)_0%,transparent_25%,transparent_75%,rgba(0,0,0,0.6)_100%)]" />

        <div className="absolute left-1/2 top-24 h-72 w-[70%] -translate-x-1/2 rounded-full bg-[#00852B]/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-332 space-y-12 px-4 sm:px-6 lg:space-y-16 xl:px-0">
        {/* Numbers and security */}
        <div className="relative isolate grid overflow-hidden rounded-3xl border border-[#00852B]/40 bg-[#0c0a07] shadow-[0_30px_80px_-30px_rgba(250,185,35,0.35)] lg:grid-cols-[636fr_692fr]">
          {panelBg && (
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-20 bg-cover bg-center"
              style={{
                backgroundImage: `url("${panelBg}")`,
              }}
            />
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-r from-black/40 via-black/25 to-black/50"
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-[#00852B] to-transparent"
          />

          {/* Statistics */}
          <div className="px-5 py-10 sm:px-8 lg:py-12">
            <h2 className="mb-8 text-center text-3xl font-extrabold leading-8">
              <PlainRichText value={tr(section.numbersTitle, lang)} />
            </h2>

            {stats.length > 0 ? (
              <div className="mx-auto grid max-w-150 grid-cols-2 gap-x-2 gap-y-10 sm:grid-cols-4 sm:gap-x-0">
                {stats.map((stat, i) => (
                  <Stat
                    key={stat._id}
                    stat={stat}
                    first={i === 0}
                    lang={lang}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-white/60">
                {isRtl ? "لا توجد إحصائيات متاحة." : "No statistics available."}
              </p>
            )}
          </div>

          {/* Data security */}
          <div className="relative flex flex-col items-center gap-6 border-t border-white/10 px-5 py-10 sm:px-8 md:flex-row lg:border-t-0 lg:py-12 lg:pl-12 lg:pr-10">
            <span
              aria-hidden="true"
              className="absolute bottom-8 left-0 top-8 hidden w-px bg-linear-to-b from-transparent via-white/55 to-transparent lg:block"
            />

            <div className="grid h-22.5 w-22.5 flex-none place-items-center rounded-full border border-[#00852B]/60 bg-black/70 shadow-[0_0_30px_-6px_#fab923]">
              <HiOutlineShieldCheck
                className={`h-10 w-10 ${GOLD}`}
                aria-hidden="true"
              />
            </div>

            <div
              className={`text-center ${
                isRtl ? "md:text-right" : "md:text-left"
              }`}
            >
              <h3 className="text-base font-semibold leading-6 lg:text-2xl">
                <PlainRichText value={tr(section.securityTitle, lang)} />
              </h3>

              <p className="mt-2 text-xs leading-5 text-white/90">
                <PlainRichText value={tr(section.securityText, lang)} />
              </p>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/20 bg-black/40 px-5 py-4 text-start backdrop-blur-md">
                <HiOutlineDocumentCheck
                  className={`h-6 w-6 flex-none ${GOLD}`}
                  aria-hidden="true"
                />

                <p className="text-xs leading-4 text-white/85">
                  <PlainRichText value={tr(section.insuranceText, lang)} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Global presence */}
        <div className="grid items-center gap-x-10 gap-y-12 md:grid-cols-[184px_minmax(0,1fr)] xl:grid-cols-[184px_minmax(0,1fr)_625px]">
          {/* Globe */}
          <div className="relative mx-auto h-46 w-46">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 top-1/2 hidden h-60 w-72 -translate-y-1/2 opacity-40 md:block"
              style={{
                backgroundImage:
                  "radial-gradient(#00852B 1.6px, transparent 1.7px)",
                backgroundSize: "10px 10px",
                maskImage:
                  "radial-gradient(ellipse at 40% 50%, #000 25%, transparent 68%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at 40% 50%, #000 25%, transparent 68%)",
              }}
            />

            <div className="absolute inset-0 rounded-full border border-[#fab923]/45" />

            <span className="absolute left-36.25 top-3.75 h-2 w-2 rounded-full bg-[#fab923] shadow-[0_0_10px_#fab923]" />

            <span className="absolute -left-0.75 top-22.25 h-1.5 w-1.5 rounded-full bg-[#fab923]" />

            <div className="absolute left-1/2 top-1/2 grid h-36.25 w-36.25 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black shadow-[0_0_40px_-10px_#fab923]">
              <FiGlobe
                className={`h-18 w-18 ${GOLD}`}
                strokeWidth={1.4}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Global presence text */}
          <div
            className={`text-center ${
              isRtl ? "md:text-right" : "md:text-left"
            }`}
          >
            <p className="text-xs font-medium uppercase tracking-[0.25em]">
              {tr(section.globalLabel, lang)}
            </p>

            <h2 className="mt-2 text-[28px] font-bold leading-9.5">
              <PlainRichText value={tr(section.globalTitle, lang)} />
            </h2>

            <p className="mt-4 text-sm leading-6 text-white/90 md:text-justify">
              <PlainRichText value={tr(section.globalText, lang)} />
            </p>
          </div>

          {/* Offices */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:col-span-2 xl:col-span-1">
            {offices.map((office) => {
              const city = tr(office.city, lang);
              const country = tr(office.country, lang);
              const imageUrl = getImage(office.image, lang);

              const flagCode = office.flagCode?.toLowerCase();
              const validFlag = /^[a-z]{2}$/.test(flagCode ?? "");

              return (
                <article
                  key={office._id}
                  className="group flex h-full flex-col items-center rounded-2xl border border-white/15 bg-linear-to-b from-white/8 to-black/50 px-2 py-7 text-center backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#fab923]/60"
                >
                  <div className="relative h-14 w-24 transition-transform duration-300 group-hover:scale-105">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={city}
                        fill
                        sizes="96px"
                        unoptimized
                        className="object-contain"
                      />
                    )}
                  </div>

                  <h3 className="mt-4 text-sm font-bold leading-5">{city}</h3>

                  <p className="mt-1 text-[13px] leading-5 text-white/70">
                    {country}
                  </p>

                  {validFlag && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://flagcdn.com/w40/${flagCode}.png`}
                      alt={`${country} flag`}
                      width={24}
                      height={16}
                      className="mt-3 rounded-[3px]"
                    />
                  )}
                </article>
              );
            })}

            {offices.length === 0 && (
              <p className="col-span-full text-center text-sm text-white/60">
                {isRtl
                  ? "لا توجد مكاتب متاحة حالياً."
                  : "No offices are currently available."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter;
