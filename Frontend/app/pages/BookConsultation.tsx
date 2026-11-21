"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  FiHeadphones,
  FiClock,
  FiPhone,
  FiMail,
  FiCheckCircle,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ThemeBtn from "../components/ThemeBtn";
import Title from "../components/Title";

import { useLang } from "@/app/services/hooks/useLang";
import {
  useGetSiteSettingsQuery,
  type SettingsLocalized,
} from "@/app/store/api/siteSettingsApi";
import { useSubmitEnquiryMutation } from "@/app/store/api/enquiryApi";

/* ------------------------------ Data ------------------------------ */

type Lang = "en" | "ar";

const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  x: FaXTwitter,
} as const;

type SocialKey = keyof typeof SOCIAL_ICONS;

const SOCIAL_LABELS: Record<SocialKey, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  x: "X",
};

const LABELS: Record<
  Lang,
  {
    titleA: string;
    titleB: string;
    subtitle: string;
    watermark: string;
    panelEyebrow: string;
    panelTitle: string;
    panelText: string;
    officeHours: string;
    phone: string;
    email: string;
    contactError: string;
    followTitle: string;
    followText: string;
    formTitle: string;
    formText: string;
    fullName: string;
    fullNamePh: string;
    emailLabel: string;
    phoneLabel: string;
    phonePh: string;
    subject: string;
    subjectPh: string;
    message: string;
    messagePh: string;
    send: string;
    sending: string;
    sendFailed: string;
    thanksTitle: string;
    thanksText: string;
    sendAnother: string;
    confidential: string;
  }
> = {
  en: {
    titleA: "Need an Audit or",
    titleB: "Tax Advice?",
    subtitle:
      "    Speak to our team today. Your first consultation is free and\n            confidential.",
    watermark: "Ahmed Al Mazroei",
    panelEyebrow: "Get in touch",
    panelTitle: "We're here to help.",
    panelText: "Have a question or need expert advice? Reach out to our team.",
    officeHours: "Office hours",
    phone: "Phone",
    email: "Email",
    contactError: "Unable to load contact details right now.",
    followTitle: "Follow us",
    followText: "Stay connected with us",
    formTitle: "Send us an enquiry",
    formText: "Fill in your details and we'll get back to you.",
    fullName: "Full name",
    fullNamePh: "Your full name",
    emailLabel: "Email address",
    phoneLabel: "Phone number",
    phonePh: "Your phone number",
    subject: "Subject",
    subjectPh: "How can we help?",
    message: "Your message",
    messagePh: "Tell us about your requirements...",
    send: "Send Request",
    sending: "Sending...",
    sendFailed:
      "Sorry, your message could not be sent. Please check your details and try again.",
    thanksTitle: "Thank you for contacting us!",
    thanksText: "Our team will get back to you within one working day.",
    sendAnother: "Send another message",
    confidential: "Your information will be handled confidentially.",
  },
  ar: {
    titleA: "هل تحتاج إلى",
    titleB: "تدقيق أو استشارة ضريبية؟",
    subtitle: "تحدّث إلى فريقنا اليوم. الاستشارة الأولى مجانية وسرية.",
    watermark: "أحمد المزروعي",
    panelEyebrow: "تواصل معنا",
    panelTitle: "نحن هنا لمساعدتك.",
    panelText: "لديك سؤال أو تحتاج إلى استشارة خبير؟ تواصل مع فريقنا.",
    officeHours: "ساعات العمل",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    contactError: "تعذّر تحميل بيانات التواصل حالياً.",
    followTitle: "تابعنا",
    followText: "ابقَ على تواصل معنا",
    formTitle: "أرسل لنا استفساراً",
    formText: "أدخل بياناتك وسنعاود الاتصال بك.",
    fullName: "الاسم الكامل",
    fullNamePh: "اسمك الكامل",
    emailLabel: "البريد الإلكتروني",
    phoneLabel: "رقم الهاتف",
    phonePh: "رقم هاتفك",
    subject: "الموضوع",
    subjectPh: "كيف يمكننا مساعدتك؟",
    message: "رسالتك",
    messagePh: "أخبرنا بمتطلباتك...",
    send: "إرسال الطلب",
    sending: "جارٍ الإرسال...",
    sendFailed:
      "عذراً، تعذّر إرسال رسالتك. يرجى مراجعة بياناتك والمحاولة مرة أخرى.",
    thanksTitle: "شكراً لتواصلك معنا!",
    thanksText: "سيتواصل معك فريقنا خلال يوم عمل واحد.",
    sendAnother: "إرسال رسالة أخرى",
    confidential: "ستُعامل بياناتك بسرية تامة.",
  },
};

const EMPTY_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

/* ---------------------------- Helpers ----------------------------- */

/** Plain text from HTML (admin rich-text fields are saved as HTML). */
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

/** Plain text in the active language, falling back to the other one when empty. */
const pickText = (value: SettingsLocalized | undefined, lang: Lang) => {
  const other: Lang = lang === "en" ? "ar" : "en";
  return stripHtml(value?.[lang]) || stripHtml(value?.[other]);
};

const inputCls =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#00852B] focus:bg-white focus:ring-4 focus:ring-[#00852B]/10";

// Slides + fades its children in once, when they scroll into view.
const hidden = {
  up: "translate-y-10",
  left: "-translate-x-10",
  right: "translate-x-10",
};

function Reveal({
  children,
  from = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  from?: keyof typeof hidden;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out motion-reduce:transition-none ${
        shown
          ? "translate-x-0 translate-y-0 opacity-100"
          : `${hidden[from]} opacity-0`
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input required={required} className={inputCls} {...props} />
    </label>
  );
}

/* --------------------------- Component ---------------------------- */
const MARQUEE_TEXT = "ACCOUNTING • TAX • AUDIT • ";
const MARQUEE_SECONDS = 60;

export default function IndustriesWeServe() {
  const lang = useLang();
  const T = LABELS[lang];
  const isAr = lang === "ar";
  const { data, isLoading, isError } = useGetSiteSettingsQuery();
  const [submitEnquiry, { isLoading: sending }] = useSubmitEnquiryMutation();

  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);

  const officeHours = data ? pickText(data.officeHours, lang) : "";
  const phone = data?.phone?.trim() ?? "";
  const email = data?.email?.trim() ?? "";

  // Only show contact items that have a value in the settings.
  const info = [
    officeHours && { label: T.officeHours, value: officeHours, icon: FiClock },
    phone && {
      label: T.phone,
      value: phone,
      href: `tel:${phone.replace(/\s+/g, "")}`,
      icon: FiPhone,
    },
    email && {
      label: T.email,
      value: email,
      href: `mailto:${email}`,
      icon: FiMail,
    },
  ].filter(Boolean) as {
    label: string;
    value: string;
    href?: string;
    icon: typeof FiClock;
  }[];

  // Only show social links that have a URL in the settings.
  const socials = (Object.keys(SOCIAL_ICONS) as SocialKey[])
    .map((key) => ({
      key,
      label: SOCIAL_LABELS[key],
      icon: SOCIAL_ICONS[key],
      href: data?.socials?.[key]?.trim() ?? "",
    }))
    .filter((item) => !!item.href);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFailed(false);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setFailed(false);

    // Backend expects a country code and a 7-15 digit mobile number.
    const digits = form.phone.replace(/\D/g, "");
    const mobile =
      digits.startsWith("971") && digits.length > 9 ? digits.slice(3) : digits;

    try {
      await submitEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        countryCode: "+971",
        mobile,
        service: form.subject.trim() || "General Enquiry",
        requirements: form.message.trim() || "No additional details provided.",
        language: lang,
      }).unwrap();
      setForm(EMPTY_FORM);
      setSent(true);
    } catch {
      setFailed(true);
    }
  };

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative isolate w-full  bg-slate-50 px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-32"
    >
      {/* section background image + soft overlay */}
      <Image
        src="/img/banner/bg5.avif"
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-cover"
      />
      <div className="absolute inset-0 -z-20 bg-slate-50/85" />

      {/* light green gradient at the top */}
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-[#00852B]/20 via-[#00852B]/5 to-transparent" />

      {/* sliding background text */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 overflow-hidden"
      >
        <div
          style={{ animationDuration: `${MARQUEE_SECONDS}s` }}
          className="flex w-max animate-[slide_linear_infinite] whitespace-nowrap text-[180px] font-black leading-none text-black/4 motion-reduce:animate-none"
        >
          <span>{MARQUEE_TEXT.repeat(4)}</span>
          <span>{MARQUEE_TEXT.repeat(4)}</span>
        </div>
      </div>
      <style>{`@keyframes slide{to{transform:translateX(-50%)}}`}</style>

      {/* top curve: fill = colour of the section above */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-10 w-full overflow-visible lg:h-14"
      >
        <path d="M0 0H1440Q720 120 0 0Z" fill="#ffffff" />
        <path
          d="M0 0Q720 120 1440 0"
          fill="none"
          stroke="#00852B"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl">
        {/* heading */}
        <Title
          title={T.titleA}
          colorTitle={T.titleB}
          subtitle={T.subtitle}
          watermark={T.watermark}
        />

        {/* main card */}
        <div className="relative mt-10 isolate overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl shadow-slate-900/10 sm:rounded-[36px]">
          <Image
            src="/img/banner/1.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-slate-950/95 via-slate-950/75 to-purple-950/60" />

          <div className="relative grid gap-10 p-5 sm:p-8 md:p-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 lg:p-14">
            {/* form */}
            <Reveal from="left" className="min-w-0">
              <div className="rounded-2xl bg-white p-5 shadow-xl shadow-black/10 sm:rounded-3xl sm:p-7 lg:p-8">
                {sent ? (
                  <div role="status" className="py-10 text-center">
                    <FiCheckCircle
                      className="mx-auto h-12 w-12 text-[#00852B]"
                      aria-hidden="true"
                    />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                      {T.thanksTitle}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      {T.thanksText}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setFailed(false);
                      }}
                      className="mt-6 cursor-pointer text-sm font-semibold text-[#00852B] underline underline-offset-4"
                    >
                      {T.sendAnother}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit}>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {T.formTitle}
                    </h3>
                    <p className="mb-6 mt-1 text-sm text-slate-500">
                      {T.formText}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                      <div className="space-y-4">
                        <Field
                          label={T.fullName}
                          name="name"
                          autoComplete="name"
                          placeholder={T.fullNamePh}
                          value={form.name}
                          onChange={onChange}
                          disabled={sending}
                          required
                        />
                        <Field
                          label={T.emailLabel}
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={onChange}
                          disabled={sending}
                          required
                        />
                        <Field
                          label={T.phoneLabel}
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder={T.phonePh}
                          value={form.phone}
                          onChange={onChange}
                          disabled={sending}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-4">
                        <Field
                          label={T.subject}
                          name="subject"
                          placeholder={T.subjectPh}
                          value={form.subject}
                          onChange={onChange}
                          disabled={sending}
                        />
                        <label className="flex flex-1 flex-col">
                          <span className="mb-2 block text-xs font-semibold text-slate-600">
                            {T.message}
                          </span>
                          <textarea
                            name="message"
                            placeholder={T.messagePh}
                            value={form.message}
                            onChange={onChange}
                            disabled={sending}
                            className={`${inputCls} min-h-36 flex-1 resize-y`}
                          />
                        </label>
                      </div>
                    </div>

                    {failed && (
                      <p role="alert" className="mt-4 text-sm text-rose-600">
                        {T.sendFailed}
                      </p>
                    )}

                    <ThemeBtn
                      type="submit"
                      className="mt-4 w-full"
                      disabled={sending}
                      aria-busy={sending}
                    >
                      {sending ? T.sending : T.send}
                    </ThemeBtn>
                    <p className="mt-4 text-center text-xs text-slate-400">
                      {T.confidential}
                    </p>
                  </form>
                )}
              </div>
            </Reveal>

            {/* contact panel */}
            <Reveal from="right" delay={150} className="min-w-0 self-center">
              <aside className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl sm:p-8 lg:p-7 xl:p-8">
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-[#4ade80]">
                  <FiHeadphones className="h-7 w-7" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4ade80] rtl:tracking-normal rtl:normal-case">
                  {T.panelEyebrow}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {T.panelTitle}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {T.panelText}
                </p>

                <div className="my-7 h-px bg-white/15" />

                {isError && (
                  <p role="alert" className="text-sm text-slate-300">
                    {T.contactError}
                  </p>
                )}

                {isLoading && (
                  <ul aria-busy="true" className="space-y-6">
                    {[0, 1, 2].map((i) => (
                      <li key={i} className="flex gap-4">
                        <span
                          aria-hidden="true"
                          className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-white/10"
                        />
                        <div className="w-full space-y-2 pt-1">
                          <span
                            aria-hidden="true"
                            className="block h-2.5 w-1/3 animate-pulse rounded bg-white/10"
                          />
                          <span
                            aria-hidden="true"
                            className="block h-3.5 w-4/5 animate-pulse rounded bg-white/10"
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {!isLoading && !isError && (
                  <ul className="space-y-6">
                    {info.map(({ label, value, href, icon: Icon }) => (
                      <li key={label} className="flex min-w-0 gap-4">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-[#4ade80]">
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 rtl:tracking-normal rtl:normal-case">
                            {label}
                          </p>
                          {href ? (
                            <Link
                              href={href}
                              dir="ltr"
                              className="mt-1 block text-start wrap-break-word text-sm font-medium text-white transition hover:text-[#4ade80]"
                            >
                              {value}
                            </Link>
                          ) : (
                            <p className="mt-1 text-sm font-medium">{value}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {socials.length > 0 && (
                  <>
                    <div className="my-7 h-px bg-white/15" />

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-start">
                        <p className="text-sm font-semibold">{T.followTitle}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {T.followText}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {socials.map(({ key, label, icon: Icon, href }) => (
                          <a
                            key={key}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-sm transition hover:border-[#00852B] hover:bg-[#00852B]"
                          >
                            <Icon />
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </aside>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
