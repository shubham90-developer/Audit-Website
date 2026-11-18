"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStepSchema = exports.createStepSchema = exports.updateSectionSchema = exports.sanitizeHtml = void 0;
const zod_1 = require("zod");
/* ---------- Plain text ---------- */
const shortText = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required").max(300),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required").max(300),
});
/* ---------- Rich text ----------
   Fields edited with the text editor arrive as HTML. Remove scripts, iframes,
   inline event handlers and javascript: links before saving.
   For production, consider the sanitize-html package for a stricter filter. */
const sanitizeHtml = (html) => html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed)[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
exports.sanitizeHtml = sanitizeHtml;
// Visible text left after removing tags
const hasText = (html) => html.replace(/<[^>]*>/g, "").trim().length > 0;
const richValue = (max) => zod_1.z
    .string()
    .trim()
    .min(1, "Value is required")
    .max(max, "Value is too long")
    .refine(hasText, { message: "Value is required" })
    .transform(exports.sanitizeHtml);
// Both languages required, HTML allowed (cleaned)
const richShort = zod_1.z.object({ en: richValue(1000), ar: richValue(1000) });
const richLong = zod_1.z.object({ en: richValue(6000), ar: richValue(6000) });
/* ---------- Section ---------- */
// All fields optional on update. Images arrive as files.
exports.updateSectionSchema = zod_1.z
    .object({
    badge: shortText,
    narrative: richLong,
    quote: richLong,
    authorName: shortText,
    authorRole: shortText,
})
    .partial();
/* ---------- Steps ---------- */
exports.createStepSchema = zod_1.z.object({
    title: richShort,
    text: richLong,
    // form-data sends numbers as strings
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
exports.updateStepSchema = exports.createStepSchema.partial();
