import Image from "next/image";
import React from "react";
import type { IconType } from "react-icons";
import { FiFileText, FiHeadphones, FiSettings, FiShield } from "react-icons/fi";
import Title from "../components/Title";

/* ----------------------------- Content ----------------------------- */

const STEPS: {
  icon: IconType;
  color: string;
  title: string;
  text: string;
  active?: boolean;
}[] = [
  {
    icon: FiHeadphones,
    color: "text-sky-400",
    title: "Talk to Us",
    text: "A free first meeting to understand your needs.",
  },
  {
    icon: FiFileText,
    color: "text-white",
    title: "Clear Proposal",
    text: "Scope, timeline and fixed fee agreed in writing",
    active: true,
  },
  {
    icon: FiSettings,
    color: "text-[#fab923]",
    title: "We Do the Work",
    text: "Our team works with yours, on-site or online.",
  },
  {
    icon: FiShield,
    color: "text-[#3ddc6e]",
    title: "Results & Support",
    text: "Clear report, practical advice and ongoing help.",
  },
];

/* ---------------------------- Component ----------------------------- */

const HowWeWork = () => {
  return (
    <section className="relative isolate  bg-[#F4F8F5] px-4 py-16 sm:px-6 lg:py-20">
      {/* background image */}
      <Image
        src="/img/banner/bg5.avif"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* white gradient layer: solid white at top and bottom, image shows in the middle */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-white via-white/60 to-white"
      />

      {/* heading */}
      <Title
        title=" How We"
        colorTitle="Work"
        subtitle=" Simple, Clear and On Time"
        watermark="Ahmed Al Mazroei"
      />

      {/* card */}
      <div className="mx-auto mt-8 grid max-w-249 overflow-hidden rounded-2xl bg-[#0a0a0c] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] lg:grid-cols-[1fr_2fr]">
        {/* image */}
        <div className="relative h-80 border-[#fab923]/60 lg:h-auto lg:border-r">
          <Image
            src="/img/banner/11.avif"
            alt="Our team working with a client"
            fill
            sizes="(min-width: 1024px) 332px, 100vw"
            className="object-cover"
          />
        </div>

        {/* steps */}
        <ol className="px-6 py-10 sm:px-8 lg:pl-6 lg:pr-14">
          {STEPS.map(({ icon: Icon, color, title, text, active }, i) => (
            <li key={title} className="relative flex gap-4 pb-10 last:pb-0">
              {/* connector line */}
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-5.25 top-12 w-px bg-white/20"
                />
              )}

              {/* icon */}
              <span
                className={`relative z-10 grid h-11 w-11 flex-none place-items-center rounded-full border bg-[#14100a] ${
                  active
                    ? "border-[#fab923] shadow-[0_0_16px_-2px_#fab923]"
                    : "border-white/20"
                }`}
              >
                <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
              </span>

              {/* text */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-[#3ddc6e]">
                  Step {i + 1}.
                </p>
                <h3 className="text-sm font-semibold leading-5 text-white">
                  {title}
                </h3>
                <p className="mt-0.5 text-xs leading-4.25 text-white/70">
                  {text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowWeWork;
