"use client";

import React, { useSyncExternalStore } from "react";

type Lang = "en" | "ar";

interface StripProps {
  text: string;
  outline?: boolean;
  direction?: "left" | "right";
}

const CONTENT = {
  en: "Accounting · Tax · Audit",
  ar: "المحاسبة · الضرائب · التدقيق",
};

/* Detect language changes */
const getLanguage = (): Lang => {
  if (typeof document === "undefined") return "en";

  return document.documentElement.lang === "ar" ? "ar" : "en";
};

const subscribeLanguage = (callback: () => void) => {
  const observer = new MutationObserver(callback);

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["lang"],
  });

  window.addEventListener("languagechange", callback);
  window.addEventListener("site-language-change", callback);

  return () => {
    observer.disconnect();
    window.removeEventListener("languagechange", callback);
    window.removeEventListener("site-language-change", callback);
  };
};

const useLanguage = (): Lang =>
  useSyncExternalStore(subscribeLanguage, getLanguage, () => "en");

/* ---------------- Strip ---------------- */

const Strip = ({ text, outline = false, direction = "left" }: StripProps) => (
  <div dir="ltr" className="marquee flex overflow-hidden select-none">
    {[0, 1].map((copy) => (
      <div
        key={copy}
        aria-hidden={copy === 1}
        className={`flex shrink-0 ${
          direction === "left" ? "marquee-left" : "marquee-right"
        }`}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={i}
            className={`flex shrink-0 items-center gap-8 pr-8 text-6xl font-black uppercase leading-tight whitespace-nowrap sm:text-8xl ${
              outline
                ? "text-transparent [-webkit-text-stroke:2px_#27c25a]"
                : "text-black"
            }`}
          >
            <span dir="auto">{text}</span>

            <span className="h-3 w-3 shrink-0 rounded-full bg-[#27c25a]" />
          </span>
        ))}
      </div>
    ))}
  </div>
);

/* ---------------- Main Component ---------------- */

const SlidingText = () => {
  const lang = useLanguage();
  const text = CONTENT[lang];

  return (
    <section lang={lang} className="py-10" aria-label={text}>
      <Strip text={text} direction="left" />

      <Strip text={text} direction="right" outline />
    </section>
  );
};

export default SlidingText;
