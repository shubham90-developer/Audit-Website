import { z } from "zod";

/* ---------- Plain text ---------- */

const shortText = z.object({
  en: z.string().trim().min(1, "English value is required").max(300),
  ar: z.string().trim().min(1, "Arabic value is required").max(300),
});

/* ---------- Rich text ----------
   Fields edited with the text editor arrive as HTML. Remove scripts, iframes,
   inline event handlers and javascript: links before saving.
   For production, consider the sanitize-html package for a stricter filter. */
export const sanitizeHtml = (html: string): string =>
  html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe|object|embed)[^>]*>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');

// Visible text left after removing tags
const hasText = (html: string) =>
  html.replace(/<[^>]*>/g, "").trim().length > 0;

const richValue = (max: number) =>
  z
    .string()
    .trim()
    .min(1, "Value is required")
    .max(max, "Value is too long")
    .refine(hasText, { message: "Value is required" })
    .transform(sanitizeHtml);

// Both languages required, HTML allowed (cleaned)
const richShort = z.object({ en: richValue(1000), ar: richValue(1000) });
const richLong = z.object({ en: richValue(6000), ar: richValue(6000) });

/* ---------- Section ---------- */

// All fields optional on update. Images arrive as files.
export const updateSectionSchema = z
  .object({
    badge: shortText,
    narrative: richLong,
    quote: richLong,
    authorName: shortText,
    authorRole: shortText,
  })
  .partial();

/* ---------- Steps ---------- */

export const createStepSchema = z.object({
  title: richShort,
  text: richLong,
  // form-data sends numbers as strings
  order: z.coerce.number().int().min(0).default(0),
});

export const updateStepSchema = createStepSchema.partial();
