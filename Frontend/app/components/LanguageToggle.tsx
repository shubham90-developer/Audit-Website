"use client";

import { useSyncExternalStore } from "react";

const LANGS = [
  { code: "en", label: "EN", dir: "ltr" },
  { code: "ar", label: "AR", dir: "rtl" },
] as const;

type Code = (typeof LANGS)[number]["code"];

const getLanguage = (): Code => {
  if (typeof document === "undefined") return "en";

  return document.documentElement.lang === "ar" ? "ar" : "en";
};

const subscribe = (callback: () => void) => {
  window.addEventListener("languagechange", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("languagechange", callback);
    window.removeEventListener("storage", callback);
  };
};

const applyLanguage = (code: Code) => {
  const selected = LANGS.find((item) => item.code === code);

  if (!selected) return;

  document.documentElement.lang = selected.code;
  document.documentElement.dir = selected.dir;

  localStorage.setItem("lang", selected.code);

  window.dispatchEvent(new Event("languagechange"));
};

const LanguageToggle = () => {
  const active = useSyncExternalStore(subscribe, getLanguage, () => "en");

  return (
    <div
      role="group"
      aria-label="Language"
      className="fixed left-4 bottom-1 z-50 flex -translate-y-1/2 flex-col rounded-full border border-[#27c25a]/40 bg-[#0c0a07]/90 p-1 shadow-[0_10px_30px_-10px_rgba(39,194,90,0.5)] backdrop-blur-md"
    >
      {/* Sliding thumb */}
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
          onClick={() => applyLanguage(code)}
          aria-pressed={active === code}
          className={`relative z-10 h-10 w-10 cursor-pointer rounded-full text-xs font-bold tracking-wider transition-colors duration-300 ${
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
