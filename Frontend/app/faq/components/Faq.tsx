"use client";

import ThemeBtn from "@/app/components/ThemeBtn";
import Breadcrumb from "@/app/components/Breadcrumb";
import { useGetFaqSectionQuery } from "@/app/store/api/faqSectionApi";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

type Lang = "en" | "ar";

// Same signals the LanguageToggle uses: <html lang> + the "languagechange" event.
const getLang = (): Lang =>
  typeof document !== "undefined" && document.documentElement.lang === "ar"
    ? "ar"
    : "en";

const subscribeLang = (callback: () => void) => {
  window.addEventListener("languagechange", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("languagechange", callback);
    window.removeEventListener("storage", callback);
  };
};

const useLang = (): Lang =>
  useSyncExternalStore(subscribeLang, getLang, (): Lang => "en");

// Hero copy shown until the API answers (same as the API defaults).
const HERO_FALLBACK = {
  en: {
    title: "Frequently Asked Questions",
    description:
      "Clear answers on company setup, corporate tax, VAT, accounting, audit and visas in Dubai and the UAE, from an FTA registered tax agency.",
  },
  ar: {
    title: "الأسئلة الشائعة",
    description:
      "إجابات واضحة حول تأسيس الشركات والضرائب والمحاسبة والتدقيق والتأشيرات في دبي والإمارات.",
  },
} as const;

const DEFAULT_HERO_IMAGE = "/img/banner/bg2.avif";

// Static text that is not part of the FAQ API.
const STATIC = {
  en: {
    categories: "FAQ categories",
    emptyText: "We are preparing helpful answers for this category.",
    loadError: "We couldn't load the questions right now. Please try again.",
  },
  ar: {
    categories: "فئات الأسئلة الشائعة",
    emptyText: "نقوم بإعداد إجابات مفيدة لهذه الفئة.",
    loadError: "تعذّر تحميل الأسئلة حالياً. يرجى المحاولة مرة أخرى.",
  },
} as const;

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

const Faq = () => {
  const router = useRouter();
  const lang = useLang();
  const s = STATIC[lang];

  const { data, isLoading, isError } = useGetFaqSectionQuery();

  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  // Only active categories/questions, in the order set in the admin panel.
  const categories = useMemo(
    () =>
      (data?.categories ?? [])
        .filter((c) => c.active)
        .sort(byOrder)
        .map((c) => ({
          ...c,
          questions: c.questions.filter((q) => q.active).sort(byOrder),
        })),
    [data],
  );

  const current = categories[Math.min(tab, categories.length - 1)];
  const items = current?.questions ?? [];

  const selectTab = (index: number) => {
    setTab(index);
    setOpen(0);
  };

  return (
    <>
      <Breadcrumb
        title={data?.title[lang] || HERO_FALLBACK[lang].title}
        subtitle={data?.description[lang] || HERO_FALLBACK[lang].description}
        image={data?.backgroundImage?.[lang]?.url || DEFAULT_HERO_IMAGE}
      />

      <section className="relative isolate bg-white py-16 sm:py-20 lg:py-24">
        {/* Background Image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/banner/bg1.avif')" }}
        />

        {/* White Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-white/85"
        />

        {/* Light Green Top Center Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-112.5"
          style={{
            background:
              "radial-gradient(ellipse 55% 75% at 50% 0%, rgba(61,220,110,0.15), transparent 75%)",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Category Navigation */}
          <div className="mb-10 flex justify-center">
            <div
              role="tablist"
              aria-label={s.categories}
              className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-gray-200/80 bg-white p-2 shadow-sm"
            >
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    className="h-10 w-28 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}

              {categories.map((c, i) => (
                <button
                  key={c._id}
                  type="button"
                  role="tab"
                  aria-selected={current?._id === c._id}
                  onClick={() => selectTab(i)}
                  className={`rounded-xl px-4 cursor-pointer py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 sm:text-sm ${
                    current?._id === c._id
                      ? "bg-[#15231a] text-white shadow-md shadow-black/10"
                      : "text-gray-600 hover:bg-[#3ddc6e]/10 hover:text-[#00852b]"
                  }`}
                >
                  {c.name[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="mx-auto max-w-4xl">
            {/* Category Title */}
            {data && (
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#25b957]">
                    {data?.exploreLabel[lang]}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-[#15231a] sm:text-2xl">
                    {current?.name[lang]}
                  </h3>
                </div>

                <span className="shrink-0 rounded-full border border-[#3ddc6e]/30 bg-[#3ddc6e]/10 px-3 py-1.5 text-xs font-semibold text-[#00852b]">
                  {items.length} {data?.questionsLabel[lang]}
                </span>
              </div>
            )}

            {/* Accordion */}
            <div className="space-y-3">
              {isError && (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center text-sm text-red-700"
                >
                  {s.loadError}
                </p>
              )}

              {isLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    aria-hidden="true"
                    className="h-18 animate-pulse rounded-2xl bg-gray-100"
                  />
                ))}

              {data && items.length === 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
                  <HiOutlineChatBubbleLeftRight className="mx-auto h-9 w-9 text-[#25b957]" />
                  <h4 className="mt-4 font-semibold text-gray-900">
                    {data?.emptyLabel[lang]}
                  </h4>
                  <p className="mt-2 text-sm text-gray-500">{s.emptyText}</p>
                </div>
              )}

              {items.map((item, i) => {
                const isOpen = open === i;

                return (
                  <div
                    key={item._id}
                    className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                      isOpen
                        ? "border-[#3ddc6e]/60 shadow-[0_8px_30px_rgba(21,35,26,0.07)]"
                        : "border-gray-200/80 shadow-sm hover:border-[#3ddc6e]/50 hover:shadow-md"
                    }`}
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center gap-3 px-4 py-5 text-start sm:gap-5 sm:px-6"
                    >
                      {/* Number */}
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors duration-300 ${
                          isOpen
                            ? "bg-[#3ddc6e] text-[#102116]"
                            : "bg-gray-100 text-gray-500 group-hover:bg-[#3ddc6e]/15 group-hover:text-[#00852b]"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Question */}
                      <span
                        className={`flex-1 text-sm font-semibold leading-6 transition-colors sm:text-base ${
                          isOpen ? "text-[#00852b]" : "text-[#18251c]"
                        }`}
                      >
                        {item.question[lang]}
                      </span>

                      {/* Toggle */}
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen
                            ? "rotate-180 bg-[#15231a] text-white"
                            : "bg-[#3ddc6e]/10 text-[#00852b] group-hover:bg-[#3ddc6e] group-hover:text-[#102116]"
                        }`}
                      >
                        {isOpen ? (
                          <HiOutlineMinus className="h-4 w-4" />
                        ) : (
                          <HiOutlinePlus className="h-4 w-4" />
                        )}
                      </span>
                    </button>

                    {/* Answer */}
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="ms-15 me-4 border-t border-gray-100 pb-5 pt-4 sm:ms-19.5 sm:me-6">
                          <p className="whitespace-pre-line text-sm leading-7 text-gray-600">
                            {item.answer[lang]}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Support CTA */}
            {data && (
              <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl bg-[#15231a] p-6 text-center text-white sm:flex-row sm:p-8 sm:text-start">
                <div>
                  <h3 className="text-lg font-bold sm:text-xl">
                    {data?.ctaTitle[lang]}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {data?.ctaDescription[lang]}
                  </p>
                </div>

                <ThemeBtn onClick={() => router.push("/contact")}>
                  {data?.ctaButton[lang]}
                </ThemeBtn>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq;
