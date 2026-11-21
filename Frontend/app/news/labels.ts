import type { BlogLang } from "@/app/store/api/blogApi";

/** Static UI text for the news / insights pages. Article content comes from the API. */
const labels = {
  en: {
    pageTitle: "Insights & Resources",
    pageSubtitle:
      "Stay informed with expert insights, practical guidance, and the latest updates on accounting, tax, and business in the UAE.",
    all: "All",
    searchLabel: "Search articles",
    searchPlaceholder: "Search articles...",
    readMore: "Read more",
    loadError: "We couldn't load articles right now. Please try again.",
    retry: "Try again",
    empty: "No articles yet. Please check back soon.",
    noResults: "No articles match your search.",
    clearSearch: "Clear search",
    notFound: "This article could not be found.",
    backToNews: "Back to insights",
    allArticles: "All insights",
    recent: "Recent articles",
    related: "Related articles",
    categories: "Blog categories",
    publishedOn: "Published",
    lastUpdated: "Last updated",
    readingTime: "Reading time",
    minRead: "min read",
    shareLabel: "Share",
    shareTitle: "Share this article",
    shareAria: "Share on",
  },
  ar: {
    pageTitle: "المقالات والموارد",
    pageSubtitle:
      "اطلع على أحدث المقالات والإرشادات حول المحاسبة والضرائب والأعمال في الإمارات.",
    all: "الكل",
    searchLabel: "البحث في المقالات",
    searchPlaceholder: "ابحث في المقالات...",
    readMore: "اقرأ المزيد",
    loadError: "تعذّر تحميل المقالات حالياً. يرجى المحاولة مرة أخرى.",
    retry: "حاول مرة أخرى",
    empty: "لا توجد مقالات بعد. يرجى التحقق لاحقاً.",
    noResults: "لا توجد مقالات تطابق بحثك.",
    clearSearch: "مسح البحث",
    notFound: "تعذّر العثور على هذا المقال.",
    backToNews: "العودة إلى المقالات",
    allArticles: "جميع المقالات",
    recent: "أحدث المقالات",
    related: "مقالات ذات صلة",
    categories: "تصنيفات المقالات",
    publishedOn: "تاريخ النشر",
    lastUpdated: "آخر تحديث",
    readingTime: "مدة القراءة",
    minRead: "دقيقة قراءة",
    shareLabel: "شارك",
    shareTitle: "شارك هذا المقال",
    shareAria: "مشاركة على",
  },
} as const;

export type NewsLabels = (typeof labels)[BlogLang];

export const getNewsLabels = (lang: BlogLang): NewsLabels => labels[lang];
