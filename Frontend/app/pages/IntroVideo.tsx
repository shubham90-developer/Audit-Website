import Image from "next/image";
import { Mrs_Saint_Delafield } from "next/font/google";
import React from "react";

const script = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400" });

/* ----------------------------- Content ----------------------------- */

const MARQUEE_TEXT = "ACCOUNTING • TAX • AUDIT • ";
const MARQUEE_SECONDS = 60; // lower = faster, higher = slower
const VIDEO_SRC = "/img/banner/1.mp4";
const VIDEO_POSTER = "/img/banner/11.avif";

// Colours of the sections above and below, so the curves blend in.
const TOP_FILL = "#ffffff";
const BOTTOM_FILL = "#ffffff";

/* ---------------------------- Component ----------------------------- */

const IntroVideo = () => {
  return (
    <section className="relative isolate bg-white py-28 lg:py-40">
      {/* background image + white gradient layer */}
      <Image
        src="/img/banner/bg1.avif"
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-linear-to-b from-white via-white/60 to-white"
      />

      {/* light green gradient at the top */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-[#00852B]/20 via-[#00852B]/5 to-transparent"
      />

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

      {/* top curve */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-10 w-full lg:h-14"
      >
        <path d="M0 0H1440V0Q720 120 0 0Z" fill={TOP_FILL} />
        <path
          d="M0 0Q720 120 1440 0"
          fill="none"
          stroke="#00852B"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* content */}
      <div className="mx-auto grid max-w-332 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_640px_1fr] xl:px-0">
        {/* left text */}
        <div className="text-center lg:text-left">
          <h2 className="font-serif text-3xl leading-snug text-[#111]">
            The team you’ll actually work with
          </h2>
          <span className="mx-auto mt-4 block h-0.5 w-18 bg-[#00852B] lg:mx-0" />
        </div>

        {/* video */}
        <div className="relative aspect-video overflow-hidden rounded-3xl bg-black shadow-[0_30px_60px_-25px_rgba(0,0,0,0.5)]">
          <video
            src={VIDEO_SRC}
            poster={VIDEO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        </div>

        {/* right script text */}
        <div className="text-center lg:text-left">
          <p
            className={`${script.className} -rotate-6 text-5xl leading-[0.95] text-[#111] sm:text-6xl`}
          >
            People
            <br />
            Behind
            <br />
            Your Progress
          </p>
          <span className="mx-auto mt-5 block h-0.5 w-16 bg-[#00852B] lg:mx-0" />
        </div>
      </div>

      {/* bottom curve with green line */}
      {/* bottom curve with green line */}
      {/* <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-10 w-full lg:h-14"
      >
        <path d="M0 60H1440V60Q720 -60 0 60Z" fill={BOTTOM_FILL} />
        <path
          d="M0 60Q720 -60 1440 60"
          fill="none"
          stroke="#00852B"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg> */}
    </section>
  );
};

export default IntroVideo;
