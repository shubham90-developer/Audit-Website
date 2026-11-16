import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

const optionalLocalizedString = z
  .object({
    en: z.string().trim().default(""),
    ar: z.string().trim().default(""),
  })
  .optional();

const mediaSchema = z.object({
  url: z.string(),
  publicId: z.string(),
});

export const createInsightSchema = z.object({
  type: z.enum(["blog", "press", "video"]).default("blog"),
  title: localizedString,
  excerpt: localizedString,
  content: optionalLocalizedString,
  category: localizedString,
  tag: optionalLocalizedString,
  author: optionalLocalizedString,
  reviewedBy: optionalLocalizedString,
  readTime: optionalLocalizedString,
  date: z.string().min(1),
  slug: z.string().min(1),
  featured: z.boolean().default(false),
  order: z.number().int().nonnegative().optional(),
});

export const updateInsightSchema = createInsightSchema.partial();
