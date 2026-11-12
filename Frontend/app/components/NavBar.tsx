"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsWhatsapp } from "react-icons/bs";
import type { IconType } from "react-icons";
import {
  FiArrowUpRight,
  FiArrowRight,
  FiChevronRight,
  FiChevronDown,
  FiX,
  FiBriefcase,
  FiBookOpen,
  FiShield,
  FiLayers,
  FiPercent,
  FiUser,
  FiGlobe,
  FiActivity,
  FiFileText,
  FiTrendingUp,
  FiAward,
  FiClock,
  FiHeadphones,
  FiCalendar,
  FiVolume2,
  FiPlay,
} from "react-icons/fi";
import Logo from "./Logo";
import servicesJson from "../api/services.json";
import insightsJson from "../api/insights.json";

/* ------------------------------ DATA ------------------------------ */

// Brand palette: change colors here only (same as the banner).
const BRAND = {
  "--green": "#00852B",
  "--red": "#F20D18",
  "--gold": "#fab923",
} as CSSProperties;

const whatsapp = "https://wa.me/971521786209";

const links = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services", menu: "services" },
  { name: "FAQ's", href: "/faq" },
  { name: "Insights", href: "/news", menu: "insights" },
  { name: "Contact Us", href: "/contact" },
];

/* --------------------- DATA (JSON / API format) --------------------- */

type Service = { name: string; sub: string; icon: string; image: string };
type Category = {
  id: number;
  name: string;
  icon: string;
  desc: string;
  services: Service[];
};
type Item = {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  media: string;
  featured?: boolean;
};
type Tab = "blogs" | "press" | "videos";
type Insights = Record<Tab, Item[]>;
type NavData = { services: Category[]; insights: Insights };

// Icon names used in the JSON -> react-icons
const ICONS: Record<string, IconType> = {
  shield: FiShield,
  activity: FiActivity,
  file: FiFileText,
  award: FiAward,
  percent: FiPercent,
  globe: FiGlobe,
  trending: FiTrendingUp,
  layers: FiLayers,
  briefcase: FiBriefcase,
  book: FiBookOpen,
  user: FiUser,
};

const Ico = ({ name, className }: { name: string; className?: string }) => {
  const I = ICONS[name] ?? FiFileText;
  return <I className={className} />;
};

// Category page: /services/<description>/<id>
const catHref = (c: Category) =>
  `/services/${encodeURIComponent(c.desc)}/${c.id}`;

// Uses the local JSON files; if NEXT_PUBLIC_NAV_API is set, loads
// { "services": [...], "insights": { "blogs": [], "press": [], "videos": [] } } from it.
function useNavData() {
  const [data, setData] = useState<NavData>({
    services: servicesJson as Category[],
    insights: insightsJson as Insights,
  });

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_NAV_API;
    if (!url) return;
    fetch(url)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) =>
        setData((p) => ({
          services: d.services ?? p.services,
          insights: d.insights ?? p.insights,
        })),
      )
      .catch(() => {});
  }, []);

  return data;
}

const trustItems = [
  { icon: FiShield, lines: ["FTA Approved", "Tax Agency"] },
  { icon: FiAward, lines: ["25+ Years of Experience"] },
  { icon: FiClock, lines: ["Industry Leading", "Response Time"] },
];

/* --------------------------- SMALL PIECES --------------------------- */

const Eyebrow = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center gap-3">
    <span className="h-0.5 w-6 bg-(--red)" />
    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--green)">
      {children}
    </span>
  </div>
);

const isVideo = (src: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);

// Renders an <img> or, for video files, a muted looping <video>
const Media = ({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const cls = `h-full w-full object-cover ${className}`;
  const hide = (e: React.SyntheticEvent<HTMLElement>) =>
    (e.currentTarget.style.visibility = "hidden");
  return isVideo(src) ? (
    <video
      src={src}
      aria-label={alt}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={hide}
      className={cls}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading="lazy" onError={hide} className={cls} />
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
  categories,
  onClose,
}: {
  categories: Category[];
  onClose: () => void;
}) {
  const [active, setActive] = useState(0);
  const cat = categories[active] ?? categories[0];
  if (!cat) return null;

  return (
    <Panel>
      <div className="grid grid-cols-[300px_1fr]">
        <div className="border-r border-black/10 bg-[#F4F8F5] p-5">
          <Eyebrow>Choose Category</Eyebrow>
          <ul className="mt-5 space-y-1">
            {categories.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition-all ${
                    i === active
                      ? "border-(--green)/30 bg-white text-(--green) shadow-sm"
                      : "border-transparent text-black hover:bg-white hover:text-[#111]"
                  }`}
                >
                  <Ico name={c.icon} className="text-base" />
                  <span className="flex-1">{c.name}</span>
                  <FiChevronRight
                    className={i === active ? "text-(--red)" : "opacity-40"}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 pr-12">
          <Eyebrow>Choose Service</Eyebrow>
          <h3 className="mt-3 text-xl font-bold">{cat.name}</h3>
          <p className="mt-1.5 text-sm text-[#111]/60">{cat.desc}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {cat.services.map((s) => (
              <Link
                key={s.name}
                href={catHref(cat)}
                onClick={onClose}
                className="group flex h-16 overflow-hidden rounded-xl border border-black/10 bg-white transition-all hover:-translate-y-0.5 hover:border-(--green)/40 hover:shadow-md"
              >
                <div className="relative w-20 shrink-0 bg-black/5">
                  <Media src={s.image} alt={s.name} />
                  <span className="absolute -right-3.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-(--gold) bg-white text-xs text-(--green) shadow-sm">
                    <Ico name={s.icon} />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2 pl-6 pr-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{s.name}</p>
                    <p className="truncate text-xs text-[#111]/55">{s.sub}</p>
                  </div>
                  <FiArrowRight className="shrink-0 text-[#111]/40 transition-all group-hover:translate-x-0.5 group-hover:text-(--green)" />
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/services"
            onClick={onClose}
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-(--green) hover:underline"
          >
            View All Services <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Trust bar */}
      <div className="grid grid-cols-4 border-t border-black/10 bg-[#F4F8F5] px-6 py-3.5 text-xs text-[#111]/80">
        {trustItems.map(({ icon: Icon, lines }) => (
          <div
            key={lines[0]}
            className="flex items-center gap-3 border-r border-black/10 px-4 first:pl-0"
          >
            <Icon className="text-xl text-(--green)" />
            <span className="leading-tight">
              {lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-3 px-4">
          <FiHeadphones className="text-xl text-(--green)" />
          <span className="leading-tight">
            <span className="block">Need help choosing?</span>
            <Link
              href="/contact"
              onClick={onClose}
              className="font-bold text-(--red) hover:underline"
            >
              Book Free 20-Min Call →
            </Link>
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className="absolute right-4 top-5 text-[#111]/40 transition-colors hover:text-[#111]"
      >
        <FiX className="text-lg" />
      </button>
    </Panel>
  );
}

/* ------------------------- DESKTOP: INSIGHTS ------------------------- */

const TABS = [
  ["blogs", "Blogs", FiFileText, "/news"],
  ["press", "Press Releases", FiVolume2, "/press"],
] as const;

function InsightsMega({
  insights,
  onClose,
}: {
  insights: Insights;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("blogs");
  const [, label, , base] = TABS.find((t) => t[0] === tab)!;
  const items = insights[tab] ?? [];

  return (
    <Panel>
      <div className="p-6">
        <div className="flex justify-center gap-2">
          {TABS.map(([id, name, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
                tab === id
                  ? "border-(--green) bg-(--green) text-white"
                  : "border-black/10 bg-white text-[#111]/60 hover:text-[#111]"
              }`}
            >
              <Icon /> {name}
            </button>
          ))}
        </div>

        {items.length ? (
          <div className="mt-6 grid grid-cols-4 gap-4">
            {items.map((p) => (
              <Link
                key={p.slug}
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
                  {isVideo(p.media) && (
                    <span className="absolute bottom-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-xs text-white">
                      <FiPlay />
                    </span>
                  )}
                  {p.featured && (
                    <span className="absolute right-2 top-2 rounded bg-(--red) px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                      Featured
                    </span>
                  )}
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
                  <p className="mt-3 border-t border-black/10 pt-2.5 text-[11px] font-bold uppercase tracking-wider text-(--red)">
                    {isVideo(p.media) ? "Watch now" : "Read more"}{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-14 text-center text-sm text-[#111]/50">
            No {label.toLowerCase()} yet.
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
              View all {label.toLowerCase()}
            </span>
            <FiArrowRight className="text-(--green) transition-transform group-hover:translate-x-1" />
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
  const data = useNavData();

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
        <div className="flex shrink-0 items-center border-r border-black/10 py-2 pr-5 sm:pr-8">
          <Logo />
        </div>

        {/* Desktop links */}
        <div className="hidden flex-1 items-center justify-center gap-1 xl:flex 2xl:gap-3">
          {links.map((l) => {
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
                {l.name}
                {l.menu && (
                  <FiChevronDown
                    className={`text-sm transition-transform duration-300 ${openMenu === l.menu ? "rotate-180" : ""}`}
                  />
                )}
                <span
                  className={`absolute inset-x-3 bottom-5 h-0.5 origin-left rounded-full bg-(--green) transition-transform duration-300 2xl:inset-x-4 ${
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

          <span className="text-left leading-tight">
            <span className="block text-[10px] font-medium text-white/80">
              Chat with us anytime
            </span>
            <span className="block text-xs font-bold tracking-wide">
              +971 52 178 6209
            </span>
          </span>

          <FiArrowUpRight className="text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>

        {/* Mobile / tablet buttons */}
        <div className="flex items-center gap-3 xl:hidden">
          <Link
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-(--green) text-lg text-white shadow-md"
          >
            <BsWhatsapp />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
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
                categories={data.services}
                onClose={() => setOpenMenu(null)}
              />
            )}
            {openMenu === "insights" && (
              <InsightsMega
                insights={data.insights}
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
            {links.map((l) => {
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
                    {l.name}
                    <FiArrowUpRight className="text-base transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                );

              const open = mobileSub === l.menu;
              const isServices = l.menu === "services";
              return (
                <div key={l.href} className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => setMobileSub(open ? null : l.menu)}
                    aria-expanded={open}
                    className={cls}
                  >
                    {l.name}
                    <FiChevronDown
                      className={`text-base transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  {open && (
                    <div className="mt-2 grid gap-x-6 gap-y-3 rounded-lg border border-black/10 bg-black/3 p-3 sm:grid-cols-2">
                      {isServices
                        ? data.services.map((c) => (
                            <div key={c.name}>
                              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wider text-(--green)">
                                {c.name}
                              </p>
                              {c.services.map((s) => (
                                <Link
                                  key={s.name}
                                  href={catHref(c)}
                                  onClick={closeAll}
                                  className="block rounded-md px-2 py-2 text-sm text-[#111]/80 hover:bg-black/5"
                                >
                                  {s.name}
                                </Link>
                              ))}
                            </div>
                          ))
                        : data.insights.blogs.map((b) => (
                            <Link
                              key={b.slug}
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
                      <Link
                        href={isServices ? "/services" : "/news"}
                        onClick={closeAll}
                        className="px-2 text-sm font-bold text-(--red) sm:col-span-2"
                      >
                        {isServices
                          ? "View All Services →"
                          : "View all blogs →"}
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
            <span className="flex-1">
              <span className="block text-sm font-bold">
                Chat with us anytime
              </span>
              <span className="mt-1 block text-xs text-[#111]/60">
                +971 52 178 6209
              </span>
            </span>
            <FiArrowUpRight className="text-xl text-(--green)" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
