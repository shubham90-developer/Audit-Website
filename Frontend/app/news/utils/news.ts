import type {
  BlogArticle,
  BlogCategory,
  BlogLang,
  BlogLocalized,
  BlogLocalizedMedia,
  BlogSection,
} from "@/app/store/api/blogApi";

/**
 * Category slugs that belong to the Press section, not to Insights.
 * Keep in sync with PRESS_CATEGORY_SLUG in app/press/utils/press.ts.
 */
export const PRESS_CATEGORY_SLUGS = ["press-releases"];

/** Used when an article has no image uploaded. */
export const NEWS_FALLBACK_IMAGE = "/img/blog/1.jpg";

/** Dates are entered in the UAE, so they are always shown in UAE time. */
const DISPLAY_TIME_ZONE = "Asia/Dubai";

export interface NewsData {
  /** Published insight articles (not press releases), newest first. */
  articles: BlogArticle[];
  /** Active insight categories, in admin order. */
  categories: BlogCategory[];
  /** Category lookup for every category in the section. */
  categoryById: Map<string, BlogCategory>;
  /** Published article count per category id. */
  countByCategory: Map<string, number>;
  /** True once the section has loaded. */
  ready: boolean;
}

const EMPTY_NEWS_DATA: NewsData = {
  articles: [],
  categories: [],
  categoryById: new Map(),
  countByCategory: new Map(),
  ready: false,
};

/** Builds the insights list from the raw blog section (press and drafts are dropped). */
export const getNewsData = (section?: BlogSection): NewsData => {
  if (!section) return EMPTY_NEWS_DATA;

  const categories = section.categories
    .filter(
      (category) =>
        category.active && !PRESS_CATEGORY_SLUGS.includes(category.slug),
    )
    .sort((a, b) => a.order - b.order);
  const insightIds = new Set(categories.map((category) => category._id));
  const categoryById = new Map(
    section.categories.map((category) => [category._id, category]),
  );

  const articles = section.articles
    .filter(
      (article) =>
        article.status === "published" && insightIds.has(article.categoryId),
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() ||
        a.order - b.order,
    );

  const countByCategory = new Map<string, number>();
  for (const article of articles) {
    countByCategory.set(
      article.categoryId,
      (countByCategory.get(article.categoryId) ?? 0) + 1,
    );
  }

  return { articles, categories, categoryById, countByCategory, ready: true };
};

/** True when the article is a published insight (not a press release). */
export const isNewsArticle = (
  article: BlogArticle | undefined,
  news: NewsData,
): article is BlogArticle =>
  !!article &&
  article.status === "published" &&
  news.categories.some((category) => category._id === article.categoryId);

/** Plain text from HTML (for titles, excerpts and clamped text). */
export const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/** Value in the active language, falling back to the other one when empty. */
export const pickText = (value: BlogLocalized | undefined, lang: BlogLang) => {
  const other: BlogLang = lang === "en" ? "ar" : "en";
  const primary = value?.[lang] ?? "";
  return primary.trim() ? primary : (value?.[other] ?? "");
};

/** Plain-text version of a localized rich-text field. */
export const pickPlain = (value: BlogLocalized | undefined, lang: BlogLang) =>
  stripHtml(pickText(value, lang));

/** Image URL for the active language, falling back to the other one, then to the default image. */
export const pickMedia = (
  media: BlogLocalizedMedia | undefined,
  lang: BlogLang,
  fallback = NEWS_FALLBACK_IMAGE,
) => {
  const other: BlogLang = lang === "en" ? "ar" : "en";
  return media?.[lang]?.url || media?.[other]?.url || fallback;
};

/** Localized date, e.g. "5 Nov 2026". */
export const formatNewsDate = (iso: string, lang: BlogLang) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(lang === "ar" ? "ar-AE" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: DISPLAY_TIME_ZONE,
  }).format(date);
};

/** Rough reading time at ~200 words per minute. */
export const readingMinutes = (html: string) => {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};
