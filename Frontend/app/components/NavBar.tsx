"use client";

import {
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsWhatsapp } from "react-icons/bs";
import {
  FiArrowUpRight,
  FiArrowRight,
  FiChevronDown,
  FiX,
  FiShield,
  FiFileText,
  FiAward,
  FiClock,
  FiHeadphones,
  FiCalendar,
} from "react-icons/fi";
import Logo from "./Logo";

import { useLang } from "@/app/services/hooks/useLang";
import { slugify } from "@/app/services/utils/service";
import {
  useGetBlogSectionQuery,
  type BlogArticle,
  type BlogLocalizedMedia,
  type BlogSection,
} from "@/app/store/api/blogApi";
import {
  useGetServicesQuery,
  type LocalizedMedia,
  type Service,
} from "@/app/store/api/servicesApi";

/* ------------------------------ DATA ------------------------------ */

// Brand palette: change colors here only (same as the banner).
const BRAND = {
  "--green": "#00852B",
  "--red": "#F20D18",
  "--gold": "#fab923",
} as CSSProperties;

const whatsapp = "https://wa.me/971521786209";

/** Slug of the blog category that holds press releases (same as the press module). */
const PRESS_CATEGORY_SLUG = "press-releases";

type Lang = "en" | "ar";
type NavKey = "home" | "about" | "services" | "faq" | "insights" | "contact";

type Labels = {
  links: Record<NavKey, string>;
  chat: string;
  chatWhatsApp: string;
  openMenu: string;
  closeMenu: string;
  chooseService: string;
  viewAllServices: string;
  viewAllBlogs: string;
  needHelp: string;
  bookCall: string;
  loading: string;
  servicesError: string;
  servicesEmpty: string;
  blogsError: string;
  blogsEmpty: string;
  blogsTitle: string;
  readMore: string;
  trust: string[][];
};

const LABELS: Record<Lang, Labels> = {
  en: {
    links: {
      home: "Home",
      about: "About Us",
      services: "Services",
      faq: "FAQ's",
      insights: "Insights",
      contact: "Contact Us",
    },
    chat: "Chat with us anytime",
    chatWhatsApp: "Chat on WhatsApp",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    chooseService: "Choose Service",
    viewAllServices: "View All Services",
    viewAllBlogs: "View all blogs",
    needHelp: "Need help choosing?",
    bookCall: "Book Free 20-Min Call",
    loading: "Loading...",
    servicesError: "Unable to load services right now.",
    servicesEmpty: "No services yet.",
    blogsError: "Unable to load blogs right now.",
    blogsEmpty: "No blogs yet.",
    blogsTitle: "Blogs",
    readMore: "Read more",
    trust: [
      ["FTA Approved", "Tax Agency"],
      ["25+ Years of Experience"],
      ["Industry Leading", "Response Time"],
    ],
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
    chat: "تواصل معنا في أي وقت",
    chatWhatsApp: "تواصل عبر واتساب",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    chooseService: "اختر الخدمة",
    viewAllServices: "عرض جميع الخدمات",
    viewAllBlogs: "عرض جميع المقالات",
    needHelp: "تحتاج مساعدة في الاختيار؟",
    bookCall: "احجز مكالمة مجانية لمدة 20 دقيقة",
    loading: "جارٍ التحميل...",
    servicesError: "تعذّر تحميل الخدمات حالياً.",
    servicesEmpty: "لا توجد خدمات بعد.",
    blogsError: "تعذّر تحميل المقالات حالياً.",
    blogsEmpty: "لا توجد مقالات بعد.",
    blogsTitle: "المقالات",
    readMore: "اقرأ المزيد",
    trust: [
      ["معتمدون من", "الهيئة الاتحادية للضرائب"],
      ["25+ سنة من الخبرة"],
      ["استجابة سريعة", "على مستوى الصناعة"],
    ],
  },
};

const NAV_LINKS: {
  key: NavKey;
  href: string;
  menu?: "services" | "insights";
}[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services", menu: "services" },
  { key: "faq", href: "/faq" },
  { key: "insights", href: "/news", menu: "insights" },
  { key: "contact", href: "/contact" },
];

const TRUST_ICONS = [FiShield, FiAward, FiClock];

type InsightItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  media: string;
};
type Insights = { blogs: InsightItem[] };

/* ---------------------------- API HELPERS ---------------------------- */

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
const pickText = (
  value: { en: string; ar: string } | undefined,
  lang: Lang,
) => {
  const other: Lang = lang === "en" ? "ar" : "en";
  return stripHtml(value?.[lang]) || stripHtml(value?.[other]);
};

/** Blog image URL (single object per language), other language as fallback. */
const pickBlogMedia = (media: BlogLocalizedMedia | undefined, lang: Lang) => {
  const other: Lang = lang === "en" ? "ar" : "en";
  return media?.[lang]?.url || media?.[other]?.url || "";
};

/** Service image URL (array per language), other language as fallback. */
const pickServiceMedia = (media: LocalizedMedia | undefined, lang: Lang) => {
  const other: Lang = lang === "en" ? "ar" : "en";
  return (
    media?.[lang]?.find((m) => m.url)?.url ||
    media?.[other]?.find((m) => m.url)?.url ||
    ""
  );
};

/** Localized date, e.g. "31 Oct 2026" (UAE time). */
const formatDate = (iso: string, lang: Lang) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(lang === "ar" ? "ar-AE" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dubai",
  }).format(date);
};

/** Builds the blog list from the blog section (published articles only, press excluded). */
const buildInsights = (
  section: BlogSection | undefined,
  lang: Lang,
): Insights => {
  if (!section) return { blogs: [] };

  const activeCategories = section.categories.filter((c) => c.active);
  const blogIds = new Set(
    activeCategories
      .filter((c) => c.slug !== PRESS_CATEGORY_SLUG)
      .map((c) => c._id),
  );

  const published = section.articles
    .filter((a) => a.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  const toItem = (article: BlogArticle): InsightItem => ({
    id: article._id,
    slug: article.slug,
    title: pickText(article.title, lang),
    excerpt: pickText(article.excerpt, lang),
    date: formatDate(article.publishedAt, lang),
    media:
      pickBlogMedia(article.cardImage, lang) ||
      pickBlogMedia(article.mainImage, lang),
  });

  return {
    blogs: published.filter((a) => blogIds.has(a.categoryId)).map(toItem),
  };
};

/* --------------------------- SMALL PIECES --------------------------- */

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-3">
    <span className="h-0.5 w-6 bg-(--red)" />
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--green)">
      {children}
    </span>
  </div>
);

// Image with an empty grey box while no image is set (no fallback picture).
const Media = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  if (!src) {
    return (
      <div
        aria-hidden="true"
        className={`h-full w-full bg-black/5 ${className}`}
      />
    );
  }
  const hide = (e: SyntheticEvent<HTMLImageElement>) =>
    (e.currentTarget.style.visibility = "hidden");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={hide}
      className={`h-full w-full object-cover ${className}`}
    />
  );
};

// White panel with a brand-color strip on top
const Panel = ({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={`relative overflow-hidden rounded-2xl border border-black/10 bg-white text-[#111] shadow-[0_20px_60px_rgba(0,0,0,0.15)] ${className}`}
  >
    <div className="h-1 bg-linear-to-r from-(--green) via-(--gold) to-(--red)" />
    {children}
  </div>
);

/* ------------------------- DESKTOP: SERVICES ------------------------- */

function ServicesMega({
  services,
  isLoading,
  isError,
  lang,
  L,
  onClose,
}: {
  services: Service[];
  isLoading: boolean;
  isError: boolean;
  lang: Lang;
  L: Labels;
  onClose: () => void;
}) {
  return (
    <Panel>
      <div className="p-6 pe-12">
        <Eyebrow>{L.chooseService}</Eyebrow>

        {isLoading && (
          <div
            aria-busy="true"
            className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="h-16 animate-pulse rounded-xl bg-black/5"
              />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <p role="alert" className="mt-5 text-sm text-red-700">
            {L.servicesError}
          </p>
        )}

        {!isLoading && !isError && services.length === 0 && (
          <p className="mt-5 text-sm text-[#111]/50">{L.servicesEmpty}</p>
        )}

        {!isLoading && !isError && services.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-3">
            {services.map((service) => {
              const title = pickText(service.title, lang);
              const sub = pickText(service.desc, lang);
              const image = pickServiceMedia(service.cardImg, lang);
              const icon = pickServiceMedia(service.iconImg, lang);

              return (
                <Link
                  key={service._id}
                  href={`/services/${slugify(service.title.en)}/${service._id}`}
                  onClick={onClose}
                  className="group flex h-16 overflow-hidden rounded-xl border border-black/10 bg-white transition-all hover:-translate-y-0.5 hover:border-(--green)/40 hover:shadow-md"
                >
                  <div className="relative w-20 shrink-0 bg-black/5">
                    <Media src={image} alt={title} />
                    {icon && (
                      <span className="absolute -end-3.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-(--gold) bg-white shadow-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={icon}
                          alt=""
                          className="h-3.5 w-3.5 object-contain"
                        />
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-2 ps-6 pe-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{title}</p>
                      {sub && (
                        <p className="truncate text-xs text-[#111]/55">{sub}</p>
                      )}
                    </div>
                    <FiArrowRight className="shrink-0 text-[#111]/40 transition-all group-hover:translate-x-0.5 group-hover:text-(--green) rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <Link
          href="/services"
          onClick={onClose}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-(--green) hover:underline"
        >
          {L.viewAllServices} <FiArrowRight className="rtl:rotate-180" />
        </Link>
      </div>

      {/* Trust bar */}
      <div className="grid grid-cols-4 border-t border-black/10 bg-[#F4F8F5] px-6 py-3.5 text-xs text-[#111]/80">
        {L.trust.map((lines, i) => {
          const Icon = TRUST_ICONS[i] ?? FiShield;
          return (
            <div
              key={lines[0]}
              className="flex items-center gap-3 border-e border-black/10 px-4 first:ps-0"
            >
              <Icon className="shrink-0 text-xl text-(--green)" />
              <span className="leading-tight">
                {lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-3 px-4">
          <FiHeadphones className="shrink-0 text-xl text-(--green)" />
          <span className="leading-tight">
            <span className="block">{L.needHelp}</span>
            <Link
              href="/contact"
              onClick={onClose}
              className="font-bold text-(--red) hover:underline"
            >
              {L.bookCall} <FiArrowRight className="inline rtl:rotate-180" />
            </Link>
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label={L.closeMenu}
        className="absolute end-4 top-5 text-[#111]/40 transition-colors hover:text-[#111]"
      >
        <FiX className="text-lg" />
      </button>
    </Panel>
  );
}

/* ------------------------- DESKTOP: INSIGHTS ------------------------- */

function InsightsMega({
  insights,
  isLoading,
  isError,
  L,
  onClose,
}: {
  insights: Insights;
  isLoading: boolean;
  isError: boolean;
  L: Labels;
  onClose: () => void;
}) {
  const base = "/news";
  const items = insights.blogs;

  return (
    <Panel>
      <div className="p-6">
        {isLoading && (
          <div aria-busy="true" className="mt-6 grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="h-56 animate-pulse rounded-xl bg-black/5"
              />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <p role="alert" className="py-14 text-center text-sm text-red-700">
            {L.blogsError}
          </p>
        )}

        {!isLoading && !isError && items.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {items.map((p) => (
              <Link
                key={p.id}
                href={`${base}/${p.slug}`}
                onClick={onClose}
                className="group overflow-hidden rounded-xl border border-black/10 bg-white transition-all hover:-translate-y-0.5 hover:border-(--green)/40 hover:shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden bg-black/5">
                  <Media
                    src={p.media}
                    alt={p.title}
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3.5">
                  <p className="flex items-center gap-1.5 text-[11px] font-medium text-(--green)">
                    <FiCalendar /> {p.date}
                  </p>
                  <h4 className="mt-2 line-clamp-2 text-[13px] font-bold leading-snug">
                    {p.title}
                  </h4>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#111]/55">
                    {p.excerpt}
                  </p>
                  <p className="mt-3 flex items-center gap-1 border-t border-black/10 pt-2.5 text-[11px] font-bold uppercase tracking-wider text-(--red)">
                    {L.readMore}
                    <FiArrowRight className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && !isError && items.length === 0 && (
          <p className="py-14 text-center text-sm text-[#111]/50">
            {L.blogsEmpty}
          </p>
        )}

        <div className="mt-6 border-t border-black/10 pt-4 text-center">
          <Link
            href={base}
            onClick={onClose}
            className="group inline-flex items-center gap-3 text-base font-bold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-(--green)/40 text-(--green)">
              <FiFileText />
            </span>
            <span className="border-b border-(--gold) pb-0.5">
              {L.viewAllBlogs}
            </span>
            <FiArrowRight className="text-(--green) transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </Panel>
  );
}

/* ------------------------------ NAVBAR ------------------------------ */

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const pathname = usePathname();
  const lang = useLang();
  const L = LABELS[lang];

  const {
    data: servicesData,
    isLoading: servicesLoading,
    isError: servicesError,
  } = useGetServicesQuery();
  const {
    data: blogSection,
    isLoading: blogLoading,
    isError: blogError,
  } = useGetBlogSectionQuery();

  const services = servicesData ?? [];
  const insights = useMemo(
    () => buildInsights(blogSection, lang),
    [blogSection, lang],
  );

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  const closeAll = () => {
    setOpenMenu(null);
    setMenuOpen(false);
  };

  return (
    <nav
      style={BRAND}
      className="relative z-50 w-full border-b border-black/10 bg-white text-[#111] shadow-md"
      onMouseLeave={() => setOpenMenu(null)}
    >
      <div className="mx-auto flex min-h-19 max-w-8xl items-center justify-between px-4 sm:px-8 lg:px-10">
        {/* Logo */}
        <div className="flex shrink-0 items-center border-e border-black/10 py-2 pe-5 sm:pe-8">
          <Logo />
        </div>

        {/* Desktop links */}
        <div className="hidden flex-1 items-center justify-center gap-1 xl:flex 2xl:gap-3">
          {NAV_LINKS.map((l) => {
            const active = isActive(l.href) || openMenu === l.menu;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpenMenu(null)}
                onMouseEnter={() => setOpenMenu(l.menu ?? null)}
                onFocus={() => setOpenMenu(l.menu ?? null)}
                aria-haspopup={l.menu ? "true" : undefined}
                aria-expanded={l.menu ? openMenu === l.menu : undefined}
                className={`group relative flex items-center gap-1 whitespace-nowrap px-3 py-7 text-xs font-bold uppercase tracking-wide transition-colors 2xl:px-4 ${
                  active ? "text-(--green)" : "text-black hover:text-[#111]"
                }`}
              >
                {L.links[l.key]}
                {l.menu && (
                  <FiChevronDown
                    className={`text-sm transition-transform duration-300 ${openMenu === l.menu ? "rotate-180" : ""}`}
                  />
                )}
                <span
                  className={`absolute inset-x-3 bottom-5 h-0.5 origin-left rounded-full bg-(--green) transition-transform duration-300 rtl:origin-right 2xl:inset-x-4 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <Link
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative hidden shrink-0 items-center gap-3 rounded-full bg-(--green) px-5 py-3 text-white shadow-lg xl:flex whatsapp-blink"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg animate-pulse">
            <BsWhatsapp />
          </span>

          <span className="text-start leading-tight">
            <span className="block text-[10px] font-medium text-white/80">
              {L.chat}
            </span>
            {/* phone stays left-to-right inside the Arabic layout */}
            <span dir="ltr" className="block text-xs font-bold tracking-wide">
              +971 52 178 6209
            </span>
          </span>

          <FiArrowUpRight className="text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-rotate-90 rtl:group-hover:-translate-x-0.5" />
        </Link>

        {/* Mobile / tablet buttons */}
        <div className="flex items-center gap-3 xl:hidden">
          <Link
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={L.chatWhatsApp}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-(--green) text-lg text-white shadow-md"
          >
            <BsWhatsapp />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? L.closeMenu : L.openMenu}
            aria-expanded={menuOpen}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-black/15 hover:bg-black/5"
          >
            {[
              menuOpen ? "rotate-45" : "-translate-y-1.5",
              menuOpen ? "scale-x-0 opacity-0" : "",
              menuOpen ? "-rotate-45" : "translate-y-1.5",
            ].map((c, i) => (
              <span
                key={i}
                className={`absolute h-0.5 w-5 rounded-full bg-[#111] transition-all duration-300 ${c}`}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Desktop mega menus */}
      {openMenu && (
        <div className="absolute left-0 top-full hidden w-full px-4 pt-2 xl:block">
          <div className="mx-auto max-w-6xl">
            {openMenu === "services" && (
              <ServicesMega
                services={services}
                isLoading={servicesLoading}
                isError={servicesError}
                lang={lang}
                L={L}
                onClose={() => setOpenMenu(null)}
              />
            )}
            {openMenu === "insights" && (
              <InsightsMega
                insights={insights}
                isLoading={blogLoading}
                isError={blogError}
                L={L}
                onClose={() => setOpenMenu(null)}
              />
            )}
          </div>
        </div>
      )}

      {/* Mobile / tablet menu */}
      <div
        className={`absolute left-0 top-full w-full overflow-hidden border-t border-black/10 bg-white shadow-2xl transition-all duration-300 xl:hidden ${
          menuOpen
            ? "visible max-h-[85dvh] opacity-100"
            : "invisible max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto max-h-[85dvh] max-w-8xl overflow-y-auto p-4 sm:p-6 lg:px-10">
          <div className="grid gap-2 sm:grid-cols-2">
            {NAV_LINKS.map((l) => {
              const cls = `group flex w-full items-center justify-between rounded-lg border px-4 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
                isActive(l.href)
                  ? "border-(--green)/40 bg-(--green)/10 text-(--green)"
                  : "border-black/10 text-[#111]/80 hover:bg-black/5 hover:text-[#111]"
              }`;

              if (!l.menu)
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={closeAll}
                    className={cls}
                  >
                    {L.links[l.key]}
                    <FiArrowUpRight className="text-base transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-rotate-90" />
                  </Link>
                );

              const open = mobileSub === l.menu;
              const isServices = l.menu === "services";
              return (
                <div key={l.href} className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => setMobileSub(open ? null : (l.menu ?? null))}
                    aria-expanded={open}
                    className={cls}
                  >
                    {L.links[l.key]}
                    <FiChevronDown
                      className={`text-base transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  {open && (
                    <div className="mt-2 grid gap-x-6 gap-y-3 rounded-lg border border-black/10 bg-black/3 p-3 sm:grid-cols-2">
                      {isServices ? (
                        <>
                          {servicesLoading && (
                            <p className="px-2 py-2 text-sm text-[#111]/50">
                              {L.loading}
                            </p>
                          )}
                          {!servicesLoading && servicesError && (
                            <p
                              role="alert"
                              className="px-2 py-2 text-sm text-red-700"
                            >
                              {L.servicesError}
                            </p>
                          )}
                          {!servicesLoading &&
                            !servicesError &&
                            services.length === 0 && (
                              <p className="px-2 py-2 text-sm text-[#111]/50">
                                {L.servicesEmpty}
                              </p>
                            )}
                          {!servicesLoading &&
                            !servicesError &&
                            services.map((s) => (
                              <Link
                                key={s._id}
                                href={`/services/${slugify(s.title.en)}/${s._id}`}
                                onClick={closeAll}
                                className="block rounded-md px-2 py-2 text-sm text-[#111]/80 hover:bg-black/5"
                              >
                                {pickText(s.title, lang)}
                              </Link>
                            ))}
                        </>
                      ) : (
                        <>
                          {blogLoading && (
                            <p className="px-2 py-2 text-sm text-[#111]/50">
                              {L.loading}
                            </p>
                          )}
                          {!blogLoading && blogError && (
                            <p
                              role="alert"
                              className="px-2 py-2 text-sm text-red-700"
                            >
                              {L.blogsError}
                            </p>
                          )}
                          {!blogLoading &&
                            !blogError &&
                            insights.blogs.length === 0 && (
                              <p className="px-2 py-2 text-sm text-[#111]/50">
                                {L.blogsEmpty}
                              </p>
                            )}
                          {!blogLoading &&
                            !blogError &&
                            insights.blogs.map((b) => (
                              <Link
                                key={b.id}
                                href={`/news/${b.slug}`}
                                onClick={closeAll}
                                className="block rounded-md px-2 py-2 hover:bg-black/5"
                              >
                                <span className="block text-[11px] text-(--green)">
                                  {b.date}
                                </span>
                                <span className="block text-sm text-[#111]/85">
                                  {b.title}
                                </span>
                              </Link>
                            ))}
                        </>
                      )}
                      <Link
                        href={isServices ? "/services" : "/news"}
                        onClick={closeAll}
                        className="inline-flex items-center gap-1 px-2 text-sm font-bold text-(--red) sm:col-span-2"
                      >
                        {isServices ? L.viewAllServices : L.viewAllBlogs}
                        <FiArrowRight className="rtl:rotate-180" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Link
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative hidden shrink-0 items-center gap-3 rounded-full bg-(--green) px-5 py-3 text-white shadow-lg xl:flex"
          >
            <span className="whatsapp-ring-light flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
              <BsWhatsapp />
            </span>
            <span className="flex-1 text-start">
              <span className="block text-sm font-bold">{L.chat}</span>
              <span dir="ltr" className="mt-1 block text-xs text-[#111]/60">
                +971 52 178 6209
              </span>
            </span>
            <FiArrowUpRight className="text-xl text-(--green) rtl:-rotate-90" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
