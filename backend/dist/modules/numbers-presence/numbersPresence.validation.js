"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOfficeSchema = exports.createOfficeSchema = exports.updateStatSchema = exports.createStatSchema = exports.updateSectionSchema = exports.sanitizeHtml = void 0;
const zod_1 = require("zod");
const numbersPresence_interface_1 = require("./numbersPresence.interface");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
/* ---------- Rich text sanitizing ----------
   Section text comes from the editor as HTML. Remove scripts, iframes,
   inline event handlers, and javascript: links before saving.
   For production, consider the sanitize-html package for a stricter filter. */
const sanitizeHtml = (html) => html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed)[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
exports.sanitizeHtml = sanitizeHtml;
const richText = zod_1.z
    .string()
    .trim()
    .min(1, "Value is required")
    .transform(exports.sanitizeHtml);
const richLocalized = zod_1.z.object({
    en: richText,
    ar: richText,
});
// Section: all text fields are rich text, all optional on update.
// Backgrounds come as files.
exports.updateSectionSchema = zod_1.z
    .object({
    numbersTitle: richLocalized,
    securityTitle: richLocalized,
    securityText: richLocalized,
    insuranceText: richLocalized,
    globalLabel: richLocalized,
    globalTitle: richLocalized,
    globalText: richLocalized,
})
    .partial();
const removeIdsSchema = zod_1.z
    .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
    .optional()
    .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]));
// ---- Stats ----
exports.createStatSchema = zod_1.z.object({
    icon: zod_1.z.enum(numbersPresence_interface_1.STAT_ICONS),
    color: zod_1.z.enum(numbersPresence_interface_1.STAT_COLORS),
    // form-data sends numbers as strings
    value: zod_1.z.coerce.number().min(0).max(1000000),
    suffix: zod_1.z.string().trim().max(5).default(""),
    label: localizedString,
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
exports.updateStatSchema = exports.createStatSchema.partial();
// ---- Offices ----
exports.createOfficeSchema = zod_1.z.object({
    city: localizedString,
    country: localizedString,
    flagCode: zod_1.z
        .string()
        .trim()
        .regex(/^[a-zA-Z]{2}$/, "Flag code must be 2 letters, e.g. ae")
        .transform((v) => v.toLowerCase()),
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
exports.updateOfficeSchema = exports.createOfficeSchema.partial().extend({
    removePublicIds: removeIdsSchema,
});
