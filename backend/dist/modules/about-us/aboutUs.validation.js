"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAboutUsSchema = exports.nextChapterSchema = exports.ourValuesSchema = exports.ourStorySchema = exports.whoWeAreSchema = exports.heroSchema = void 0;
const zod_1 = require("zod");
const aboutUs_interface_1 = require("./aboutUs.interface");
/* ---------- Building blocks ---------- */
// Both languages are required whenever a field is sent
const shortText = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required").max(300),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required").max(300),
});
const longText = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required").max(3000),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required").max(3000),
});
// Only allow safe link targets: a path, an anchor, or an http(s) URL.
// This blocks values like javascript:alert(1).
const safeHref = zod_1.z
    .string()
    .trim()
    .min(1, "Link is required")
    .max(300, "Link is too long")
    .refine((v) => /^(\/|#|https?:\/\/)/i.test(v), {
    message: "Link must start with /, # or http(s)://",
});
// Icon key the frontend maps to an icon
const iconKey = zod_1.z
    .string()
    .trim()
    .min(1)
    .max(30)
    .regex(/^[a-z0-9-]+$/i, "Invalid icon key");
const shortValue = zod_1.z.string().trim().min(1, "Value is required").max(20);
// Existing list items send their _id back, so their images are kept.
// Items without an _id are new.
const itemId = zod_1.z
    .string()
    .regex(/^[a-f0-9]{24}$/i, "Invalid item id")
    .optional();
const list = (item) => zod_1.z.array(item).min(1).max(aboutUs_interface_1.MAX_ITEMS);
/* ---------- Sections (every field optional, so partial updates are safe) ---------- */
// Images are never part of these objects. They arrive as files.
exports.heroSchema = zod_1.z
    .object({
    title: shortText,
    subtitle: shortText,
    intro1: longText,
    intro2: longText,
    cta1Label: shortText,
    cta1Href: safeHref,
    cta2Label: shortText,
    cta2Href: safeHref,
    speakLabel: shortText,
    stats: list(zod_1.z.object({
        value: shortValue,
        label: shortText,
        icon: iconKey,
    })),
})
    .partial();
exports.whoWeAreSchema = zod_1.z
    .object({
    badge: shortText,
    title: shortText,
    text: longText,
    quote: longText,
    buttonLabel: shortText,
    buttonHref: safeHref,
    scriptText: shortText,
    snapshotItems: list(zod_1.z.object({
        label: shortText,
        value: shortText,
        text: shortText,
        icon: iconKey,
    })),
})
    .partial();
exports.ourStorySchema = zod_1.z
    .object({
    badge: shortText,
    narrative: longText,
    quote: longText,
    authorName: shortText,
    authorRole: shortText,
    steps: list(zod_1.z.object({
        _id: itemId,
        number: shortValue,
        title: shortText,
        text: longText,
    })),
})
    .partial();
exports.ourValuesSchema = zod_1.z
    .object({
    label: shortText,
    title: shortText,
    values: list(zod_1.z.object({
        number: shortValue,
        title: shortText,
        text: longText,
        icon: iconKey,
    })),
})
    .partial();
exports.nextChapterSchema = zod_1.z
    .object({
    badge: shortText,
    title: shortText,
    description: longText,
    scriptTagline: shortText,
    countries: list(zod_1.z.object({
        _id: itemId,
        name: shortText,
    })),
})
    .partial();
/* ---------- Whole update ---------- */
exports.updateAboutUsSchema = zod_1.z.object({
    hero: exports.heroSchema.optional(),
    whoWeAre: exports.whoWeAreSchema.optional(),
    ourStory: exports.ourStorySchema.optional(),
    ourValues: exports.ourValuesSchema.optional(),
    nextChapter: exports.nextChapterSchema.optional(),
});
