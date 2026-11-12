import ThemeBtn from "@/app/components/ThemeBtn";
import { Mrs_Saint_Delafield } from "next/font/google";
import Image from "next/image";
import type { ReactNode } from "react";
import { FiAward, FiGlobe, FiLayers, FiMapPin, FiShield } from "react-icons/fi";
import { HiOutlineBadgeCheck } from "react-icons/hi";

const script = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400" });

const BG_IMAGE = "/img/banner/bg8.avif"; // faded skyline behind the section
const CARD_HEADER_IMAGE = "/img/banner/bg3.avif"; // skyline in the card header

type Item = {
  icon: ReactNode;
  label: string;
  value?: string;
  text?: string;
};

const items: Item[] = [
  {
    icon: <FiAward />,
    label: "Established",
    value: "Since 2000",
    text: "UAE National-owned audit firm",
  },
  {
    icon: <HiOutlineBadgeCheck />,
    label: "Licensed By",
    text: "Department of Economic Development, Abu Dhabi",
  },
  {
    icon: <FiShield />,
    label: "Licence No.",
    value: "30008692",
  },
  {
    icon: <FiGlobe />,
    label: "Coverage",
    value: "All 7 Emirates",
    text: "Serving clients across the UAE",
  },
  {
    icon: <FiLayers />,
    label: "Services",
    text: "Accounting, tax, audit, business setup and corporate services",
  },
  {
    icon: <FiMapPin />,
    label: "Office",
    text: "Office 601, Damac Executive Bay Tower B, Business Bay, Dubai",
  },
];

export default function WhoWeAre() {
  return (
    <section className="relative isolate  bg-[#fdf9f3] py-16 lg:py-24">
      {/* Background image fading to cream */}
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover opacity-30"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-r from-white/40 via-[#fdf9f3]/90 to-[#fdf9f3]" />

      {/* Soft decorative glows */}
      <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-[#3ddc6e]/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-0 -z-10 h-80 w-80 rounded-full bg-[#3ddc6e]/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:px-10">
        {/* Left: story */}
        <div>
          <div className="flex items-center gap-3">
            <span className="hidden h-px w-12 bg-[#3ddc6e] sm:block" />
            <span className="rounded-full border border-[#3ddc6e]/60 bg-[#fffaf0] px-6 py-2 text-sm font-bold uppercase tracking-[0.25em] text-[#3ddc6e] shadow-sm">
              Who We Are
            </span>
          </div>

          <h2 className="mt-8 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Building trust through{" "}
            <span className="relative inline-block text-[#3ddc6e]">
              expertise
              <span className="absolute -bottom-1 left-0 h-1.5 w-full rounded-full bg-[#3ddc6e]/50" />
            </span>{" "}
            and integrity.
          </h2>

          <p className="mt-8 max-w-xl text-base leading-8 text-slate-600">
            <strong className="font-semibold text-slate-900">
              Ahmed Al Mazroei Auditing &amp; Accounting
            </strong>{" "}
            is a UAE National-owned audit firm based in Abu Dhabi. Since 2000 we
            have helped companies, family businesses, government-related
            entities and investors with audit, accounting, tax and advisory
            services. We are licensed by the Department of Economic Development
            in Abu Dhabi and serve clients across all seven emirates.
          </p>

          <blockquote className="relative mt-8 max-w-xl rounded-r-2xl border-s-4 border-[#3ddc6e] bg-white/70 py-4 pe-5 ps-6 text-[17px] italic leading-8 text-slate-700 shadow-sm backdrop-blur-sm">
            <span
              aria-hidden
              className="absolute -top-4 left-4 select-none font-serif text-6xl leading-none text-[#3ddc6e]/60"
            >
              “
            </span>
            You can start with a trade licence and still be with us at your
            first corporate tax return. Most of our clients are.
          </blockquote>

          <div className="mt-10">
            <ThemeBtn>Explore Our Services</ThemeBtn>
          </div>
        </div>

        {/* Right: firm snapshot */}
        <div>
          <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10">
            {/* Header (isolate keeps the -z image above the card background) */}
            <div className="relative isolate flex flex-wrap items-center justify-between gap-2 px-6 py-7 text-white">
              <Image
                src={CARD_HEADER_IMAGE}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="-z-20 object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#111]/90 to-[#111]/70" />
              <span className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[#3ddc6e]">
                <span className="h-px w-8 bg-[#3ddc6e]" />
                Firm Snapshot
              </span>
              <span className="text-sm italic text-white/90">
                Everything you need. Under one roof.
              </span>
            </div>

            {/* Grid: gap-px over a tinted background draws the dividers */}
            <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
              {items.map(({ icon, label, value, text }) => (
                <div
                  key={label}
                  className="group flex items-start gap-4 bg-white p-6 transition-colors duration-300 hover:bg-[#f3fff0]"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#fdf6e6] text-2xl text-[#3ddc6e] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-[#3ddc6e] group-hover:text-white">
                    {icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                      {label}
                    </p>
                    {value && (
                      <p className="mt-1 text-xl font-bold text-slate-900">
                        {value}
                      </p>
                    )}
                    {text && (
                      <p className="mt-1 text-sm leading-5 text-slate-600">
                        {text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p
            className={`${script.className} -rotate-6 mt-16 flex items-center justify-end gap-2 font-[cursive] text-6xl text-[#8a5a00]`}
          >
            Your Growth Partner
            <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc6e]" />
          </p>
        </div>
      </div>
    </section>
  );
}
