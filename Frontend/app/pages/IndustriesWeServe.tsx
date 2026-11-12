"use client";

import Image from "next/image";

import React, { useEffect, useRef } from "react";
import type { IconType } from "react-icons";

import {
  HiOutlineBolt,
  HiOutlineBuildingLibrary,
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineCpuChip,
  HiOutlineGlobeAlt,
  HiOutlineHandRaised,
  HiOutlineHeart,
  HiOutlineHomeModern,
  HiOutlineTruck,
  HiOutlineUsers,
} from "react-icons/hi2";
import Title from "../components/Title";

/* ----------------------------- Content ----------------------------- */

const BG_IMAGE = "/img/banner/bg7.avif"; // replace with your own background

const INDUSTRIES: {
  icon: IconType;
  title: string;
  text: string;
  img: string;
}[] = [
  {
    icon: HiOutlineBuildingLibrary,
    title: "Government & Semi-Government",
    text: "Audit, tax and advisory support tailored to government entities and semi-government organisations.",
    img: "/img/banner/1.jpg",
  },
  {
    icon: HiOutlineHomeModern,
    title: "Real Estate & Construction",
    text: "Reliable assurance, accounting and compliance services for property developers and construction businesses.",
    img: "/img/banner/2.jpg",
  },
  {
    icon: HiOutlineBolt,
    title: "Oil, Gas & Energy",
    text: "Strategic financial reporting, risk management and tax advisory for energy businesses.",
    img: "/img/banner/3.jpg",
  },
  {
    icon: HiOutlineTruck,
    title: "Trading & Distribution",
    text: "Practical audit, inventory and tax solutions that help trading businesses improve financial performance.",
    img: "/img/banner/4.jpg",
  },
  {
    icon: HiOutlineHeart,
    title: "Healthcare",
    text: "Financial clarity and compliance support for healthcare providers and medical organisations.",
    img: "/img/banner/1.jpg",
  },
  {
    icon: HiOutlineGlobeAlt,
    title: "Hospitality & Tourism",
    text: "Accounting, assurance and advisory services for hotels, restaurants and tourism businesses.",
    img: "/img/banner/2.jpg",
  },
  {
    icon: HiOutlineCog6Tooth,
    title: "Manufacturing",
    text: "Financial insights and risk management for manufacturers seeking operational efficiency.",
    img: "/img/banner/3.jpg",
  },
  {
    icon: HiOutlineCpuChip,
    title: "Technology & Start-ups",
    text: "Flexible financial and advisory services for growing technology companies and emerging businesses.",
    img: "/img/banner/1.jpg",
  },
  {
    icon: HiOutlineUsers,
    title: "Family Businesses",
    text: "Trusted financial guidance to support sustainable growth, governance and long-term business continuity.",
    img: "/img/banner/2.jpg",
  },
  {
    icon: HiOutlineHandRaised,
    title: "Non-Profit Organisations",
    text: "Transparent reporting, audit and compliance services for non-profit and charitable organisations.",
    img: "/img/banner/3.jpg",
  },
];

/* ---------------------------- Component ----------------------------- */

const IndustriesWeServe = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  // Fills the centre line as the list scrolls through the viewport
  // and lights up each dot when the line reaches it.
  useEffect(() => {
    const list = listRef.current;
    const fill = fillRef.current;
    if (!list || !fill) return;

    const dots = list.querySelectorAll<HTMLElement>("[data-dot]");
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = list.getBoundingClientRect();
      const total = rect.height + 40; // line extends 40px below the list
      const y = window.innerHeight * 0.6 - rect.top; // fill point: 60% down the screen
      const filled = Math.min(Math.max(y, 0), total);

      fill.style.height = `${filled}px`;

      dots.forEach((d) => {
        const r = d.getBoundingClientRect();
        const dotY = r.top + r.height / 2 - rect.top; // dot centre
        d.dataset.on = String(dotY <= filled);
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative isolate  bg-white px-4 py-16 text-slate-900 sm:px-6 lg:py-24">
      {/* background image */}
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-fill"
      />

      {/* white linear gradient over the image: keeps the white look, image stays visible */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-linear-to-b from-white/90 via-white/75 to-white/90"
      />

      {/* heading */}

      <Title
        title="  Industries We"
        colorTitle="Serve"
        subtitle=" Whatever your business sells or ships, the books, tax, and compliance
          behind it follow the same UAE rules. We work with B2B companies across
          every sector, and wherever you are in the journey, the engagement
          fits."
        watermark="Ahmed Al Mazroei"
      />

      {/* cards with centre line */}
      <ul
        ref={listRef}
        className="relative mx-auto mt-12 grid max-w-6xl gap-4 lg:grid-cols-2 lg:gap-x-16"
      >
        {/* centre line: visible track + fill that grows on scroll */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 left-1/2 top-0 z-0 hidden w-0.5 -translate-x-1/2 rounded-full bg-[#00852B]/25 lg:block"
        >
          <span
            ref={fillRef}
            className="absolute left-0 top-0 w-full rounded-full bg-[#00852B] shadow-[0_0_10px_rgba(0,133,43,0.5)]"
            style={{ height: 0 }}
          >
            {/* glowing head at the tip of the fill */}
            <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#00852B] shadow-[0_0_0_4px_rgba(0,133,43,0.2),0_0_14px_rgba(0,133,43,0.8)]" />
          </span>
        </span>

        {INDUSTRIES.map(({ icon: Icon, title, text, img }, i) => (
          <li key={title} className="relative">
            {/* dot on the centre line (one per row), lights up when the line reaches it */}
            {i % 2 === 0 && (
              <span
                data-dot
                data-on="false"
                aria-hidden="true"
                className="absolute -right-8 top-1/2 z-10 hidden h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-[#00852B]/40 bg-white transition-all duration-500 data-[on=true]:scale-125 data-[on=true]:border-[#00852B] data-[on=true]:bg-[#00852B] data-[on=true]:shadow-[0_0_0_4px_rgba(0,133,43,0.2),0_0_14px_rgba(0,133,43,0.6)] lg:block"
              />
            )}

            <article className="relative z-1 flex h-full gap-4 overflow-hidden rounded-xl border border-[#00852B]/40 bg-white p-5 pr-[38%] shadow-sm shadow-[#00852B]/10 transition-shadow hover:shadow-md hover:shadow-[#00852B]/20">
              {/* image fading into the card */}
              <div className="absolute inset-y-0 right-0 w-2/5">
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 240px, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-white via-white/30 to-transparent" />
              </div>

              {/* number + icon */}
              <div className="relative flex flex-none flex-col items-start gap-3">
                <span className="text-xs font-bold text-[#00852B]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-lg border border-[#00852B]/30 bg-[#00852B]/10">
                  <Icon className="h-6 w-6 text-[#00852B]" aria-hidden="true" />
                </span>
              </div>

              {/* text */}
              <div className="relative">
                <h3 className="text-sm font-bold leading-5 text-slate-900 sm:text-base">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs leading-5 text-slate-600">
                  {text}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {/* bottom note */}
      <div className="relative mx-auto mt-10 flex max-w-xl items-center gap-5 rounded-xl border border-[#00852B]/40 bg-white px-6 py-5 shadow-sm shadow-[#00852B]/10">
        <HiOutlineChartBar
          className="h-10 w-10 flex-none text-[#00852B]"
          aria-hidden="true"
        />
        <span aria-hidden="true" className="h-14 w-px flex-none bg-slate-200" />
        <div>
          <p className="text-base font-bold leading-6 text-slate-900">
            Ahmed Al Mazroei works across every licensed activity in the{" "}
            <span className="text-[#00852B]">UAE, mainland and free zone.</span>
          </p>
          <p className="mt-1 text-xs text-slate-600">
            If your industry is not listed above, it is still one we serve.
          </p>
        </div>
      </div>
    </section>
  );
};

export default IndustriesWeServe;
