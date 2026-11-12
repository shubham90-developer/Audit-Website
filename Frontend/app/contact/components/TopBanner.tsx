"use client";

import { FaWhatsapp } from "react-icons/fa";
import {
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
} from "react-icons/hi2";

const BG_IMAGE = "/img/banner/bg2.avif";
const VIDEO = "/img/banner/2.mp4";

const CONTACTS = [
  {
    icon: HiOutlinePhone,
    label: "Call Us",
    value: "+97156 742 3428",
    href: "tel:+97156 742 3428",
  },
  {
    icon: HiOutlineEnvelope,
    label: "Email Us",
    value: "info@almazroeiaudit.com",
    href: "mailto:info@almazroeiaudit.com",
  },
  {
    icon: FaWhatsapp,
    label: "WhatsApp",
    value: "+97156 742 3428",
    href: "https://wa.me/+97156 742 3428",
  },
  {
    icon: HiOutlineMapPin,
    label: "Office Address",
    value:
      "M-02, Building #19, Seashell Building, Medina St - Al Khalidiyah - W9 - Abu Dhabi",
  },
];

const TopBanner = () => {
  return (
    <section className="relative isolate  bg-[#080d09] py-12 text-white sm:py-14 lg:py-16">
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-center"
        style={{ backgroundImage: `url('${BG_IMAGE}')` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-20 bg-black/65" />

      {/* Green Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 left-0 -z-10 h-112.5 w-150 rounded-full blur-[130px]"
        style={{ background: "rgba(61,220,110,0.13)" }}
      />

      {/* Right Video */}
      <div className="absolute inset-y-0 right-0 -z-10 hidden w-[48%] lg:block">
        <video
          src={VIDEO}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          style={{
            clipPath: "ellipse(100% 78% at 100% 50%)",
          }}
        />

        <div className="absolute inset-0 bg-linear-to-l from-transparent via-black/5 to-black/30" />

        <svg
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="relative max-w-xl lg:max-w-[48%]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#3ddc6e]/30 bg-[#3ddc6e]/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7bea9c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc6e]" />
            Let&apos;s get in touch
          </span>

          <h1 className="mt-5 text-3xl font-bold leading-[1.12] tracking-tight sm:text-4xl lg:text-[52px]">
            Need Help?
            <br />
            <span className="text-[#3ddc6e]">Contact Us</span>
          </h1>

          <div className="mt-5 h-1 w-14 rounded-full bg-[#3ddc6e]" />

          <p className="mt-5 max-w-md text-sm leading-7 text-white/75 sm:text-base">
            We would love to respond to your queries and help you succeed. Feel
            free to get in touch with our professional team.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {CONTACTS.map(({ icon: Icon, label, value, href }) => {
            const card = (
              <>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[#3ddc6e]/20 bg-[#3ddc6e]/10 text-[#3ddc6e] transition-all duration-300 group-hover:bg-[#3ddc6e] group-hover:text-[#101c13]">
                  <Icon className="h-4.5 w-4.5" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.13em] text-[#3ddc6e]">
                    {label}
                  </span>

                  <span className="mt-1 block wrap-break-word text-xs font-medium leading-5 text-white/90 sm:text-[13px]">
                    {value}
                  </span>
                </span>
              </>
            );

            const cardClass =
              "group flex min-h-[88px] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.08] p-3.5 shadow-[0_5px_20px_rgba(0,0,0,0.12)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#3ddc6e]/50 hover:bg-white/[0.12] hover:shadow-[0_10px_30px_rgba(61,220,110,0.10)]";

            return href ? (
              <a key={label} href={href} className={cardClass}>
                {card}
              </a>
            ) : (
              <div key={label} className={cardClass}>
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TopBanner;
