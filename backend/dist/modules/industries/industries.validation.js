"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIndustrySchema = exports.createIndustrySchema = exports.updateSectionSchema = exports.sanitizeHtml = void 0;
const zod_1 = require("zod");
const industries_interface_1 = require("./industries.interface");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
/* ---------- Rich text sanitizing ----------
   title and footerTitle come from the editor as HTML. Remove scripts,
   iframes, inline event handlers, and javascript: links before saving.
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
// Section: all fields optional on update. Backgrounds come as files.
exports.updateSectionSchema = zod_1.z
    .object({
    watermark: localizedString,
    title: richLocalized,
    description: localizedString,
    footerTitle: richLocalized,
    footerNote: localizedString,
    footerIcon: zod_1.z.enum(industries_interface_1.INDUSTRY_ICONS),
})
    .partial();
const removeIdsSchema = zod_1.z
    .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
    .optional()
    .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]));
// Industry card: text fields. Images arrive as files.
exports.createIndustrySchema = zod_1.z.object({
    icon: zod_1.z.enum(industries_interface_1.INDUSTRY_ICONS),
    title: localizedString,
    desc: localizedString,
    // form-data sends numbers as strings
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
exports.updateIndustrySchema = exports.createIndustrySchema.partial().extend({
    removePublicIds: removeIdsSchema,
});
