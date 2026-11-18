"use client";

import { useRef, useSyncExternalStore } from "react";

import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";

import Title from "../components/Title";

import { useGetPartnersQuery, type Partner } from "../store/api/partnerApi";

type Lang = "en" | "ar";

// Existing section background
const BG_IMAGE = "/img/banner/bg1.avif";

const arrowBtn =
  "flex h-9 w-9 items-center justify-center rounded-full border border-[#00852B] bg-white text-[#111] shadow-sm transition-colors hover:bg-[#00852B] hover:text-white cursor-pointer";

// Language synchronization
const getLanguage = (): Lang => {
  if (typeof document === "undefined") {
    return "en";
  }

  return document.documentElement.lang === "ar" ? "ar" : "en";
};

const subscribeLanguage = (callback: () => void) => {
  window.addEventListener("languagechange", callback);

  window.addEventListener("site-language-change", callback);

  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("languagechange", callback);

    window.removeEventListener("site-language-change", callback);

    window.removeEventListener("storage", callback);
  };
};

const useLanguage = (): Lang =>
  useSyncExternalStore(subscribeLanguage, getLanguage, (): Lang => "en");

// Loading skeleton
const PartnershipSkeleton = () => {
  return (
    <div
      className="-mx-4 mt-10 flex gap-4 overflow-hidden px-4 py-3 sm:mx-0 sm:px-0"
      aria-busy="true"
      aria-label="Loading partners"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="w-60 shrink-0 animate-pulse rounded-xl border border-[#fab923]/40 bg-white p-4 text-center shadow-sm"
        >
          <div className="mx-auto mb-3 h-12 w-24 rounded bg-gray-200" />

          <div className="mx-auto h-4 w-4/5 rounded bg-gray-200" />

          <div className="mx-auto mt-3 h-3 w-full rounded bg-gray-100" />

          <div className="mx-auto mt-2 h-3 w-3/4 rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
};

// Partner card
const PartnerCard = ({ partner, lang }: { partner: Partner; lang: Lang }) => {
  const title = partner.title?.[lang] ?? "";
  const text = partner.text?.[lang] ?? "";

  const logo = partner.logo?.[lang]?.find((item) => Boolean(item?.url))?.url;

  return (
    <div className="w-60 shrink-0 snap-start rounded-xl border border-[#fab923]/40 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-[#00852B]/50 hover:shadow-md">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={title}
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
          className="mx-auto mb-3 h-12 w-auto max-w-full object-contain"
        />
      ) : null}

      <h3 className="text-sm font-bold">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-[#111]/60">{text}</p>
    </div>
  );
};

// Main component
const Partnership = () => {
  const track = useRef<HTMLDivElement>(null);

  const lang = useLanguage();

  const isRtl = lang === "ar";

  const {
    data: partners = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPartnersQuery();

  const slide = (dir: 1 | -1) => {
    track.current?.scrollBy({
      left: dir * 256,
      behavior: "smooth",
    });
  };

  return (
    <section
      dir={isRtl ? "rtl" : "ltr"}
      lang={lang}
      className="relative bg-[#F4F8F5] pb-28 pt-12 text-[#111]"
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BG_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-b from-[#f4f8f5a1] to-[#F4F8F5]/80" />

      <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-10">
        {/* Section heading */}
        <Title
          title={
            isRtl ? "التقديرات والاعتمادات و" : "Recognition, Accreditations &"
          }
          colorTitle={isRtl ? "الشراكات" : "Partnership"}
          subtitle={
            isRtl
              ? "الاعتمادات والتسجيلات التي تدعم أعمالنا."
              : "The approvals and registrations behind the work."
          }
          watermark={isRtl ? "أحمد المزروعي" : "Ahmed Al Mazroei"}
        />

        {/* Loading */}
        {isLoading ? (
          <PartnershipSkeleton />
        ) : isError && partners.length === 0 ? (
          <div
            role="alert"
            className="mt-10 flex flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-white px-4 py-12 text-center"
          >
            <p className="text-sm text-red-600">
              {isRtl
                ? "تعذر تحميل بيانات الشركاء."
                : "Unable to load partner information."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="flex items-center gap-2 rounded-full bg-[#00852B] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#006d23]"
            >
              <FiRefreshCw />

              {isRtl ? "إعادة المحاولة" : "Try Again"}
            </button>
          </div>
        ) : partners.length === 0 ? (
          <div
            role="status"
            className="mt-10 rounded-xl border border-[#fab923]/40 bg-white px-4 py-12 text-center"
          >
            <p className="text-sm text-[#111]/60">
              {isRtl
                ? "لا توجد بيانات للشركاء حالياً."
                : "No partner information is available."}
            </p>
          </div>
        ) : (
          <>
            {/* Cards */}
            <div
              ref={track}
              aria-busy={isFetching}
              className="-mx-4 mt-10 flex snap-x items-center gap-4 overflow-x-auto px-4 py-3 scrollbar-none sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {partners.map((partner) => (
                <PartnerCard key={partner._id} partner={partner} lang={lang} />
              ))}
            </div>

            {/* Navigation arrows */}
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => slide(-1)}
                aria-label={isRtl ? "السابق" : "Previous"}
                className={arrowBtn}
              >
                <FiChevronLeft />
              </button>

              <button
                type="button"
                onClick={() => slide(1)}
                aria-label={isRtl ? "التالي" : "Next"}
                className={arrowBtn}
              >
                <FiChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Partnership;
