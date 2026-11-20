import type { Lang } from "@/app/services/hooks/useLang";

type LocalizedMedia = Record<Lang, { url: string }[]>;

/** First media url for the active language, falling back to the other one. */
export const pickMedia = (media: LocalizedMedia | undefined, lang: Lang) => {
  const other: Lang = lang === "en" ? "ar" : "en";
  return media?.[lang]?.[0]?.url || media?.[other]?.[0]?.url || "";
};

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

/** Rich-text (HTML) -> plain text, for cards, select options and clamps. */
export const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&(amp|lt|gt|quot|nbsp|#39);/g, (m) => ENTITIES[m] ?? m)
    .replace(/\s+/g, " ")
    .trim();

/** URL-safe slug from the English title, so links don't change with language. */
export const slugify = (html = "") =>
  stripHtml(html)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "service";
