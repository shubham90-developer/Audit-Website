"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
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
  FiPercent,
  FiPhone,
  FiPieChart,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { LuFileQuestion } from "react-icons/lu";
import Logo from "./Logo";
import ThemeBtn from "./ThemeBtn";

/* ------------------------------ Data ------------------------------ */

type LinkItem = { label: string; href: string; icon: IconType };

const features = [
  { label: "Free Consultation", icon: FiShield },
  { label: "Clear Next Steps", icon: FiFileText },
  { label: "Tailored to Your Business", icon: FiZap },
];

const quickLinks: LinkItem[] = [
  { label: "Home", href: "/", icon: FiHome },
  { label: "About Us", href: "/about", icon: FiInfo },
  { label: "Services", href: "/services", icon: FiBriefcase },
  { label: "FAQ's", href: "/faq", icon: LuFileQuestion },
  { label: "Insights", href: "/news", icon: FiFileText },
  { label: "Contact Us", href: "/contact", icon: FiMessageSquare },
];

const services: LinkItem[] = [
  { label: "Audit & Assurance", href: "/services/audit", icon: FiShield },
  { label: "Tax Services", href: "/services/accounting", icon: FiPercent },
  { label: "Advisory Services", href: "/services/tax", icon: FiTrendingUp },
  {
    label: "Consulting Services",
    href: "/services/corporate-tax",
    icon: FiUsers,
  },
  {
    label: "Accounting & Other Services",
    href: "/services/advisory",
    icon: FiPieChart,
  },
];

const contacts = [
  {
    icon: FiMapPin,
    value:
      "M-02, Building #19, Seashelll Building, Medina St - Al Khalidiyah - W9 - Abu Dhabi",
  },
  { icon: FiPhone, value: "+971 52 178 6209", href: "tel:+971521786209" },
  {
    icon: FiMail,
    value: "info@almazroeiaudit.com",
    href: "mailto:info@almazroeiaudit.com",
  },
  { icon: FiClock, value: "Mon – Sat: 09:00 – 18:00" },
];

const socials = [
  { label: "LinkedIn", icon: FaLinkedinIn, href: "#" },
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "Instagram", icon: FaInstagram, href: "#" },
];

/* --------------------------- Small parts -------------------------- */

const Title = ({ children }: { children: string }) => (
  <div className="mb-5">
    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-green-400">
      {children}
    </h3>
    <span className="mt-2 block h-px w-8 bg-green-400" />
  </div>
);

const LinkList = ({ items }: { items: LinkItem[] }) => (
  <ul className="divide-y divide-white/10 border-y border-white/10">
    {items.map(({ label, href, icon: Icon }) => (
      <li key={label}>
        <Link
          href={href}
          className="group flex items-center gap-3 py-3 text-sm text-slate-300 transition hover:text-green-400"
        >
          <Icon className="h-4 w-4 shrink-0 text-green-400" />
          <span className="flex-1">{label}</span>
          <FiChevronRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1 group-hover:text-green-400" />
        </Link>
      </li>
    ))}
  </ul>
);

/* --------------------------- Component ---------------------------- */

const Footer = () => {
  const router = useRouter();

  return (
    <footer className="relative isolate  bg-[#090b10] text-slate-300">
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

          <div className="flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center md:justify-between lg:px-10 lg:py-9">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400">
                Still need help?
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Speak with a{" "}
                <span className="text-green-400">Senior Auditor</span>
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Get tailored guidance for audit, accounting, tax and business
                advisory.
              </p>

              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white">
                {features.map(({ label, icon: Icon }) => (
                  <li key={label} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-green-400" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <ThemeBtn onClick={() => router.push("/contact")}>
              Get Quote
            </ThemeBtn>
          </div>
        </div>

        {/* columns */}
        <div className="mt-14 grid gap-12 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-white/10">
          {/* brand + contact */}
          <div className="lg:pr-10">
            <Logo />
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Trusted audit, tax and advisory services in Abu Dhabi since 2000.
            </p>

            <ul className="mt-6 space-y-4">
              {contacts.map(({ icon: Icon, value, href }) => (
                <li key={value} className="flex items-start gap-3 text-sm">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                  {href ? (
                    <a href={href} className="transition hover:text-green-400">
                      {value}
                    </a>
                  ) : (
                    <span>{value}</span>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex gap-2">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-[#00852B] text-xs text-green-400 transition hover:bg-[#00852B] hover:text-white"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* quick links */}
          <div className="lg:px-10">
            <Title>Quick Links</Title>
            <LinkList items={quickLinks} />
          </div>

          {/* services */}
          <div className="lg:pl-10">
            <Title>Our Services</Title>
            <LinkList items={services} />
          </div>
        </div>

        {/* watermark */}
        <p
          aria-hidden="true"
          className="mt-14 select-none overflow-hidden whitespace-nowrap border-t border-white/10 pt-6 text-center text-[clamp(1rem,9vw,8rem)] font-extrabold uppercase leading-none tracking-tight text-white/5"
        >
          Ahmed Al Mazroei
        </p>

        {/* bottom bar */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Ahmed Al Mazroei Auditing &amp; Accounting. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy-policy"
              className="transition hover:text-green-400"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-green-400">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
