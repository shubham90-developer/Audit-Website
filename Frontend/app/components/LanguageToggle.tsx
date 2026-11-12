/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

const LANGS = [
  { code: "en", label: "EN", dir: "ltr" },
  { code: "ar", label: "AR", dir: "rtl" },
] as const;

type Code = (typeof LANGS)[number]["code"];

const apply = (code: Code) => {
  const lang = LANGS.find((l) => l.code === code)!;
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
  localStorage.setItem("lang", lang.code);
};

const LanguageToggle = () => {
  const [active, setActive] = useState<Code>("en");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "ar" || saved === "en") {
      setActive(saved);
      apply(saved);
    }
  }, []);

  const select = (code: Code) => {
    setActive(code);
    apply(code);
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className="fixed left-4 bottom-1 z-50 flex -translate-y-1/2 flex-col rounded-full border border-[#27c25a]/40 bg-[#0c0a07]/90 p-1 shadow-[0_10px_30px_-10px_rgba(39,194,90,0.5)] backdrop-blur-md"
    >
      {/* sliding thumb */}
      <span
        aria-hidden="true"
        className={`absolute left-1 top-1 h-10 w-10 rounded-full bg-[#27c25a] transition-transform duration-300 ease-out ${
          active === "ar" ? "translate-y-10" : ""
        }`}
      />

      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => select(code)}
          aria-pressed={active === code}
          className={`relative z-10 h-10 cursor-pointer w-10 rounded-full text-xs font-bold tracking-wider transition-colors duration-300 ${
            active === code ? "text-black" : "text-white/80 hover:text-white"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
