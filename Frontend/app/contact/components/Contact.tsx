"use client";

import ThemeBtn from "@/app/components/ThemeBtn";
import React, { useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiFileText,
  FiHeadphones,
  FiLayers,
  FiMail,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import { useGetContactContentQuery } from "@/app/store/api/contactContentApi";
import { useSubmitEnquiryMutation } from "@/app/store/api/enquiryApi";
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
    submitError:
      "Sorry, your message could not be sent. Please check your details and try again.",
    sending: "Sending...",
  },
  ar: {
    loadError: "تعذّر تحميل هذا المحتوى حالياً.",
    retry: "حاول مرة أخرى",
    submitError:
      "عذراً، تعذّر إرسال رسالتك. يرجى مراجعة بياناتك والمحاولة مرة أخرى.",
    sending: "جارٍ الإرسال...",
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

/* ----------------------------- UI options ----------------------------- */
// Form options are UI, not page content.

const FEATURE_ICONS: Record<string, React.ElementType> = {
  headphones: FiHeadphones,
  clock: FiClock,
  users: FiUsers,
  shield: FiShield,
};

const SERVICES = [
  "Audit & Assurance",
  "Tax Services",
  "Advisory Services",
  "Consulting Services",
  "Accounting & Other Services",
  "Other Enquiries",
];

const CODES = [
  "+971",
  "+966",
  "+974",
  "+968",
  "+973",
  "+965",
  "+91",
  "+92",
  "+44",
  "+1",
];

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  code: "+971",
  phone: "",
  service: "",
  message: "",
};

const input =
  "w-full rounded-lg border border-white/15 bg-white/5 py-3 text-sm text-white outline-none transition placeholder:text-white/50 focus:border-[#3ddc6e] [&>option]:bg-black";

type FieldProps = {
  icon: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

// Input wrapper with a leading icon
const Field = ({ icon: Icon, className = "", children }: FieldProps) => (
  <div className={`relative ${className}`}>
    <Icon
      aria-hidden="true"
      className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-white/60"
    />
    {children}
  </div>
);

/* ---------------------------- Component ----------------------------- */

const Contact = () => {
  const lang = useLang();
  const t = UI[lang];
  const { data, isLoading, isError, refetch } = useGetContactContentQuery();

  const [submitEnquiry, { isLoading: isSubmitting }] =
    useSubmitEnquiryMutation();

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);

  const bgImage = data ? pickMediaUrl(data.sectionBgImage, lang) : "";
  const features = data ? activeSorted(data.features) : [];

  const badge = data ? pickPlain(data.sectionBadge, lang) : "";
  const title = data ? pickPlain(data.sectionTitle, lang) : "";
  const highlight = data ? pickPlain(data.sectionHighlight, lang) : "";
  const description = data ? pickPlain(data.sectionDescription, lang) : "";
  const note = data ? pickPlain(data.sectionNote, lang) : "";
  const formTitle = data ? pickPlain(data.formTitle, lang) : "";
  const formDescription = data ? pickPlain(data.formDescription, lang) : "";
  const formDisclaimer = data ? pickPlain(data.formDisclaimer, lang) : "";

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSubmitted(false);
    setSubmitFailed(false);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setSubmitFailed(false);
    try {
      // POST /enquiries. Fields map to the backend's createEnquirySchema.
      await submitEnquiry({
        name: form.name.trim(),
        companyName: form.company.trim(),
        email: form.email.trim(),
        countryCode: form.code,
        mobile: form.phone.replace(/\D/g, ""),
        service: form.service,
        requirements: form.message.trim(),
        language: lang,
      }).unwrap();
      setSubmitted(true);
    } catch {
      setSubmitFailed(true);
    }
  };

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative w-full  bg-white py-12 sm:py-16 lg:py-20"
    >
      {/* section background (only when uploaded) + white wash + top/bottom fades */}
      {bgImage && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-white/60" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white to-transparent sm:h-32"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white to-transparent sm:h-32"
      />

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl border border-[#3ddc6e]/30 bg-white/90 p-5 shadow-sm sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:p-10">
          {/* Left: copy + features */}
          <div>
            {isError ? (
              <ContentError
                message={t.loadError}
                retryLabel={t.retry}
                onRetry={() => refetch()}
              />
            ) : (
              <>
                {isLoading ? (
                  <Skeleton className="h-6 w-36 rounded-full" />
                ) : (
                  badge && (
                    <span className="inline-block rounded-full bg-[#3ddc6e] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-black">
                      {badge}
                    </span>
                  )
                )}

                {isLoading ? (
                  <div className="mt-4 space-y-3">
                    <Skeleton className="h-10 w-4/5" />
                    <Skeleton className="h-10 w-3/5" />
                  </div>
                ) : (
                  (title || highlight) && (
                    <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                      {title}
                      {title && highlight && <br />}
                      {highlight && (
                        <span className="text-[#00852B]">{highlight}</span>
                      )}
                    </h2>
                  )
                )}

                {isLoading ? (
                  <div className="mt-5 max-w-lg space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-11/12" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                ) : (
                  description && (
                    <p className="mt-5 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
                      {description}
                    </p>
                  )
                )}

                {isLoading ? (
                  <Skeleton className="mt-3 h-4 w-52" />
                ) : (
                  note && (
                    <p className="mt-3 text-sm font-bold text-gray-900">
                      {note}
                    </p>
                  )
                )}

                <ul className="mt-8 space-y-5">
                  {isLoading &&
                    Array.from({ length: 3 }).map((_, i) => (
                      <li key={i} className="flex items-start gap-6">
                        <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                        <div className="w-full space-y-2">
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-3 w-4/5" />
                        </div>
                      </li>
                    ))}

                  {!isLoading &&
                    features.map((feature) => {
                      const Icon = FEATURE_ICONS[feature.icon] ?? FiShield;
                      return (
                        <li
                          key={feature._id ?? feature.icon}
                          className="mb-10 flex items-start gap-6"
                        >
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#3ddc6e] text-black">
                            <Icon className="h-5 w-5" aria-hidden="true" />
                          </span>
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">
                              {pickPlain(feature.title, lang)}
                            </h3>
                            <p className="mt-0.5 text-sm text-gray-600">
                              {pickPlain(feature.description, lang)}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </>
            )}
          </div>

          {/* Right: dark form card (form fields are UI, content above is from the API) */}
          <div className="rounded-2xl border border-[#3ddc6e]/40 bg-linear-to-b from-[#0d0d12] to-black p-5 text-white shadow-xl sm:p-6">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton tone="dark" className="h-7 w-3/4" />
                <Skeleton tone="dark" className="h-3 w-full" />
              </div>
            ) : (
              <>
                {formTitle && (
                  <h3 className="text-xl font-bold sm:text-2xl">{formTitle}</h3>
                )}
                {formDescription && (
                  <p className="mt-1.5 text-xs leading-5 text-white/80">
                    {formDescription}
                  </p>
                )}
              </>
            )}
            <hr className="my-4 border-white/10" />

            {submitted ? (
              <div role="status" className="py-8 text-center">
                <FiCheckCircle
                  className="mx-auto h-10 w-10 text-[#3ddc6e]"
                  aria-hidden="true"
                />
                <h4 className="mt-3 text-lg font-bold">
                  Thank you for contacting us!
                </h4>
                <p className="mt-2 text-sm text-white/80">
                  Our team will get back to you within one working day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(EMPTY_FORM);
                    setSubmitted(false);
                  }}
                  className="mt-4 cursor-pointer text-sm font-semibold text-[#3ddc6e] underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field icon={FiUser}>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your Name"
                      aria-label="Your name"
                      value={form.name}
                      onChange={onChange}
                      required
                      className={`${input} pl-10 pr-3`}
                    />
                  </Field>
                  <Field icon={FiBriefcase}>
                    <input
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Company Name"
                      aria-label="Company name"
                      value={form.company}
                      onChange={onChange}
                      className={`${input} pl-10 pr-3`}
                    />
                  </Field>

                  <Field icon={FiMail}>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
                      aria-label="Email"
                      value={form.email}
                      onChange={onChange}
                      required
                      className={`${input} pl-10 pr-3`}
                    />
                  </Field>
                  <div className="grid grid-cols-[5.5rem_1fr] gap-3">
                    <select
                      name="code"
                      aria-label="Country code"
                      value={form.code}
                      onChange={onChange}
                      className={`${input} px-3`}
                    >
                      {CODES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel-national"
                      placeholder="Mobile"
                      aria-label="Mobile number"
                      value={form.phone}
                      onChange={onChange}
                      className={`${input} px-3`}
                    />
                  </div>
                </div>

                <Field icon={FiLayers}>
                  <select
                    name="service"
                    aria-label="Service needed"
                    value={form.service}
                    onChange={onChange}
                    required
                    className={`${input} appearance-none pl-10 pr-10 ${
                      form.service === "" ? "text-white/50" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select Service
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-white/60"
                  />
                </Field>

                <Field icon={FiFileText}>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Describe Briefly Your Requirements?"
                    aria-label="Your requirements"
                    value={form.message}
                    onChange={onChange}
                    required
                    className={`${input} resize-y pl-10 pr-3`}
                  />
                </Field>

                {submitFailed && (
                  <p role="alert" className="text-sm text-red-300">
                    {t.submitError}
                  </p>
                )}

                <ThemeBtn
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? t.sending : "Send Message"}
                </ThemeBtn>

                {formDisclaimer && (
                  <p className="flex items-center justify-center gap-1.5 text-xs text-white/70">
                    <FiShield
                      aria-hidden="true"
                      className="h-3.5 w-3.5 text-[#3ddc6e]"
                    />
                    {formDisclaimer}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
