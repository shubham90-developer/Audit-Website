"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FiArrowUpRight, FiMail, FiPhone } from "react-icons/fi";

import Breadcrumb from "@/app/components/Breadcrumb";
import { useLang } from "@/app/services/hooks/useLang";
import { useGetLegalPageQuery } from "@/app/store/api/legalPageApi";
import { useGetSiteSettingsQuery } from "@/app/store/api/siteSettingsApi";

const DEFAULT_HERO_IMAGE = "/img/banner/bg2.avif";

// Shown until the API answers, and if it fails.
const FALLBACK = {
  "privacy-policy": {
    en: {
      title: "Privacy Policy",
      description:
        "Learn how we collect, use, protect, and manage your personal information when you visit our website or use our services.",
    },
    ar: {
      title: "سياسة الخصوصية",
      description:
        "تعرف على كيفية جمع معلوماتك الشخصية واستخدامها وحمايتها وإدارتها.",
    },
  },
  "terms-and-conditions": {
    en: {
      title: "Terms & Conditions",
      description:
        "Review the terms and conditions that govern your use of our website, services, and business engagements with us.",
    },
    ar: {
      title: "الشروط والأحكام",
      description: "يرجى مراجعة الشروط التي تحكم استخدام موقعنا وخدماتنا.",
    },
  },
} as const;

// Static UI text that is not part of the legal-pages API.
const STATIC = {
  en: {
    onThisPage: "ON THIS PAGE",
    navLabel: "Page sections",
    lastUpdated: "Last updated",
    ctaTitle: "Questions about this page?",
    ctaText: "Our team is happy to help.",
    email: "Email Us",
    call: "Call Us",
    loadError: "We couldn't load this page right now. Please try again.",
  },
  ar: {
    onThisPage: "في هذه الصفحة",
    navLabel: "أقسام الصفحة",
    lastUpdated: "آخر تحديث",
    ctaTitle: "هل لديك أسئلة حول هذه الصفحة؟",
    ctaText: "فريقنا سعيد بمساعدتك.",
    email: "راسلنا",
    call: "اتصل بنا",
    loadError: "تعذّر تحميل هذه الصفحة حالياً. يرجى المحاولة مرة أخرى.",
  },
} as const;

const proseCls =
  "mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px]";

const Skeleton = () => (
  <div aria-hidden="true" className="space-y-10">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="h-7 w-2/3 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-gray-100" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
      </div>
    ))}
  </div>
);

const formatDate = (iso: string, lang: "en" | "ar") => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(lang === "ar" ? "ar-AE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const KIND = "terms-and-conditions" as const;

const Terms = () => {
  const kind = KIND;
  const lang = useLang();
  const s = STATIC[lang];
  const fallback = FALLBACK[kind][lang];

  const { data, isLoading, isError } = useGetLegalPageQuery(kind);
  const { data: settings } = useGetSiteSettingsQuery();

  const email = settings?.email;
  const phone = settings?.phone;
  const phoneHref = phone ? `tel:${phone.replace(/\s/g, "")}` : "";

  // Sections in the order set in the admin panel.
  const sections = useMemo(
    () => [...(data?.sections ?? [])].sort((a, b) => a.order - b.order),
    [data],
  );

  const updated = data?.updatedAt ? formatDate(data.updatedAt, lang) : "";

  return (
    <>
      <Breadcrumb
        title={data?.heroTitle[lang] || fallback.title}
        subtitle={data?.heroDescription[lang] || fallback.description}
        image={data?.heroImage?.[lang]?.url || DEFAULT_HERO_IMAGE}
      />

      <main
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="relative isolate bg-white py-14 sm:py-20 lg:py-24"
      >
        {/* Background image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/banner/services.avif')" }}
        />
        {/* Soft white wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-white/80"
        />
        {/* Green glow, top center */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-112.5"
          style={{
            background:
              "radial-gradient(ellipse 55% 75% at 50% 0%, rgba(61,220,110,0.22), transparent 75%)",
          }}
        />

        <section className="px-5 py-14 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-4 lg:gap-12">
            {/* Table of contents */}
            <aside className="lg:col-span-1">
              <nav
                aria-label={s.navLabel}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_24px_-16px_rgba(15,23,42,0.18)] lg:sticky lg:top-24"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                  {data?.sidebarTitle[lang] || s.onThisPage}
                </p>

                <ol className="mt-4 space-y-1">
                  {isLoading &&
                    Array.from({ length: 6 }).map((_, i) => (
                      <li
                        key={i}
                        aria-hidden="true"
                        className="h-8 animate-pulse rounded-lg bg-gray-100"
                      />
                    ))}

                  {sections.map((section, i) => (
                    <li key={section._id ?? i}>
                      <Link
                        href={`#section-${i + 1}`}
                        className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-green-50 hover:text-green-700"
                      >
                        <span className="w-5 shrink-0 font-semibold text-green-600">
                          {i + 1}.
                        </span>
                        <span>{section.title[lang]}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            {/* Policy body */}
            <div className="lg:col-span-3">
              <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-white p-6 shadow-[0_20px_70px_-35px_rgba(21,128,61,0.28)] sm:p-10">
                <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#3ddc6e] via-green-500 to-emerald-300" />

                {isError && (
                  <p
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center text-sm text-red-700"
                  >
                    {s.loadError}
                  </p>
                )}

                {isLoading && <Skeleton />}

                {data && (
                  <>
                    {updated && (
                      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-green-700">
                        {s.lastUpdated}: {updated}
                      </p>
                    )}

                    {data.intro[lang] && (
                      <p className="whitespace-pre-line text-sm leading-7 text-slate-600 sm:text-[15px]">
                        {data.intro[lang]}
                      </p>
                    )}

                    <div className="mt-8 divide-y divide-green-100">
                      {sections.map((section, i) => (
                        <section
                          key={section._id ?? i}
                          id={`section-${i + 1}`}
                          className="scroll-mt-28 py-8 first:pt-0 last:pb-0"
                        >
                          <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-sm font-bold text-green-700">
                              {i + 1}
                            </span>
                            {section.title[lang]}
                          </h2>

                          <div className={proseCls}>
                            {section.body[lang] && (
                              <p className="whitespace-pre-line">
                                {section.body[lang]}
                              </p>
                            )}

                            {section.bullets.length > 0 && (
                              <ul className="list-disc space-y-2 ps-5 marker:text-[#3ddc6e]">
                                {section.bullets.map((b, bi) => (
                                  <li key={bi}>{b[lang]}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </section>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Contact strip (email / phone come from the site settings) */}
              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-green-300 bg-green-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {s.ctaTitle}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {s.ctaText}
                  </p>
                </div>

                {(email || phone) && (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3ddc6e] px-5 py-3 text-sm font-semibold text-[#0d100e] shadow-lg shadow-green-500/25 transition hover:-translate-y-0.5 hover:bg-[#2fc75f]"
                      >
                        <FiMail size={16} />
                        {s.email}
                        <FiArrowUpRight size={15} />
                      </a>
                    )}
                    {phone && (
                      <a
                        href={phoneHref}
                        dir="ltr"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-green-500"
                      >
                        <FiPhone size={16} />
                        {s.call}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Terms;
