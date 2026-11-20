"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";

import { useGetServicesQuery } from "@/app/store/api/servicesApi";
import { useLang } from "@/app/services/hooks/useLang";
import { getLabels } from "@/app/services/labels";
import { pickMedia, slugify, stripHtml } from "@/app/services/utils/service";

const Services: React.FC = () => {
  const lang = useLang();
  const t = getLabels(lang);
  const { data: services = [], isLoading, isError } = useGetServicesQuery();

  return (
    <section className="relative isolate  bg-white py-14 sm:py-20 lg:py-24">
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/banner/services.avif')" }}
      />
      {/* Soft white wash */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-white/80" />

      {/* Green glow, top center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-112.5"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at 50% 0%, rgba(61,220,110,0.18), transparent 75%)",
        }}
      />
      {/* Faint grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="min-h-80 animate-pulse rounded-3xl bg-gray-900/90"
              />
            ))}

          {isError && (
            <p
              role="alert"
              className="col-span-full rounded-3xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700"
            >
              {t.loadError}
            </p>
          )}

          {services.map((service, index) => {
            const name = stripHtml(service.title[lang]);
            const text = stripHtml(service.desc[lang]);
            const image = pickMedia(service.cardImg, lang);
            const icon = pickMedia(service.iconImg, lang);

            return (
              <Link
                key={service._id}
                href={`/services/${slugify(service.title.en)}/${service._id}`}
                className="group relative isolate flex min-h-80 flex-col overflow-hidden rounded-3xl border border-white/10 bg-gray-950 p-6 text-white shadow-[0_10px_40px_-18px_rgba(0,0,0,0.6)] transition duration-300 hover:-translate-y-1.5 hover:border-[#3ddc6e]/60 hover:shadow-[0_28px_60px_-20px_rgba(61,220,110,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ddc6e] sm:p-7"
              >
                {/* image */}
                {image && (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="-z-20 object-cover opacity-70 transition duration-700 group-hover:scale-110"
                  />
                )}
                {/* dark gradient: image shows at top, solid at bottom for text */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-linear-to-b from-gray-950/30 via-gray-950/75 to-gray-950"
                />
                {/* top accent line */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-[#3ddc6e]/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
                />

                {/* top row */}
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-[#3ddc6e]/50 bg-black/40 backdrop-blur transition duration-300 group-hover:bg-[#3ddc6e]">
                    {icon && (
                      <Image
                        src={icon}
                        alt=""
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                      />
                    )}
                  </span>
                  <span className="text-2xl font-bold tracking-wide text-[#3ddc6e]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* bottom content */}
                <div className="mt-auto pt-16">
                  <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-0.5 w-8 rounded-full bg-[#3ddc6e] transition-all duration-300 group-hover:w-16"
                  />
                  <p className="mt-4 line-clamp-3 text-sm leading-7 text-gray-300">
                    {text}
                  </p>

                  <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-[#3ddc6e]">
                    {t.exploreService}
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-[#3ddc6e]/50 transition duration-300 group-hover:translate-x-1 group-hover:bg-[#3ddc6e] group-hover:text-black rtl:group-hover:-translate-x-1">
                      <FiArrowRight
                        size={14}
                        aria-hidden
                        className="rtl:rotate-180"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* CTA card */}
          <div className="relative isolate flex min-h-80 flex-col justify-between overflow-hidden rounded-3xl border border-[#3ddc6e]/40 bg-linear-to-br from-gray-950 via-gray-900 to-[#0b3d1d] p-6 text-white shadow-[0_10px_40px_-18px_rgba(0,0,0,0.6)] sm:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#3ddc6e]/20"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-5 -top-5 h-32 w-32 rounded-full border border-[#3ddc6e]/20"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-10 -z-10 h-56 w-56 rounded-full bg-[#3ddc6e]/15 blur-3xl"
            />

            <div className="relative">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3ddc6e]">
                {t.letsTalk}
              </span>
              <h3 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
                {t.ctaTitle}
              </h3>
              <span
                aria-hidden="true"
                className="mt-4 block h-0.5 w-8 rounded-full bg-[#3ddc6e]"
              />
              <p className="mt-4 text-sm leading-7 text-gray-300">
                {t.ctaText}
              </p>
            </div>

            <Link
              href="/contact"
              className="relative mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#3ddc6e] py-2 pl-5 pr-2 text-sm font-bold text-black transition duration-300 hover:bg-white"
            >
              {t.bookConsultation}
              <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-[#3ddc6e]">
                <FiArrowUpRight size={16} aria-hidden className="rtl:-scale-x-100" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
