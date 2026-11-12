"use client";

import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Title from "../components/Title";

const BG_IMAGE = "/img/banner/bg1.avif";

// Logos: full image path in /public (img)
const partners = [
  {
    title: "FTA Approved Tax Agency",
    text: "Registered Tax Agency · No. 30008692",
    img: "/img/partners/1.webp",
  },
  {
    title: "RAKEZ Appreciation Certificate",
    text: "Recognised for Excellence in Partner Performance",
    img: "/img/partners/2.avif",
  },
  {
    title: "IFZA Gold Tier Partner Recognition",
    text: "Gold Tier Recognition · Elite Loyalty Programme",
    img: "/img/partners/3.avif",
  },
  {
    title: "Accounting Software Experience",
    text: "Hands-on Experience Across Leading Accounting Platforms",
    img: "/img/partners/4.svg",
  },
  {
    title: "ACCA Approved Employer",
    text: "Trainee & Professional Development · ID 29477922",
    img: "/img/partners/5.avif",
  },
  {
    title: "ICAEW Approved Employer",
    text: "Supporting Professional Training and Development",
    img: "/img/partners/6.avif",
  },
  {
    title: "KIZAD",
    text: "Business Setup Partner in Abu Dhabi",
    img: "/img/partners/7.webp",
  },
  {
    title: "Meydan Free Zone",
    text: "Company Formation Partner in Dubai",
    img: "/img/partners/8.webp",
  },
];

const arrowBtn =
  "flex h-9 w-9 items-center justify-center rounded-full border border-[#00852B] bg-white text-[#111] shadow-sm transition-colors hover:bg-[#00852B] hover:text-white cursor-pointer";

const Partnership = () => {
  const track = useRef<HTMLDivElement>(null);
  const slide = (dir: 1 | -1) =>
    track.current?.scrollBy({ left: dir * 256, behavior: "smooth" });

  return (
    <section className="relative  bg-[#F4F8F5] pb-28 pt-12 text-[#111]">
      {/* Background image, fading from the banner's curve color */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BG_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-b from-[#f4f8f5a1] to-[#F4F8F5]/80" />

      <div className="relative mx-auto max-w-8xl px-4 sm:px-8 lg:px-10">
        {/* Heading */}

        <Title
          title="Recognition, Accreditations &"
          colorTitle="Partnership"
          subtitle=" The approvals and registrations behind the work."
          watermark="Ahmed Al Mazroei"
        />

        {/* Cards */}
        <div
          ref={track}
          className="-mx-4 mt-10 flex snap-x items-center gap-4 overflow-x-auto px-4 py-3 scrollbar-none sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {partners.map(({ title, text, img }) => (
            <div
              key={title}
              className="w-60 shrink-0 snap-start rounded-xl border border-[#fab923]/40 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-[#00852B]/50 hover:shadow-md"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={title}
                onError={(e) => (e.currentTarget.hidden = true)}
                className="mx-auto mb-3 h-12 w-auto max-w-full object-contain"
              />
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-[#111]/60">{text}</p>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="mt-4 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => slide(-1)}
            aria-label="Previous"
            className={arrowBtn}
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            aria-label="Next"
            className={arrowBtn}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
