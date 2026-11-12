/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useRef } from "react";
// @ts-ignore
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

interface Testimonial {
  id: number;
  name: string;
  text: string;
}

// Replace the 2nd and 3rd entries with your real reviews.
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Miguel Souza Albuquerque",
    text: "Maham guided me through the business license renewal process. She even flagged upcoming compliance changes I had no clue about. It's that extra attention to detail that makes Ahmed Al Mazroei stand out.",
  },
  {
    id: 2,
    name: "Client Name",
    text: "Replace this with a real client review. Keep it to about three lines so every slide stays the same height.",
  },
  {
    id: 3,
    name: "Client Name",
    text: "Replace this with another real client review. Short, specific feedback works best here.",
  },
];

const GoogleIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
    <path
      fill="#3ddc6e"
      d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
    />
  </svg>
);

const ArrowIcon = ({ direction }: { direction: "left" | "right" }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-3.5 w-3.5 ${direction === "left" ? "rotate-180" : ""}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const arrowClass =
  "absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[#3ddc6e] bg-black text-[#3ddc6e] shadow-md transition duration-300 hover:scale-110 hover:bg-[#3ddc6e] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5c518]";

const Testimonials = () => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 800,
    cssEase: "cubic-bezier(0.22, 1, 0.36, 1)",
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    swipeToSlide: true,
    touchThreshold: 12,
    useTransform: true,
    waitForAnimate: false,
  };

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
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#f5e6a8] bg-linear-to-b from-[#fffdf5] to-[#fff6d9] px-6 pb-10 pt-8 shadow-[0_20px_60px_-25px_rgba(245,197,24,0.5)] sm:px-16">
        {/* decorative quote marks */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-0 select-none font-serif text-8xl font-black leading-none text-[#3ddc6e]/40"
        >
          &ldquo;
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-5 select-none font-serif text-8xl font-black leading-none text-[#3ddc6e]/40"
        >
          &rdquo;
        </span>

        {/* static heading */}
        <div className="relative text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#3ddc6e]">
            Client Feedback
          </p>
          <h2 className="mx-auto mt-2 max-w-md text-2xl font-bold leading-tight tracking-tight text-black sm:text-3xl">
            What clients say about our Accounting Firm in Dubai
          </h2>
        </div>

        {/* slider */}
        <div className="relative mt-5">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => sliderRef.current?.slickPrev()}
            className={`${arrowClass} -left-3 sm:-left-12`}
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => sliderRef.current?.slickNext()}
            className={`${arrowClass} -right-3 sm:-right-12`}
          >
            <ArrowIcon direction="right" />
          </button>

          <div className="[&_.slick-slide]:h-auto [&_.slick-slide>div]:h-full [&_.slick-track]:flex">
            <Slider ref={sliderRef} {...settings}>
              {testimonials.map((item) => (
                <div key={item.id} className="h-full">
                  <figure className="flex h-full flex-col items-center px-8 text-center sm:px-4">
                    <blockquote className="min-h-22 text-base leading-7 text-black/85 sm:text-[17px]">
                      {item.text}
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-2.5 text-sm font-semibold text-black">
                      {item.name}
                      <span
                        aria-hidden="true"
                        className="h-4 w-px bg-black/20"
                      />
                      <GoogleIcon />
                    </figcaption>
                  </figure>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        {/* static rating badges */}
        <div className="relative mt-6 flex justify-center">
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-xl bg-[#fbeeb8]/70 px-2 py-1.5 text-xs text-black/60">
            <span className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 shadow-sm">
              <GoogleIcon className="h-3.5 w-3.5" />
              Based on{" "}
              <strong className="text-black">200+ Google Reviews</strong>
            </span>
            <span className="flex items-center gap-1.5 pr-2">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-[#00b67a]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2l2.9 6.9 7.1.6-5.4 4.7 1.6 7.1L12 17.6 5.8 21.3l1.6-7.1L2 9.5l7.1-.6L12 2z" />
              </svg>
              Rated <strong className="text-black">Excellent</strong> on
              Trustpilot
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
