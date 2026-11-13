import { z } from "zod";
import { STAT_ICONS, STAT_COLORS } from "./numbersPresence.interface";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

/* ---------- Rich text sanitizing ----------
   Section text comes from the editor as HTML. Remove scripts, iframes,
   inline event handlers, and javascript: links before saving.
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

// Section: all text fields are rich text, all optional on update.
// Backgrounds come as files.
export const updateSectionSchema = z
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

const removeIdsSchema = z
  .union([z.string(), z.array(z.string())])
  .optional()
  .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v]));

// ---- Stats ----
export const createStatSchema = z.object({
  icon: z.enum(STAT_ICONS),
  color: z.enum(STAT_COLORS),
  // form-data sends numbers as strings
  value: z.coerce.number().min(0).max(1000000),
  suffix: z.string().trim().max(5).default(""),
  label: localizedString,
  order: z.coerce.number().int().min(0).default(0),
});

export const updateStatSchema = createStatSchema.partial();

// ---- Offices ----
export const createOfficeSchema = z.object({
  city: localizedString,
  country: localizedString,
  flagCode: z
    .string()
    .trim()
    .regex(/^[a-zA-Z]{2}$/, "Flag code must be 2 letters, e.g. ae")
    .transform((v) => v.toLowerCase()),
  order: z.coerce.number().int().min(0).default(0),
});

export const updateOfficeSchema = createOfficeSchema.partial().extend({
  removePublicIds: removeIdsSchema,
});
