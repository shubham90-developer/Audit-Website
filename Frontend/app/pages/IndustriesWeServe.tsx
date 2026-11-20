"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import type { IconType } from "react-icons";

import {
  HiOutlineBolt,
  HiOutlineBuildingLibrary,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineCpuChip,
  HiOutlineGlobeAlt,
  HiOutlineHandRaised,
  HiOutlineHeart,
  HiOutlineHomeModern,
  HiOutlineTruck,
  HiOutlineUsers,
} from "react-icons/hi2";

import { useGetIndustriesQuery } from "../store/api/industriesApi";

/* ----------------------------- Types ----------------------------- */

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

type IndustryIcon =
  | "government"
  | "building"
  | "energy"
  | "truck"
  | "heart"
  | "globe"
  | "gear"
  | "chip"
  | "users"
  | "hand"
  | "chart";

interface IndustriesSection {
  _id: string;
  watermark: Localized;
  title: Localized;
  description: Localized;
  footerTitle: Localized;
  footerNote: Localized;
  footerIcon: IndustryIcon;
  sectionBg: LocalizedMedia;
}

interface IndustryItem {
  _id: string;
  icon: IndustryIcon;
  title: Localized;
  desc: Localized;
  image: LocalizedMedia;
  order: number;
}

interface IndustriesResponse {
  section: IndustriesSection | null;
  items: IndustryItem[];
}

/* ----------------------------- Icons ----------------------------- */

const ICON_MAP: Record<IndustryIcon, IconType> = {
  government: HiOutlineBuildingLibrary,
  building: HiOutlineHomeModern,
  energy: HiOutlineBolt,
  truck: HiOutlineTruck,
  heart: HiOutlineHeart,
  globe: HiOutlineGlobeAlt,
  gear: HiOutlineCog6Tooth,
  chip: HiOutlineCpuChip,
  users: HiOutlineUsers,
  hand: HiOutlineHandRaised,
  chart: HiOutlineChartBar,
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

const getText = (value: Localized | undefined, lang: Lang): string =>
  value?.[lang] ?? "";

const getImage = (
  media: LocalizedMedia | undefined,
  lang: Lang,
): string | undefined => media?.[lang]?.[0]?.url;

/**
 * Removes HTML tags while keeping readable text.
 * Suitable for ordinary text fields and plain-text titles.
 */
const stripHtml = (html: string): string =>
  html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(?:p|div|h[1-6]|li)>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Render editor HTML safely by allowing only a small set
 * of formatting tags and supported colors.
 *
 * Uses DOMParser rather than dangerouslySetInnerHTML.
 */
const RichText = ({
  html,
  className = "",
}: {
  html: string;
  className?: string;
}) => {
  const nodes = useMemo(() => {
    if (typeof window === "undefined") return null;

    const doc = new DOMParser().parseFromString(html, "text/html");

    const renderNode = (node: Node, key: string): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return null;
      }

      const element = node as HTMLElement;
      const tag = element.tagName.toLowerCase();

      if (
        ["script", "style", "iframe", "object", "embed", "svg"].includes(tag)
      ) {
        return null;
      }

      const children = Array.from(element.childNodes).map((child, index) =>
        renderNode(child, `${key}-${index}`),
      );

      if (tag === "br") {
        return <br key={key} />;
      }

      if (tag === "strong" || tag === "b") {
        return <strong key={key}>{children}</strong>;
      }

      if (tag === "em" || tag === "i") {
        return <em key={key}>{children}</em>;
      }

      if (tag === "u") {
        return <u key={key}>{children}</u>;
      }

      if (tag === "span") {
        const color = element.style.color;

        const safeColor =
          /^#[0-9a-f]{3,8}$/i.test(color) ||
          /^rgb(a)?\([\d\s,.%]+\)$/i.test(color)
            ? color
            : undefined;

        return (
          <span key={key} style={safeColor ? { color: safeColor } : undefined}>
            {children}
          </span>
        );
      }

      if (["p", "div", "h1", "h2", "h3"].includes(tag)) {
        return <React.Fragment key={key}>{children}</React.Fragment>;
      }

      return <React.Fragment key={key}>{children}</React.Fragment>;
    };

    return Array.from(doc.body.childNodes).map((node, index) =>
      renderNode(node, String(index)),
    );
  }, [html]);

  return <span className={className}>{nodes ?? stripHtml(html)}</span>;
};

/* ----------------------------- Skeleton ----------------------------- */

const Skeleton = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-slate-200 ${className}`}
  />
);

const IndustriesSkeleton = () => (
  <div
    className="mx-auto max-w-6xl"
    role="status"
    aria-label="Loading industries"
  >
    <div className="mx-auto mb-10 flex max-w-4xl flex-col items-center">
      <Skeleton className="mb-4 h-12 w-3/5" />
      <Skeleton className="mb-5 h-1 w-20" />
      <Skeleton className="mb-2 h-4 w-4/5" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
    </div>

    <div className="relative mt-12 grid gap-4 lg:grid-cols-2 lg:gap-x-16">
      <div className="absolute bottom-0 left-1/2 top-0 hidden w-0.5 -translate-x-1/2 bg-[#00852B]/15 lg:block" />

      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="flex min-h-36 gap-4 overflow-hidden rounded-xl border border-[#00852B]/20 bg-white p-5"
        >
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-5" />
            <Skeleton className="h-11 w-11 rounded-lg" />
          </div>

          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>

          <Skeleton className="h-25 w-1/4" />
        </div>
      ))}
    </div>

    <div className="mx-auto mt-10 flex max-w-xl items-center gap-5 rounded-xl border border-[#00852B]/20 bg-white px-6 py-5">
      <Skeleton className="h-10 w-10" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>
    </div>
  </div>
);

/* ----------------------------- Component ----------------------------- */

const IndustriesWeServe = () => {
  const lang = useLanguage();

  const listRef = useRef<HTMLUListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const { data, isLoading, isError, refetch } = useGetIndustriesQuery();

  const content = data as IndustriesResponse | undefined;

  const section = content?.section ?? null;
  const items = content?.items ?? [];

  const industries = useMemo(
    () => [...items].sort((a, b) => a.order - b.order),
    [items],
  );

  const backgroundImage = getImage(section?.sectionBg, lang);

  /* ----------------------------- Scroll Animation ----------------------------- */

  useEffect(() => {
    if (!section || industries.length === 0) return;

    const list = listRef.current;
    const fill = fillRef.current;

    if (!list || !fill) return;

    const dots = list.querySelectorAll<HTMLElement>("[data-dot]");

    let raf = 0;

    const update = () => {
      raf = 0;

      const rect = list.getBoundingClientRect();
      const total = rect.height + 40;
      const y = window.innerHeight * 0.6 - rect.top;

      const filled = Math.min(Math.max(y, 0), total);

      fill.style.height = `${filled}px`;

      dots.forEach((dot) => {
        const r = dot.getBoundingClientRect();

        const dotY = r.top + r.height / 2 - rect.top;

        dot.dataset.on = String(dotY <= filled);
      });
    };

    const onScroll = () => {
      if (!raf) {
        raf = requestAnimationFrame(update);
      }
    };

    update();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });
    window.addEventListener("resize", onScroll);

    const observer = new ResizeObserver(onScroll);
    observer.observe(list);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [section, industries]);

  return (
    <section
      className="relative isolate bg-white px-4 py-16 text-slate-900 sm:px-6 lg:py-24"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Dynamic background */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="-z-30 object-fill"
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-linear-to-b from-white/90 via-white/75 to-white/90"
      />

      {isError ? (
        <div className="relative mx-auto flex min-h-75 flex-col items-center justify-center text-center">
          <p className="mb-4 text-sm text-red-600">
            {lang === "ar"
              ? "تعذر تحميل القطاعات."
              : "Unable to load industries."}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-[#00852B] px-5 py-2 text-sm font-semibold text-white"
          >
            {lang === "ar" ? "إعادة المحاولة" : "Try Again"}
          </button>
        </div>
      ) : isLoading || !section ? (
        <IndustriesSkeleton />
      ) : (
        <>
          {/* Heading */}
          <div className="relative mx-auto mb-10 max-w-4xl px-4 text-center">
            <div className="pointer-events-none absolute inset-x-0 -top-2 select-none text-4xl font-extrabold uppercase tracking-widest text-[#00852B]/[0.06] sm:-top-6 sm:text-6xl lg:text-7xl">
              {stripHtml(getText(section.watermark, lang))}
            </div>

            <h2 className="relative text-2xl font-extrabold leading-tight text-[#111] sm:text-3xl lg:text-6xl">
              <RichText html={getText(section.title, lang)} />
            </h2>

            <div className="mx-auto my-4 flex h-1 w-20 overflow-hidden rounded-full">
              <span className="w-2/3 bg-[#00852B]" />
              <span className="w-1/3 bg-[#F20D18]" />
            </div>

            <p className="relative mx-auto max-w-2xl text-sm leading-7 text-[#111]/65 sm:text-base">
              {stripHtml(getText(section.description, lang))}
            </p>
          </div>

          {/* Cards */}
          <ul
            ref={listRef}
            className="relative mx-auto mt-12 grid max-w-6xl gap-4 lg:grid-cols-2 lg:gap-x-16"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 left-1/2 top-0 z-0 hidden w-0.5 -translate-x-1/2 rounded-full bg-[#00852B]/25 lg:block"
            >
              <span
                ref={fillRef}
                className="absolute left-0 top-0 w-full rounded-full bg-[#00852B] shadow-[0_0_10px_rgba(0,133,43,0.5)]"
                style={{ height: 0 }}
              >
                <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#00852B] shadow-[0_0_0_4px_rgba(0,133,43,0.2),0_0_14px_rgba(0,133,43,0.8)]" />
              </span>
            </span>

            {industries.map((industry, index) => {
              const Icon = ICON_MAP[industry.icon] ?? HiOutlineChartBar;

              const imageUrl = getImage(industry.image, lang);

              return (
                <li key={industry._id} className="relative">
                  {index % 2 === 0 && (
                    <span
                      data-dot
                      data-on="false"
                      aria-hidden="true"
                      className="absolute -right-8 top-1/2 z-10 hidden h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-[#00852B]/40 bg-white transition-all duration-500 data-[on=true]:scale-125 data-[on=true]:border-[#00852B] data-[on=true]:bg-[#00852B] data-[on=true]:shadow-[0_0_0_4px_rgba(0,133,43,0.2),0_0_14px_rgba(0,133,43,0.6)] lg:block"
                    />
                  )}

                  <article className="relative z-1 flex h-full gap-4 overflow-hidden rounded-xl border border-[#00852B]/40 bg-white p-5 pr-[38%] shadow-sm shadow-[#00852B]/10 transition-shadow hover:shadow-md hover:shadow-[#00852B]/20">
                    {imageUrl && (
                      <div className="absolute inset-y-0 right-0 w-2/5">
                        <Image
                          src={imageUrl}
                          alt=""
                          fill
                          unoptimized
                          sizes="(min-width: 1024px) 240px, 40vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-white via-white/30 to-transparent" />
                      </div>
                    )}

                    <div className="relative flex flex-none flex-col items-start gap-3">
                      <span className="text-xs font-bold text-[#00852B]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="grid h-11 w-11 place-items-center rounded-lg border border-[#00852B]/30 bg-[#00852B]/10">
                        <Icon
                          className="h-6 w-6 text-[#00852B]"
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    <div className="relative">
                      <h3 className="text-sm font-bold leading-5 text-slate-900 sm:text-base">
                        {stripHtml(getText(industry.title, lang))}
                      </h3>

                      <p className="mt-1.5 text-xs leading-5 text-slate-600">
                        {stripHtml(getText(industry.desc, lang))}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className="relative mx-auto mt-10 flex max-w-xl items-center gap-5 rounded-xl border border-[#00852B]/40 bg-white px-6 py-5 shadow-sm shadow-[#00852B]/10">
            {React.createElement(
              ICON_MAP[section.footerIcon] ?? HiOutlineChartBar,
              {
                className: "h-10 w-10 flex-none text-[#00852B]",
                "aria-hidden": true,
              },
            )}

            <span
              aria-hidden="true"
              className="h-14 w-px flex-none bg-slate-200"
            />

            <div>
              <p className="text-base font-bold leading-6 text-slate-900">
                <RichText html={getText(section.footerTitle, lang)} />
              </p>

              <p className="mt-1 text-xs text-slate-600">
                {stripHtml(getText(section.footerNote, lang))}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default IndustriesWeServe;
