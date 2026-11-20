"use client";

import Image from "next/image";
import Link from "next/link";

import TopBanner from "./TopBanner";
import { useLang } from "@/app/services/hooks/useLang";
import { useService } from "@/app/services/hooks/useService";
import { getLabels } from "@/app/services/labels";
import { pickMedia } from "@/app/services/utils/service";

const FALLBACK_MAIN_IMAGE = "/img/banner/7.jpg";

const ServicesDetails = () => {
  const lang = useLang();
  const t = getLabels(lang);
  const { data: service, isLoading, isError } = useService();

  if (isLoading) {
    return (
      <div
        aria-hidden="true"
        className="h-[70vh] animate-pulse bg-[#080d09]"
      />
    );
  }

  if (isError || !service) {
    return (
      <section className="grid min-h-[50vh] place-items-center bg-white px-4 py-24 text-center">
        <div>
          <p role="alert" className="text-lg font-semibold text-gray-900">
            {t.notFound}
          </p>
          <Link
            href="/services"
            className="mt-5 inline-block rounded-full bg-[#3ddc6e] px-6 py-2.5 text-sm font-bold text-black transition hover:bg-gray-950 hover:text-white"
          >
            {t.backToServices}
          </Link>
        </div>
      </section>
    );
  }

  const mainImage = pickMedia(service.mainImg, lang) || FALLBACK_MAIN_IMAGE;

  return (
    <>
      <TopBanner service={service} />

      {/* ------------------------- Intro ------------------------- */}
      <section className="relative isolate  bg-white py-14 sm:py-20 lg:py-24">
        {/* Background image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/banner/bg7.avif')" }}
        />
        {/* Soft white wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-white/90"
        />
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

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:px-8">
          {/* ---------------------- Left: text ---------------------- */}
          <div>
            <div className="h-1 w-14 rounded-full bg-[#3ddc6e]" />

            {/* Rich text from the admin panel */}
            <div
              className="mt-6 max-w-2xl space-y-4 text-lg leading-8 text-gray-700 sm:text-xl [&_a]:text-[#1faa4f] [&_a]:underline [&_ol]:list-decimal [&_ol]:ps-6 [&_strong]:font-semibold [&_strong]:text-gray-950 [&_ul]:list-disc [&_ul]:ps-6"
              dangerouslySetInnerHTML={{ __html: service.desc[lang] }}
            />

            {/* Stat Card */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-[#3ddc6e]/30 bg-white/90 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.12)] backdrop-blur">
              <div className="flex h-1.5 bg-[#3ddc6e] sm:h-auto sm:flex-row">
                <span className="hidden w-1.5 shrink-0 bg-[#3ddc6e] sm:block" />
              </div>

              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-7">
                {/* Image */}
                <div className="flex shrink-0 items-center justify-center sm:w-44 sm:border-e sm:border-gray-200 sm:pe-7">
                  <Image
                    src="/img/banner/uae-tower.avif"
                    alt="UAE business skyline"
                    width={200}
                    height={120}
                    priority
                    className="h-24 w-full max-w-48 rounded-xl object-contain sm:h-28 sm:w-40"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm leading-7 text-gray-600 sm:text-base">
                    {t.statText}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------- Right: image ---------------------- */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-gray-100 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)] sm:aspect-5/6 lg:aspect-4/5">
              <Image
                src={mainImage}
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent"
              />
            </div>

            {/* round badge */}
            <div className="absolute -start-3 -top-3 grid h-28 w-28 place-items-center rounded-full border-2 border-[#3ddc6e] bg-gray-950 p-3 text-center shadow-xl sm:-start-8 sm:-top-6 sm:h-32 sm:w-32">
              <div>
                <p className="text-2xl font-extrabold leading-none text-[#3ddc6e] sm:text-3xl">
                  {t.years}
                </p>
                <p className="mt-1.5 text-[10px] leading-3 text-white/85 sm:text-[11px] sm:leading-4">
                  {t.yearsText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesDetails;
