"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { FiHeadphones, FiClock, FiPhone, FiMail } from "react-icons/fi";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import ThemeBtn from "../components/ThemeBtn";
import Title from "../components/Title";

/* ------------------------------ Data ------------------------------ */

const info = [
  { label: "Office hours", value: "Mon – Sat: 09am to 06pm", icon: FiClock },
  {
    label: "Phone",
    value: "+971 52 178 6209",
    href: "tel:+971521786209",
    icon: FiPhone,
  },
  {
    label: "Email",
    value: "info@almazroeiaudit.com",
    href: "mailto:info@almazroeiaudit.com",
    icon: FiMail,
  },
];

const socials = [
  { label: "Facebook", icon: FaFacebookF, href: "#" },
  { label: "Instagram", icon: FaInstagram, href: "#" },
  { label: "LinkedIn", icon: FaLinkedin, href: "#" },
];

/* ---------------------------- Helpers ----------------------------- */

const inputCls =
  "w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#00852B] focus:bg-white focus:ring-4 focus:ring-[#00852B]/10";

// Slides + fades its children in once, when they scroll into view.
const hidden = {
  up: "translate-y-10",
  left: "-translate-x-10",
  right: "translate-x-10",
};

function Reveal({
  children,
  from = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  from?: keyof typeof hidden;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition duration-700 ease-out motion-reduce:transition-none ${
        shown
          ? "translate-x-0 translate-y-0 opacity-100"
          : `${hidden[from]} opacity-0`
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      <input required={required} className={inputCls} {...props} />
    </label>
  );
}

/* --------------------------- Component ---------------------------- */
const MARQUEE_TEXT = "ACCOUNTING • TAX • AUDIT • ";
const MARQUEE_SECONDS = 60;

export default function IndustriesWeServe() {
  return (
    <section className="relative isolate w-full  bg-slate-50 px-4 pb-12 pt-20 sm:px-6 sm:pb-16 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-32">
      {/* section background image + soft overlay */}
      <Image
        src="/img/banner/bg5.avif"
        alt=""
        fill
        sizes="100vw"
        className="-z-30 object-cover"
      />
      <div className="absolute inset-0 -z-20 bg-slate-50/85" />

      {/* light green gradient at the top */}
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-[#00852B]/20 via-[#00852B]/5 to-transparent" />

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

      {/* top curve: fill = colour of the section above */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-10 w-full overflow-visible lg:h-14"
      >
        <path d="M0 0H1440Q720 120 0 0Z" fill="#ffffff" />
        <path
          d="M0 0Q720 120 1440 0"
          fill="none"
          stroke="#00852B"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl">
        {/* heading */}
        <Title
          title="Need an Audit or"
          colorTitle="Tax Advice?"
          subtitle="    Speak to our team today. Your first consultation is free and
            confidential."
          watermark="Ahmed Al Mazroei"
        />

        {/* main card */}
        <div className="relative mt-10 isolate overflow-hidden rounded-[28px] bg-slate-950 shadow-2xl shadow-slate-900/10 sm:rounded-[36px]">
          <Image
            src="/img/banner/1.jpg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            className="-z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-linear-to-br from-slate-950/95 via-slate-950/75 to-purple-950/60" />

          <div className="relative grid gap-10 p-5 sm:p-8 md:p-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 lg:p-14">
            {/* form */}
            <Reveal from="left" className="min-w-0">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="rounded-2xl bg-white p-5 shadow-xl shadow-black/10 sm:rounded-3xl sm:p-7 lg:p-8"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  Send us an enquiry
                </h3>
                <p className="mb-6 mt-1 text-sm text-slate-500">
                  Fill in your details and we&apos;ll get back to you.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  <div className="space-y-4">
                    <Field
                      label="Full name"
                      name="name"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                    />
                    <Field
                      label="Email address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                    />
                    <Field
                      label="Phone number"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Your phone number"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-4">
                    <Field
                      label="Subject"
                      name="subject"
                      placeholder="How can we help?"
                    />
                    <label className="flex flex-1 flex-col">
                      <span className="mb-2 block text-xs font-semibold text-slate-600">
                        Your message
                      </span>
                      <textarea
                        name="message"
                        placeholder="Tell us about your requirements..."
                        className={`${inputCls} min-h-36 flex-1 resize-y`}
                      />
                    </label>
                  </div>
                </div>

                <ThemeBtn className="mt-4 w-full">Send Request</ThemeBtn>
                <p className="mt-4 text-center text-xs text-slate-400">
                  Your information will be handled confidentially.
                </p>
              </form>
            </Reveal>

            {/* contact panel */}
            <Reveal from="right" delay={150} className="min-w-0 self-center">
              <aside className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl sm:p-8 lg:p-7 xl:p-8">
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-white/15 bg-white/10 text-[#4ade80]">
                  <FiHeadphones className="h-7 w-7" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4ade80]">
                  Get in touch
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  We&apos;re here to help.
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Have a question or need expert advice? Reach out to our team.
                </p>

                <div className="my-7 h-px bg-white/15" />

                <ul className="space-y-6">
                  {info.map(({ label, value, href, icon: Icon }) => (
                    <li key={label} className="flex min-w-0 gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-[#4ade80]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                          {label}
                        </p>
                        {href ? (
                          <Link
                            href={href}
                            className="mt-1 block wrap-break-word text-sm font-medium text-white transition hover:text-[#4ade80]"
                          >
                            {value}
                          </Link>
                        ) : (
                          <p className="mt-1 text-sm font-medium">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="my-7 h-px bg-white/15" />

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Follow us</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Stay connected with us
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {socials.map(({ label, icon: Icon, href }) => (
                      <a
                        key={label}
                        href={href}
                        aria-label={label}
                        className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-sm transition hover:border-[#00852B] hover:bg-[#00852B]"
                      >
                        <Icon />
                      </a>
                    ))}
                  </div>
                </div>
              </aside>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
