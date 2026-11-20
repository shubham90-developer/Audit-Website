"use client";

import ThemeBtn from "@/app/components/ThemeBtn";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  useGetServicesQuery,
  type Service,
} from "@/app/store/api/servicesApi";
import { useLang } from "@/app/services/hooks/useLang";
import { getLabels } from "@/app/services/labels";
import { pickMedia, stripHtml } from "@/app/services/utils/service";

import {
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineEnvelope,
  HiOutlineShieldCheck,
  HiOutlineUser,
  HiOutlineChevronDown,
} from "react-icons/hi2";

const FALLBACK_BG_IMAGE = "/img/banner/bg2.avif";

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 py-3 ps-10 pe-3 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-[#3ddc6e] focus:bg-white/10 focus:ring-4 focus:ring-[#3ddc6e]/15";
const icon =
  "pointer-events-none absolute start-3.5 top-3.5 h-[18px] w-[18px] text-[#3ddc6e]";

const TopBanner = ({ service }: { service: Service }) => {
  const router = useRouter();
  const lang = useLang();
  const t = getLabels(lang);
  const [sent, setSent] = useState(false);

  const { data: allServices = [] } = useGetServicesQuery();

  const title = stripHtml(service.title[lang]);
  const description = stripHtml(service.desc[lang]);
  const bgImage = pickMedia(service.bgImage, lang) || FALLBACK_BG_IMAGE;
  const bgVideo = pickMedia(service.bgVideo, lang);
  // Stored in English so the admin always reads the same value.
  const currentService = stripHtml(service.title.en);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    // TODO: send `data` to your API route / email service
    console.log(data);
    setSent(true);
  };

  return (
    <section className="relative isolate  bg-[#080d09] py-12 text-white sm:py-14 lg:py-16">
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      {/* Dark overlay */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-black/70" />
      {/* Green ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-0 -z-10 h-112.5 w-150 rounded-full blur-[130px]"
        style={{ background: "rgba(61,220,110,0.13)" }}
      />

      {/* Right video (desktop) */}
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[52%] lg:block rtl:right-auto rtl:left-0 rtl:-scale-x-100">
        {bgVideo && (
          <video
            key={bgVideo}
            src={bgVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
            style={{ clipPath: "ellipse(100% 78% at 100% 50%)" }}
          />
        )}
        {/* darken so the form stays readable on top of the video */}
        <div className="absolute inset-0 bg-linear-to-l from-black/30 via-black/45 to-black/60" />

        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <path
            d="M23.2 0A100 78 0 0 0 23.2 100"
            fill="none"
            stroke="#3ddc6e"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-12 lg:px-8 xl:grid-cols-[minmax(0,1fr)_460px]">
        {/* ------------------------ Left content ------------------------ */}
        <div className="relative max-w-xl lg:max-w-none">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#3ddc6e]/30 bg-[#3ddc6e]/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7bea9c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc6e]" />
            {t.bannerBadge}
          </span>

          <h1 className="mt-5 text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[46px] xl:text-[52px]">
            {title}
          </h1>

          <div className="mt-5 h-1 w-14 rounded-full bg-[#3ddc6e]" />

          <p className="mt-5 line-clamp-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
            {description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ThemeBtn onClick={() => router.push("/contact")}>
              {t.bookCall}
            </ThemeBtn>
          </div>
        </div>

        {/* ------------------------ Contact form ------------------------ */}
        <div
          id="get-quote"
          className="relative rounded-3xl border border-[#3ddc6e]/50 bg-black/55 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:p-7"
        >
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-[#3ddc6e] text-black">
            <HiOutlineChatBubbleBottomCenterText
              className="h-6 w-6"
              aria-hidden
            />
          </div>
          <h2 className="mt-4 text-center text-2xl font-bold tracking-tight sm:text-[28px]">
            {t.talkTo} <span className="text-[#3ddc6e]">{t.experts}</span>
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-center text-xs leading-5 text-white/70">
            {t.formIntro}
          </p>

          {sent ? (
            <div
              role="status"
              className="mt-8 rounded-2xl border border-[#3ddc6e]/40 bg-[#3ddc6e]/10 p-6 text-center"
            >
              <p className="text-lg font-bold text-[#3ddc6e]">{t.thanks}</p>
              <p className="mt-1 text-sm text-white/80">
                {t.thanksText}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="relative block">
                  <span className="sr-only">{t.yourName}</span>
                  <HiOutlineUser className={icon} aria-hidden />
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder={t.yourName}
                    className={field}
                  />
                </label>
                <label className="relative block">
                  <span className="sr-only">{t.businessName}</span>
                  <HiOutlineBriefcase className={icon} aria-hidden />
                  <input
                    name="business"
                    autoComplete="organization"
                    placeholder={t.businessName}
                    className={field}
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="relative block">
                  <span className="sr-only">{t.email}</span>
                  <HiOutlineEnvelope className={icon} aria-hidden />
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={t.email}
                    className={field}
                  />
                </label>
                <div className="flex gap-2">
                  <span className="grid shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-medium text-white">
                    +971
                  </span>
                  <label className="block min-w-0 flex-1">
                    <span className="sr-only">{t.mobile}</span>
                    <input
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel-national"
                      placeholder={t.mobile}
                      className={`${field} ps-3`}
                    />
                  </label>
                </div>
              </div>

              <label className="relative block">
                <span className="sr-only">{title}</span>
                <HiOutlineBuildingOffice2 className={icon} aria-hidden />
                <select
                  key={currentService}
                  name="service"
                  defaultValue={currentService}
                  className={`${field} cursor-pointer appearance-none pe-10`}
                >
                  {allServices.map((item) => (
                    <option
                      key={item._id}
                      value={stripHtml(item.title.en)}
                      className="bg-gray-900"
                    >
                      {stripHtml(item.title[lang])}
                    </option>
                  ))}
                </select>
                <HiOutlineChevronDown
                  aria-hidden
                  className="pointer-events-none absolute end-3.5 top-3.5 h-4.5 w-4.5 text-[#3ddc6e]"
                />
              </label>

              <label className="block">
                <span className="sr-only">{t.message}</span>
                <textarea
                  name="message"
                  rows={3}
                  placeholder={t.message}
                  className={`${field} resize-none ps-3.5`}
                />
              </label>

              <ThemeBtn className="w-full">{t.send}</ThemeBtn>

              <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-white/60">
                <HiOutlineShieldCheck
                  aria-hidden
                  className="h-4 w-4 text-[#3ddc6e]"
                />
                {t.secure}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopBanner;
