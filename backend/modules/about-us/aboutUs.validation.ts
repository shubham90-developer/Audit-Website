import { z } from "zod";
import { MAX_ITEMS } from "./aboutUs.interface";

/* ---------- Building blocks ---------- */

// Both languages are required whenever a field is sent
const shortText = z.object({
  en: z.string().trim().min(1, "English value is required").max(300),
  ar: z.string().trim().min(1, "Arabic value is required").max(300),
});

const longText = z.object({
  en: z.string().trim().min(1, "English value is required").max(3000),
  ar: z.string().trim().min(1, "Arabic value is required").max(3000),
});

// Only allow safe link targets: a path, an anchor, or an http(s) URL.
// This blocks values like javascript:alert(1).
const safeHref = z
  .string()
  .trim()
  .min(1, "Link is required")
  .max(300, "Link is too long")
  .refine((v) => /^(\/|#|https?:\/\/)/i.test(v), {
    message: "Link must start with /, # or http(s)://",
  });

// Icon key the frontend maps to an icon
const iconKey = z
  .string()
  .trim()
  .min(1)
  .max(30)
  .regex(/^[a-z0-9-]+$/i, "Invalid icon key");

const shortValue = z.string().trim().min(1, "Value is required").max(20);

// Existing list items send their _id back, so their images are kept.
// Items without an _id are new.
const itemId = z
  .string()
  .regex(/^[a-f0-9]{24}$/i, "Invalid item id")
  .optional();

const list = <T extends z.ZodTypeAny>(item: T) =>
  z.array(item).min(1).max(MAX_ITEMS);

/* ---------- Sections (every field optional, so partial updates are safe) ---------- */

// Images are never part of these objects. They arrive as files.

export const heroSchema = z
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
    stats: list(
      z.object({
        value: shortValue,
        label: shortText,
        icon: iconKey,
      }),
    ),
  })
  .partial();

export const whoWeAreSchema = z
  .object({
    badge: shortText,
    title: shortText,
    text: longText,
    quote: longText,
    buttonLabel: shortText,
    buttonHref: safeHref,
    scriptText: shortText,
    snapshotItems: list(
      z.object({
        label: shortText,
        value: shortText,
        text: shortText,
        icon: iconKey,
      }),
    ),
  })
  .partial();

export const ourStorySchema = z
  .object({
    badge: shortText,
    narrative: longText,
    quote: longText,
    authorName: shortText,
    authorRole: shortText,
    steps: list(
      z.object({
        _id: itemId,
        number: shortValue,
        title: shortText,
        text: longText,
      }),
    ),
  })
  .partial();

export const ourValuesSchema = z
  .object({
    label: shortText,
    title: shortText,
    values: list(
      z.object({
        number: shortValue,
        title: shortText,
        text: longText,
        icon: iconKey,
      }),
    ),
  })
  .partial();

export const nextChapterSchema = z
  .object({
    badge: shortText,
    title: shortText,
    description: longText,
    scriptTagline: shortText,
    countries: list(
      z.object({
        _id: itemId,
        name: shortText,
      }),
    ),
  })
  .partial();

/* ---------- Whole update ---------- */

export const updateAboutUsSchema = z.object({
  hero: heroSchema.optional(),
  whoWeAre: whoWeAreSchema.optional(),
  ourStory: ourStorySchema.optional(),
  ourValues: ourValuesSchema.optional(),
  nextChapter: nextChapterSchema.optional(),
});

export type UpdateAboutUsInput = z.infer<typeof updateAboutUsSchema>;
