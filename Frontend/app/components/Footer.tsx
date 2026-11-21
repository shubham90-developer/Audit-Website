"use client";

import Image from "next/image";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  FiBriefcase,
  FiChevronRight,
  FiClock,
  FiFileText,
  FiHome,
  FiInfo,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
} from "react-icons/fi";
import { LuFileQuestion } from "react-icons/lu";
import Logo from "./Logo";

import { useLang } from "@/app/services/hooks/useLang";
import { slugify } from "@/app/services/utils/service";
import {
  useGetSiteSettingsQuery,
  type SettingsLocalized,
} from "@/app/store/api/siteSettingsApi";
import { useGetServicesQuery } from "@/app/store/api/servicesApi";

/* ------------------------------ Data ------------------------------ */

type Lang = "en" | "ar";

type LinkItem = { key: string; label: string; href: string; icon?: IconType };

const LABELS: Record<
  Lang,
  {
    links: {
      home: string;
      about: string;
      services: string;
      faq: string;
      insights: string;
      contact: string;
    };
    privacy: string;
    terms: string;
    watermark: string;
    servicesError: string;
    servicesEmpty: string;
  }
> = {
  en: {
    links: {
      home: "Home",
      about: "About Us",
      services: "Services",
      faq: "FAQ's",
      insights: "Insights",
      contact: "Contact Us",
    },
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
    watermark: "Ahmed Al Mazroei",
    servicesError: "Unable to load services right now.",
    servicesEmpty: "No services yet.",
  },
  ar: {
    links: {
      home: "الرئيسية",
      about: "من نحن",
      services: "الخدمات",
      faq: "الأسئلة الشائعة",
      insights: "المستجدات",
      contact: "اتصل بنا",
    },
    privacy: "سياسة الخصوصية",
    terms: "الشروط والأحكام",
    watermark: "أحمد المزروعي",
    servicesError: "تعذّر تحميل الخدمات حالياً.",
    servicesEmpty: "لا توجد خدمات بعد.",
  },
};

const SOCIAL_ICONS = {
  linkedin: FaLinkedinIn,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  x: FaXTwitter,
} as const;

type SocialKey = keyof typeof SOCIAL_ICONS;

const SOCIAL_LABELS: Record<SocialKey, string> = {
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  x: "X",
};

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

/* ------------------------- Small parts ------------------------- */

const SectionTitle = ({ children }: { children: string }) => (
  <div className="mb-5">
    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-green-400 rtl:normal-case rtl:tracking-normal">
      {children}
    </h3>
    <span className="mt-2 block h-px w-8 bg-green-400" />
  </div>
);

const LinkList = ({ items }: { items: LinkItem[] }) => (
  <ul className="divide-y divide-white/10 border-y border-white/10">
    {items.map(({ key, label, href, icon: Icon }) => (
      <li key={key}>
        <Link
          href={href}
          className="group flex items-center gap-3 py-3 text-sm text-slate-300 transition hover:text-green-400"
        >
          {Icon && <Icon className="h-4 w-4 shrink-0 text-green-400" />}
          <span className="flex-1">{label}</span>
          <FiChevronRight className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-green-400 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
        </Link>
      </li>
    ))}
  </ul>
);

const ListSkeleton = () => (
  <ul aria-busy="true" className="space-y-3">
    {[0, 1, 2, 3].map((i) => (
      <li
        key={i}
        aria-hidden="true"
        className="h-4 w-3/4 animate-pulse rounded bg-white/10"
      />
    ))}
  </ul>
);

/* --------------------------- Component ---------------------------- */

const Footer = () => {
  const lang = useLang();
  const T = LABELS[lang];
  const { data, isLoading: settingsLoading } = useGetSiteSettingsQuery();
  const {
    data: servicesData,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useGetServicesQuery();
  const services = servicesData ?? [];

  const text = (value?: SettingsLocalized) =>
    data ? pickText(value, lang) : "";

  const description = text(data?.footerDescription);
  const copyright = text(data?.copyright);
  const quickLinksTitle = text(data?.footerQuickLinksTitle);
  const servicesTitle = text(data?.footerServicesTitle);
  const contactTitle = text(data?.footerContactTitle);
  const address = text(data?.address);
  const officeHours = text(data?.officeHours);
  const phone = data?.phone?.trim() ?? "";
  const email = data?.email?.trim() ?? "";
  const footerLogo = data?.footerLogo?.url ?? "";
  const companyName = text(data?.companyName);

  // Only show contact items that have a value in the settings.
  const contacts = [
    address && { key: "address", icon: FiMapPin, value: address },
    phone && {
      key: "phone",
      icon: FiPhone,
      value: phone,
      href: `tel:${phone.replace(/\s+/g, "")}`,
    },
    email && {
      key: "email",
      icon: FiMail,
      value: email,
      href: `mailto:${email}`,
    },
    officeHours && { key: "hours", icon: FiClock, value: officeHours },
  ].filter(Boolean) as {
    key: string;
    icon: IconType;
    value: string;
    href?: string;
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

  const quickLinks: LinkItem[] = [
    { key: "home", label: T.links.home, href: "/", icon: FiHome },
    { key: "about", label: T.links.about, href: "/about", icon: FiInfo },
    {
      key: "services",
      label: T.links.services,
      href: "/services",
      icon: FiBriefcase,
    },
    { key: "faq", label: T.links.faq, href: "/faq", icon: LuFileQuestion },
    {
      key: "insights",
      label: T.links.insights,
      href: "/news",
      icon: FiFileText,
    },
    {
      key: "contact",
      label: T.links.contact,
      href: "/contact",
      icon: FiMessageSquare,
    },
  ];

  const serviceItems: LinkItem[] = services.map((service) => ({
    key: service._id,
    label: pickText(service.title, lang),
    href: `/services/${slugify(service.title.en)}/${service._id}`,
  }));

  return (
    <footer
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="relative isolate  bg-[#090b10] text-slate-300"
    >
      {/* soft green glow + top line */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-[70%] -translate-x-1/2 rounded-full bg-[#00852B]/15 blur-[130px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#00852B] to-transparent" />

      <div className="mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-10 lg:pt-20">
        {/* CTA card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#00852B] shadow-[0_0_40px_rgba(0,133,43,0.25)]">
          <Image
            src="/img/banner/1.jpg"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-r from-black via-black/85 to-black/40" />
        </div>

        {/* columns */}
        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-white/10">
          {/* brand + contact */}
          <div className="lg:pe-10">
            {footerLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={footerLogo}
                alt={companyName}
                className="h-auto max-h-16 w-auto object-contain"
              />
            ) : (
              <Logo />
            )}

            {description && (
              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                {description}
              </p>
            )}

            {contactTitle && (
              <div className="mt-8">
                <SectionTitle>{contactTitle}</SectionTitle>
              </div>
            )}

            {settingsLoading && (
              <div className="mt-6">
                <ListSkeleton />
              </div>
            )}

            {!settingsLoading && (
              <ul className="mt-6 space-y-4">
                {contacts.map(({ key, icon: Icon, value, href }) => (
                  <li key={key} className="flex items-start gap-3 text-sm">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    {href ? (
                      <a
                        href={href}
                        dir="ltr"
                        className="text-start transition hover:text-green-400"
                      >
                        {value}
                      </a>
                    ) : (
                      <span>{value}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {socials.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {socials.map(({ key, label, icon: Icon, href }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-[#00852B] text-xs text-green-400 transition hover:bg-[#00852B] hover:text-white"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* quick links */}
          <div className="lg:px-10">
            {quickLinksTitle && <SectionTitle>{quickLinksTitle}</SectionTitle>}
            <LinkList items={quickLinks} />
          </div>

          {/* services */}
          <div className="lg:ps-10">
            {servicesTitle && <SectionTitle>{servicesTitle}</SectionTitle>}
            {servicesLoading && <ListSkeleton />}
            {!servicesLoading && servicesError && (
              <p role="alert" className="text-sm text-slate-400">
                {T.servicesError}
              </p>
            )}
            {!servicesLoading &&
              !servicesError &&
              serviceItems.length === 0 && (
                <p className="text-sm text-slate-400">{T.servicesEmpty}</p>
              )}
            {!servicesLoading && !servicesError && serviceItems.length > 0 && (
              <LinkList items={serviceItems} />
            )}
          </div>
        </div>

        {/* watermark */}
        <p
          aria-hidden="true"
          className="mt-14 select-none overflow-hidden whitespace-nowrap border-t border-white/10 pt-6 text-center text-[clamp(1rem,9vw,8rem)] font-extrabold uppercase leading-none tracking-tight text-white/5"
        >
          {T.watermark}
        </p>

        {/* bottom bar */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          {copyright && <p>{copyright}</p>}
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="transition hover:text-green-400"
            >
              {T.privacy}
            </Link>
            <Link href="/terms" className="transition hover:text-green-400">
              {T.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
