"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITEM_IMAGE_SLOTS = exports.SINGLE_IMAGE_SLOTS = exports.MAX_ITEMS = exports.SECTION_KEYS = void 0;
/* ---------- Constants shared by the controller and the route ---------- */
exports.SECTION_KEYS = [
    "hero",
    "whoWeAre",
    "ourStory",
    "ourValues",
    "nextChapter",
];
// Most items allowed in any list (stats, steps, values, countries ...)
exports.MAX_ITEMS = 8;
// Single images: one upload field per language
exports.SINGLE_IMAGE_SLOTS = [
    { section: "hero", field: "heroImage", folder: "audit-website/about/hero", files: { en: "heroImageEn", ar: "heroImageAr" } },
    { section: "hero", field: "bgImage", folder: "audit-website/about/hero", files: { en: "heroBgEn", ar: "heroBgAr" } },
    { section: "whoWeAre", field: "bgImage", folder: "audit-website/about/who", files: { en: "whoWeAreBgEn", ar: "whoWeAreBgAr" } },
    { section: "whoWeAre", field: "headerImage", folder: "audit-website/about/who", files: { en: "whoWeAreHeaderEn", ar: "whoWeAreHeaderAr" } },
    { section: "ourStory", field: "bgImage", folder: "audit-website/about/story", files: { en: "ourStoryBgEn", ar: "ourStoryBgAr" } },
    { section: "ourStory", field: "authorImage", folder: "audit-website/about/story", files: { en: "ourStoryAuthorEn", ar: "ourStoryAuthorAr" } },
    { section: "nextChapter", field: "bgImage", folder: "audit-website/about/next", files: { en: "nextChapterBgEn", ar: "nextChapterBgAr" } },
];
// Images that belong to a list item. The upload field name is the prefix plus
// the item's position in the list, e.g. ourStoryStepImageEn0, ourStoryStepImageAr3
exports.ITEM_IMAGE_SLOTS = [
    { section: "ourStory", field: "steps", folder: "audit-website/about/story", files: { en: "ourStoryStepImageEn", ar: "ourStoryStepImageAr" } },
    { section: "nextChapter", field: "countries", folder: "audit-website/about/next", files: { en: "nextChapterCountryImageEn", ar: "nextChapterCountryImageAr" } },
];
