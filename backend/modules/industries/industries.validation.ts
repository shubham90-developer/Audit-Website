import { z } from "zod";
import { INDUSTRY_ICONS } from "./industries.interface";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

/* ---------- Rich text sanitizing ----------
   title and footerTitle come from the editor as HTML. Remove scripts,
   iframes, inline event handlers, and javascript: links before saving.
   For production, consider the sanitize-html package for a stricter filter. */
export const sanitizeHtml = (html: string): string =>
  html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed)[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');

const richText = z
  .string()
  .trim()
  .min(1, "Value is required")
  .transform(sanitizeHtml);

const richLocalized = z.object({
  en: richText,
  ar: richText,
});

// Section: all fields optional on update. Backgrounds come as files.
export const updateSectionSchema = z
  .object({
    watermark: localizedString,
    title: richLocalized,
    description: localizedString,
    footerTitle: richLocalized,
    footerNote: localizedString,
    footerIcon: z.enum(INDUSTRY_ICONS),
  })
  .partial();

const removeIdsSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]));

// Industry card: text fields. Images arrive as files.
export const createIndustrySchema = z.object({
  icon: z.enum(INDUSTRY_ICONS),
  title: localizedString,
  desc: localizedString,
  // form-data sends numbers as strings
  order: z.coerce.number().int().min(0).default(0),
});

export const updateIndustrySchema = createIndustrySchema.partial().extend({
  removePublicIds: removeIdsSchema,
});
