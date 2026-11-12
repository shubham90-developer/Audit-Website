"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiGlobe } from "react-icons/fi";
import {
  HiOutlineDocumentCheck,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlineShieldCheck,
  HiOutlineUsers,
} from "react-icons/hi2";

const GOLD = "text-[#00852B]";

const STATS = [
  {
    icon: HiOutlineUsers,
    color: "text-violet-300",
    value: 25,
    suffix: "+",
    label: "Years of Experience",
  },
  {
    icon: HiOutlineGlobeAlt,
    color: "text-emerald-300",
    value: 100,
    suffix: "%",
    label: "UAE National Owned",
  },
  {
    icon: HiOutlineDocumentCheck,
    color: "text-[#00852B]",
    value: 5,
    suffix: "+",
    label: "Service Areas",
  },
  {
    icon: HiOutlineMapPin,
    color: "text-teal-300",
    value: 7,
    suffix: "+",
    label: "Emirates Covered",
  },
];

const OFFICES = [
  { city: "Dubai", country: "UAE", img: "/img/counter/1.avif", flag: "ae" },
  {
    city: "Mississauga",
    country: "Canada",
    img: "/img/counter/2.avif",
    flag: "ca",
  },
  { city: "New York", country: "USA", img: "/img/counter/3.avif", flag: "us" },
  {
    city: "Panama City",
    country: "Panama",
    img: "/img/counter/4.avif",
    flag: "pa",
  },
];

// Counts from 0 to `target` once the element scrolls into view.
const useCountUp = (target: number, duration = 2000) => {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setValue(Math.round(target * (1 - (1 - p) ** 4))); // ease-out quart
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return { ref, value };
};

const Stat = ({
  icon: Icon,
  color,
  value,
  suffix,
  label,
  first,
}: (typeof STATS)[number] & { first: boolean }) => {
  const { ref, value: current } = useCountUp(value);

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center px-3 text-center"
    >
      {!first && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-linear-to-b from-transparent via-white/25 to-transparent sm:block"
        />
      )}
      <Icon className={`h-6 w-6 ${color}`} aria-hidden="true" />
      <span className="mt-3 text-3xl font-bold leading-9 tabular-nums">
        {current.toLocaleString("en-US")}
        {suffix}
      </span>
      <span className="mt-1 min-h-9 text-[13px] leading-4.5 text-white/70">
        {label}
      </span>
    </div>
  );
};

const Counter = () => (
  <section className="relative isolate overflow-x-clip  text-white lg:pb-24">
    {/* backgrounds: clipped so the dark area slopes down toward the card on both sides */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 bg-[#0c0a07] [clip-path:polygon(0_111px,15%_241px,85%_241px,100%_111px,100%_100%,0_100%)] lg:[clip-path:polygon(0_143px,15%_273px,85%_273px,100%_143px,100%_100%,0_100%)]"
    >
      <div className="absolute inset-0 bg-[url('/img/banner/bg3.avif')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.55)_25%,rgba(0,0,0,0.35)_50%,rgba(0,0,0,0.55)_75%,#000_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.6)_0%,transparent_25%,transparent_75%,rgba(0,0,0,0.6)_100%)]" />
      <div className="absolute left-1/2 top-24 h-72 w-[70%] -translate-x-1/2 rounded-full bg-[#00852B]/10 blur-[120px]" />
    </div>

    <div className="mx-auto max-w-332 space-y-12 px-4 sm:px-6 lg:space-y-16 xl:px-0">
      {/* ============ Numbers + data security ============ */}
      <div className="relative isolate grid overflow-hidden rounded-3xl border border-[#00852B]/40 bg-[#0c0a07] shadow-[0_30px_80px_-30px_rgba(250,185,35,0.35)] lg:grid-cols-[636fr_692fr]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-[url('/img/banner/bg4.avif')] bg-cover bg-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-linear-to-r from-black/40 via-black/25 to-black/50"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-[#00852B] to-transparent"
        />

        {/* numbers */}
        <div className="px-5 py-10 sm:px-8 lg:py-12">
          <h2 className="mb-8 text-center text-3xl font-extrabold leading-8">
            Our Strength <span className={GOLD}>in Numbers</span>
          </h2>
          <div className="mx-auto grid max-w-150 grid-cols-2 gap-x-2 gap-y-10 sm:grid-cols-4 sm:gap-x-0">
            {STATS.map((s, i) => (
              <Stat key={s.label} {...s} first={i === 0} />
            ))}
          </div>
        </div>

        {/* data security */}
        <div className="relative flex flex-col items-center gap-6 border-t border-white/10 px-5 py-10 sm:px-8 md:flex-row lg:border-t-0 lg:py-12 lg:pl-12 lg:pr-10">
          <span
            aria-hidden="true"
            className="absolute bottom-8 left-0 top-8 hidden w-px bg-linear-to-b from-transparent via-white/55 to-transparent lg:block"
          />

          <div className="grid h-22.5 w-22.5 flex-none place-items-center rounded-full border border-[#00852B]/60 bg-black/70 shadow-[0_0_30px_-6px_#fab923]">
            <HiOutlineShieldCheck
              className={`h-10 w-10 ${GOLD}`}
              aria-hidden="true"
            />
          </div>

          <div className="text-center md:text-left">
            <h3 className="text-base lg:text-2xl font-semibold leading-6">
              Your data is handled{" "}
              <span className={GOLD}>securely and confidentially.</span>
            </h3>
            <p className="mt-2 text-xs leading-5 text-white/90">
              An NDA is included as standard with every engagement. Client
              records are stored in secure, access-controlled systems and can
              only be accessed by authorized team members assigned to your file.
              Records are retained only for as long as legally required, and
              your data is never shared outside the engagement team.
            </p>

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/20 bg-black/40 px-5 py-4 text-left backdrop-blur-md">
              <HiOutlineDocumentCheck
                className={`h-6 w-6 flex-none ${GOLD}`}
                aria-hidden="true"
              />
              <p className="text-xs leading-4 text-white/85">
                Professional Indemnity Insurance is in place, and a certificate
                is available upon request.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================== Global presence ================== */}
      <div className="grid items-center gap-x-10 gap-y-12 md:grid-cols-[184px_minmax(0,1fr)] xl:grid-cols-[184px_minmax(0,1fr)_625px]">
        {/* globe */}
        <div className="relative mx-auto h-46 w-46">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-1/2 hidden h-60 w-72 -translate-y-1/2 opacity-40 md:block"
            style={{
              backgroundImage:
                "radial-gradient(#00852B 1.6px, transparent 1.7px)",
              backgroundSize: "10px 10px",
              maskImage:
                "radial-gradient(ellipse at 40% 50%, #000 25%, transparent 68%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at 40% 50%, #000 25%, transparent 68%)",
            }}
          />
          <div className="absolute inset-0 rounded-full border border-[#fab923]/45" />
          <span className="absolute left-36.25 top-3.75 h-2 w-2 rounded-full bg-[#fab923] shadow-[0_0_10px_#fab923]" />
          <span className="absolute -left-0.75 top-22.25 h-1.5 w-1.5 rounded-full bg-[#fab923]" />
          <div className="absolute left-1/2 top-1/2 grid h-36.25 w-36.25 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black shadow-[0_0_40px_-10px_#fab923]">
            <FiGlobe
              className={`h-18 w-18 ${GOLD}`}
              strokeWidth={1.4}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* text */}
        <div className="text-center md:text-left">
          <p className={`text-xs font-medium uppercase tracking-[0.25em]`}>
            Global Presence
          </p>
          <h2 className="mt-2 text-[28px] font-bold leading-9.5">
            Serving clients across the <span className={GOLD}>UAE</span>,{" "}
            <span className={GOLD}>Canada</span>, the{" "}
            <span className={GOLD}>USA</span> and{" "}
            <span className={GOLD}>Panama</span>
          </h2>
          <p className="mt-4 text-sm leading-6 text-white/90 md:text-justify">
            Offices in Dubai and Canada (Mississauga), with an active presence
            in the USA and Panama. If you are entering the UAE from abroad, or
            running entities in more than one country, you deal with one firm,
            one engagement and one point of contact.
          </p>
        </div>

        {/* offices */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:col-span-2 xl:col-span-1">
          {OFFICES.map(({ city, country, img, flag }) => (
            <article
              key={city}
              className="group flex h-full flex-col items-center rounded-2xl border border-white/15 bg-linear-to-b from-white/8 to-black/50 px-2 py-7 text-center backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#fab923]/60"
            >
              <div className="relative h-14 w-24 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>
              <h3 className="mt-4 text-sm font-bold leading-5">{city}</h3>
              <p className="mt-1 text-[13px] leading-5 text-white/70">
                {country}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://flagcdn.com/w40/${flag}.png`}
                alt={`${country} flag`}
                width={24}
                height={16}
                className="mt-3 rounded-[3px]"
              />
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Counter;
