"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FiCalendar, FiClock } from "react-icons/fi";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import Link from "next/link";

type TopBannerProps = {
  category?: string;
  title?: string;
  author?: string;
  authorImage?: string;
  reviewedBy?: string;
  updated?: string;
  readTime?: string;
  bgImage?: string;
};

const TopBanner = ({
  category = "",
  title = "",
  author = "",
  authorImage = "",
  reviewedBy = "",
  updated = "",
  readTime = "",
  bgImage = "/img/banner/bg3.avif",
}: TopBannerProps) => {
  const [url, setUrl] = useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setUrl(window.location.href), []);

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const shares = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      icon: FaFacebookF,
      cls: "bg-[#1877f2] text-white",
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      icon: FaXTwitter,
      cls: "bg-black text-white ring-1 ring-white/20",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      icon: FaLinkedinIn,
      cls: "bg-[#0a66c2] text-white",
    },
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${t}%20${u}`,
      icon: FaWhatsapp,
      cls: "bg-[#25d366] text-white",
    },
  ];

  const label =
    "text-[10px] font-semibold uppercase tracking-[0.15em] text-[#3ddc6e]";

  return (
    <section className="relative isolate  bg-gray-950 py-10 sm:py-14 lg:py-16">
      {/* background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      {/* dark gradient: solid on the left for text, opens up on the right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-linear-to-r from-gray-950 via-gray-950/85 to-gray-950/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-gray-950/80 to-transparent"
      />
      {/* bottom accent line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#3ddc6e]/70 to-transparent"
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:gap-10 lg:px-8">
        {/* share rail */}
        <aside
          aria-label="Share this article"
          className="flex shrink-0 items-center gap-4 self-start rounded-3xl border border-[#3ddc6e]/50 bg-black/30 px-4 py-3 backdrop-blur-md lg:w-20 lg:flex-col lg:gap-3 lg:px-0 lg:py-5"
        >
          <span
            aria-hidden="true"
            className="hidden h-0.5 w-5 rounded-full bg-[#3ddc6e] lg:block"
          />
          <p className="text-[10px] font-bold uppercase leading-4 tracking-widest text-white lg:text-center">
            Share
            <br className="hidden lg:block" /> this
            <br className="hidden lg:block" /> article
          </p>
          <span
            aria-hidden="true"
            className="hidden h-px w-8 bg-white/15 lg:block"
          />
          <ul className="flex items-center gap-2.5 lg:flex-col">
            {shares.map(({ name, href, icon: Icon, cls }) => (
              <li key={name}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Share on ${name}`}
                  className={`grid h-9 w-9 place-items-center rounded-full text-sm transition hover:-translate-y-0.5 hover:scale-110 hover:shadow-lg ${cls}`}
                >
                  <Icon aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* content */}
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full border border-[#3ddc6e]/60 bg-[#3ddc6e]/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3ddc6e]">
            {category}
          </span>

          <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {/* meta */}
          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-0">
            {/* author */}
            <div className="flex items-center gap-3 sm:pr-6">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-gray-800 ring-2 ring-[#3ddc6e]">
                <Image
                  src={authorImage}
                  alt={author}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className={label}>Author</p>
                <p className="mt-0.5 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4">
                  {author}
                </p>
              </div>
            </div>

            {/* reviewed by */}
            <div className="sm:max-w-xs sm:border-l sm:border-white/15 sm:px-6">
              <p className={label}>Reviewed by</p>
              <p className="mt-0.5 text-sm font-semibold leading-5 text-white">
                {reviewedBy}
              </p>
            </div>

            {/* last updated */}
            <div className="flex items-center gap-3 sm:border-l sm:border-white/15 sm:px-6">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[#3ddc6e]">
                <FiCalendar aria-hidden />
              </span>
              <div>
                <p className={label}>Last updated</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {updated}
                </p>
              </div>
            </div>

            {/* reading time */}
            <div className="flex items-center gap-3 sm:border-l sm:border-white/15 sm:pl-6">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-[#3ddc6e]">
                <FiClock aria-hidden />
              </span>
              <div>
                <p className={label}>Reading time</p>
                <p className="mt-0.5 text-sm font-semibold text-white">
                  {readTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBanner;
