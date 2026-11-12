"use client";

import {
  HiOutlineChartBar,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineUsers,
} from "react-icons/hi2";
import ThemeBtn from "../components/ThemeBtn";
import { useRouter } from "next/navigation";
import RippleBg from "../about/components/RippleBg";

/* ----------------------------- Content ----------------------------- */

const BG_IMAGE = "/img/banner/bg6.avif"; // replace with your skyline image

// Colours of the sections above and below, so the curves blend in with no gap.
const TOP_FILL = "#ffffff";
const BOTTOM_FILL = "#ffffff";

const FEATURES = [
  { icon: HiOutlineUsers, label: ["Trusted", "by Businesses"] },
  { icon: HiOutlineShieldCheck, label: ["Expert", "Guidance"] },
  { icon: HiOutlineChartBar, label: ["Tailored", "Solutions"] },
  { icon: HiOutlineClock, label: ["Responsive", "Support"] },
];

/* ---------------------------- Component ----------------------------- */

const ReadyToWork = () => {
  const router = useRouter();
  return (
    <section className="relative isolate -mt-px bg-black py-24 text-white lg:py-32">
      {/* background image + dark gradients */}
      <RippleBg src={BG_IMAGE} />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,#000_0%,transparent_30%,transparent_70%,#000_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-linear-to-b from-black/50 via-black/20 to-black/70"
      />

      {/* top curve */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-10 w-full overflow-visible lg:h-14"
      >
        <path d="M0 0H1440V60Q720 -60 0 60Z" fill={TOP_FILL} />
        <path
          d="M0 60Q720 -60 1440 60"
          fill="none"
          stroke="#00852B"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="mx-auto flex max-w-332 flex-col items-center px-4 sm:px-6">
        {/* main card */}
        <div className="relative w-full max-w-3xl rounded-2xl border border-[#00852B]/70 bg-black/45 px-8 pb-8 pt-12 text-center backdrop-blur-md">
          <span className="absolute left-1/2 top-7 h-px w-8 -translate-x-1/2 bg-white/50" />

          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Ready to Work
            <br />
            Ahmed Al Mazroei
          </h2>
          <p className="mt-5 text-sm leading-6 text-white/85">
            Tell us about your business, your accounting needs, and where you
            need support. Our team will help you identify the right services for
            your business.
          </p>

          <ThemeBtn className="mt-3" onClick={() => router.push("/contact")}>
            Book a Consultation
          </ThemeBtn>

          <div className="mt-4 flex items-center justify-center gap-3 text-xs">
            <span className="h-px w-9 bg-[#00852B]" />
            <span>Private Consultation</span>
            <span>Tailored Advice</span>
            <span className="h-px w-9 bg-[#00852B]" />
          </div>
        </div>

        {/* feature tiles */}
        <div className="mt-14 grid w-full max-w-157.5 grid-cols-2 gap-3 sm:grid-cols-4">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label[0]}
              className="flex flex-col items-center rounded-xl border border-[#00852B]/50 bg-black/50 px-2 py-5 text-center backdrop-blur-md"
            >
              <Icon className="h-6 w-6 text-[#3ddc6e]" aria-hidden="true" />
              <p className="mt-2 text-xs font-semibold leading-4">
                {label[0]}
                <br />
                {label[1]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* bottom curve */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-px h-10 w-full overflow-visible lg:h-14"
      >
        <path d="M0 60H1440V0Q720 120 0 0Z" fill={BOTTOM_FILL} />
        <path
          d="M0 0Q720 120 1440 0"
          fill="none"
          stroke="#00852B"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </section>
  );
};

export default ReadyToWork;
