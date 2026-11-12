"use client";

import { useState } from "react";
import Image from "next/image";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import Title from "@/app/components/Title";

/* ----------------------------- Content ----------------------------- */

const ACCENT = "#3ddc6e"; // lines, borders, active dot

const MEMBERS = [
  {
    name: "Siflan Mohammad",
    role: "Accounting Associate",
    dept: "Accounting & Tax",
    image: "/img/about/5.jpg",
  },
  {
    name: "Siflan Mohammad",
    role: "Accounting Associate",
    dept: "Accounting & Tax",
    image: "/img/about/5.jpg",
  },
  {
    name: "Siflan Mohammad",
    role: "Accounting Associate",
    dept: "Accounting & Tax",
    image: "/img/about/5.jpg",
  },
  {
    name: "Siflan Mohammad",
    role: "Accounting Associate",
    dept: "Accounting & Tax",
    image: "/img/about/5.jpg",
  },
  {
    name: "Siflan Mohammad",
    role: "Accounting Associate",
    dept: "Accounting & Tax",
    image: "/img/about/5.jpg",
  },
];

/* ---------------------------- Component ----------------------------- */

const Team = () => {
  const [active, setActive] = useState(2);
  const total = MEMBERS.length;

  const go = (index: number) => setActive((index + total) % total);

  // shortest circular distance from the active card
  const offsetOf = (i: number) => {
    let d = i - active;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  return (
    <section className="relative py-12 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Title
          title="Meet the Team"
          colorTitle="Behind Your Business"
          subtitle="The accountants, tax agents and corporate advisers who handle your UAE compliance day to day."
          watermark="Our Team"
        />

        {/* coverflow */}
        <div className="relative mt-8 h-80 [--step:62px] sm:mt-10 sm:h-96 sm:[--step:120px] lg:[--step:160px]">
          {MEMBERS.map((m, i) => {
            const d = offsetOf(i);
            const abs = Math.abs(d);
            const isActive = d === 0;
            const scale = isActive ? 1.15 : abs === 1 ? 0.92 : 0.82;

            return (
              <article
                key={`${m.name}-${i}`}
                onClick={() => !isActive && go(i)}
                className={`absolute left-1/2 top-1/2 w-44 overflow-hidden rounded-xl border bg-white transition-all duration-500 sm:w-48 ${
                  isActive ? "shadow-xl" : "cursor-pointer shadow-sm"
                } ${
                  abs > 2
                    ? "pointer-events-none opacity-0"
                    : abs === 2
                      ? "max-sm:pointer-events-none max-sm:opacity-0"
                      : ""
                }`}
                style={{
                  transform: `translate(-50%, -50%) translateX(calc(var(--step) * ${d})) scale(${scale})`,
                  zIndex: 10 - abs,
                  borderColor: isActive ? ACCENT : "#e5e7eb",
                }}
              >
                <Image
                  src={m.image}
                  alt={m.name}
                  width={300}
                  height={300}
                  className={`h-40 w-full object-cover object-top transition ${
                    isActive ? "" : "grayscale"
                  }`}
                />

                <div className="space-y-1 px-3 py-3 text-left">
                  <p className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-widest text-gray-500">
                    {isActive && (
                      <span
                        className="h-0.5 w-3 shrink-0"
                        style={{ backgroundColor: ACCENT }}
                      />
                    )}
                    {m.dept}
                  </p>
                  <h3 className="text-sm font-bold leading-tight text-gray-900">
                    {m.name}
                  </h3>
                  <p className="text-xs text-gray-600">{m.role}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous team member"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-gray-300 bg-white text-gray-800 transition hover:border-gray-500"
          >
            <HiChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2.5">
            {MEMBERS.map((m, i) => (
              <button
                key={`${m.name}-${i}`}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show ${m.name}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition-all ${
                  i === active ? "w-5" : "w-1.5 bg-gray-300"
                }`}
                style={i === active ? { backgroundColor: ACCENT } : undefined}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next team member"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-gray-300 bg-white text-gray-800 transition hover:border-gray-500"
          >
            <HiChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Team;
