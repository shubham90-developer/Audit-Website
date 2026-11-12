"use client";

import Image from "next/image";
import { FiCornerRightUp } from "react-icons/fi";
import ThemeBtn from "./ThemeBtn";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ContactBanner = () => {
  const router = useRouter();
  return (
    <section className="w-full overflow-x-clip bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative mx-auto grid max-w-8xl grid-cols-2 items-center gap-x-4 gap-y-10 overflow-hidden rounded-3xl  px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[240px_minmax(0,1fr)_240px] lg:gap-x-8 lg:px-12 lg:py-12">
        {/* Background image */}
        <Image
          src="/img/banner/shape.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-fill"
        />

        {/* Left photo + call badge */}
        <div className="relative z-10 order-2 w-full max-w-60 justify-self-center lg:order-1 lg:self-start">
          <div className="relative aspect-240/336 overflow-hidden rounded-2xl">
            <Image
              src="/img/banner/4.jpg"
              alt="Support consultant"
              fill
              sizes="(max-width: 1024px) 40vw, 240px"
              className="object-cover"
            />
          </div>

          {/* Call badge */}
          <div className="absolute -bottom-4 -right-2 rotate-[-8deg] sm:-right-3 lg:-right-8">
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-y-1.5 rounded-lg bg-orange-400"
            />
            <Link
              href="tel:+97145584937"
              className="relative block whitespace-nowrap rounded-lg bg-white px-3 py-2 text-[11px] font-semibold text-slate-800 shadow-lg transition-transform hover:-translate-y-0.5 sm:text-sm"
            >
              <span className="text-orange-700">Call:</span> +971 52 178 6209
            </Link>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 order-1 col-span-2 min-w-0 text-center lg:order-2 lg:col-span-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400 sm:text-sm">
            Need an Audit or Tax Advice?
          </p>

          <h2 className="text-3xl font-medium leading-tight tracking-tight text-white sm:text-4xl lg:text-4xl xl:text-5xl">
            Believe us when it comes to investment
          </h2>

          <div className="mt-7 flex flex-col items-center justify-center gap-5 sm:mt-8 sm:flex-row sm:gap-6 sm:text-left">
            <FiCornerRightUp
              aria-hidden="true"
              className="hidden shrink-0 text-5xl text-slate-400 lg:block xl:text-6xl"
              strokeWidth={0.8}
            />

            {/* Supporting image */}
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-28 sm:w-28">
              <Image
                src="/img/banner/7.jpg"
                alt="Financial report"
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div className="max-w-xs">
              <p className="mb-4 text-sm leading-6 text-slate-300">
                Speak to our team today. Your first consultation is free and
                confidential.
              </p>

              <ThemeBtn onClick={() => router.push("/contact")}>
                Book a Consultation{" "}
              </ThemeBtn>
            </div>
          </div>
        </div>

        {/* Right photo + thought bubble */}
        <div className="relative z-10 order-3 flex w-full max-w-60 flex-col items-end justify-self-center lg:justify-self-end lg:self-end">
          {/* Thought bubble */}
          <div className="relative mb-4 hidden self-end lg:block">
            <p className="w-40 rounded-[50%] border-2 border-orange-400 bg-slate-900/20 px-5 py-6 text-center text-[11px] font-bold uppercase leading-snug tracking-wide text-white">
              Do you have any idea to join with us?
            </p>

            <span className="absolute -bottom-3 right-3 h-3 w-3 rounded-full border-2 border-orange-400 bg-[#262b38]" />
            <span className="absolute -bottom-5 -right-1 h-2 w-2 rounded-full border-2 border-orange-400 bg-[#262b38]" />
          </div>

          <div className="relative aspect-240/256 w-full overflow-hidden rounded-2xl">
            <Image
              src="/img/banner/6.jpg"
              alt="Investment consultant"
              fill
              sizes="(max-width: 1024px) 40vw, 240px"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBanner;
