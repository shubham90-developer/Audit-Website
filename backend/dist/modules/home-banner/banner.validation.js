"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.langQuerySchema = exports.updateBannerSchema = exports.createBannerSchema = void 0;
const zod_1 = require("zod");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
const ctaSchema = zod_1.z.object({
    label: localizedString,
    href: localizedString,
    variant: zod_1.z.enum(["primary", "secondary"]),
});
const ftaCardSchema = zod_1.z.object({
    line1: localizedString,
    line2: localizedString,
    licenseNumber: localizedString,
});
const partnerCardSchema = zod_1.z.object({
    title: localizedString,
    subtitle: localizedString,
});
const experienceCardSchema = zod_1.z.object({
    value: localizedString,
    label: localizedString,
    tagline: localizedString,
});
const reviewRatingSchema = zod_1.z.object({
    platform: zod_1.z.enum(["google", "trustpilot"]),
    // Form-data sends numbers as strings, so coerce before checking the range
    score: zod_1.z.coerce
        .number()
        .min(0, "Score must be 0 or more")
        .max(5, "Score must be 5 or less"),
    label: localizedString,
});
// Text fields only. Images/videos arrive as files, not in the body.
exports.createBannerSchema = zod_1.z.object({
    establishmentYear: localizedString,
    titleHighlight: localizedString,
    titleRest: localizedString,
    intro: localizedString,
    speakLabel: localizedString,
    primaryCta: ctaSchema,
    secondaryCta: ctaSchema,
    ftaCard: ftaCardSchema,
    partnerCard: partnerCardSchema,
    experienceCard: experienceCardSchema,
    reviewRatings: zod_1.z
        .array(reviewRatingSchema)
        .min(1, "At least one review rating is required"),
    trustedNote: localizedString,
});
exports.updateBannerSchema = exports.createBannerSchema.partial().extend({
    // publicIds of existing images/videos to remove (form-data sends one string or many)
    removePublicIds: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .optional()
        .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v])),
});
exports.langQuerySchema = zod_1.z.object({
    lang: zod_1.z.enum(["en", "ar"]).optional(),
});
