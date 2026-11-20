"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "ar";

// Same signals the LanguageToggle uses: <html lang> + the "languagechange" event.
const getLang = (): Lang =>
  typeof document !== "undefined" && document.documentElement.lang === "ar"
    ? "ar"
    : "en";

const subscribe = (callback: () => void) => {
  window.addEventListener("languagechange", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("languagechange", callback);
    window.removeEventListener("storage", callback);
  };
};

export const useLang = (): Lang =>
  useSyncExternalStore(subscribe, getLang, () => "en" as Lang);
