"use client";

import ThemeBtn from "@/app/components/ThemeBtn";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  HiOutlineBriefcase,
  HiOutlineBuildingOffice2,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineEnvelope,
  HiOutlineShieldCheck,
  HiOutlineUser,
  HiOutlineChevronDown,
} from "react-icons/hi2";

const BG_IMAGE = "/img/banner/bg2.avif";
const VIDEO = "/img/banner/3.mp4";

const SERVICES = [
  "Audit & Assurance",
  "Tax Services",
  "Advisory Services",
  "Consulting Services",
  "Accounting & Other Services",
];

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-3 text-sm text-white placeholder:text-white/50 outline-none transition focus:border-[#3ddc6e] focus:bg-white/10 focus:ring-4 focus:ring-[#3ddc6e]/15";
const icon =
  "pointer-events-none absolute left-3.5 top-3.5 h-[18px] w-[18px] text-[#3ddc6e]";

const TopBanner = () => {
  const router = useRouter();
  const [sent, setSent] = useState(false);

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
        style={{ backgroundImage: `url('${BG_IMAGE}')` }}
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
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[52%] lg:block">
        <video
          src={VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          style={{ clipPath: "ellipse(100% 78% at 100% 50%)" }}
        />
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
            Accounting Services in UAE
          </span>

          <h1 className="mt-5 text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[46px] xl:text-[52px]">
            Expert Accounting Solutions for Diverse Business Needs in the{" "}
            <span className="text-[#3ddc6e]">UAE</span>
          </h1>

          <div className="mt-5 h-1 w-14 rounded-full bg-[#3ddc6e]" />

          <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:text-base">
            We would love to respond to your queries and help you succeed. Feel
            free to get in touch with our professional team.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ThemeBtn onClick={() => router.push("/contact")}>
              Book Free 20-Min Call
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
            Talk to Our <span className="text-[#3ddc6e]">Experts</span>
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-center text-xs leading-5 text-white/70">
            Tell us what you need and our team will get back to you with the
            right solution.
          </p>

          {sent ? (
            <div
              role="status"
              className="mt-8 rounded-2xl border border-[#3ddc6e]/40 bg-[#3ddc6e]/10 p-6 text-center"
            >
              <p className="text-lg font-bold text-[#3ddc6e]">Thank you!</p>
              <p className="mt-1 text-sm text-white/80">
                We&apos;ve received your request and will contact you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="relative block">
                  <span className="sr-only">Your name</span>
                  <HiOutlineUser className={icon} aria-hidden />
                  <input
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your Name"
                    className={field}
                  />
                </label>
                <label className="relative block">
                  <span className="sr-only">Business name</span>
                  <HiOutlineBriefcase className={icon} aria-hidden />
                  <input
                    name="business"
                    autoComplete="organization"
                    placeholder="Business Name"
                    className={field}
                  />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="relative block">
                  <span className="sr-only">Email address</span>
                  <HiOutlineEnvelope className={icon} aria-hidden />
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Email Address"
                    className={field}
                  />
                </label>
                <div className="flex gap-2">
                  <span className="grid shrink-0 place-items-center rounded-xl border border-white/15 bg-white/5 px-3 text-sm font-medium text-white">
                    +971
                  </span>
                  <label className="block min-w-0 flex-1">
                    <span className="sr-only">Mobile number</span>
                    <input
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel-national"
                      placeholder="Mobile"
                      className={`${field} pl-3`}
                    />
                  </label>
                </div>
              </div>

              <label className="relative block">
                <span className="sr-only">Service</span>
                <HiOutlineBuildingOffice2 className={icon} aria-hidden />
                <select
                  name="service"
                  defaultValue={SERVICES[0]}
                  className={`${field} cursor-pointer appearance-none pr-10`}
                >
                  {SERVICES.map((s) => (
                    <option key={s} value={s} className="bg-gray-900">
                      {s}
                    </option>
                  ))}
                </select>
                <HiOutlineChevronDown
                  aria-hidden
                  className="pointer-events-none absolute right-3.5 top-3.5 h-4.5 w-4.5 text-[#3ddc6e]"
                />
              </label>

              <label className="block">
                <span className="sr-only">Message</span>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="How can we help you?"
                  className={`${field} resize-none pl-3.5`}
                />
              </label>

              <ThemeBtn className="w-full">Send Message</ThemeBtn>

              <p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-white/60">
                <HiOutlineShieldCheck
                  aria-hidden
                  className="h-4 w-4 text-[#3ddc6e]"
                />
                No obligation. Your information is secure and confidential.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopBanner;
