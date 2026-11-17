import { z } from "zod";

const localizedTextSchema = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

const mediaSchema = z.object({
  url: z.string().min(1),
  publicId: z.string().optional().default(""),
});

const localizedMediaSchema = z.object({
  en: z.array(mediaSchema).optional(),
  ar: z.array(mediaSchema).optional(),
});

// Main section
export const updateSectionSchema = z.object({
  badge: localizedTextSchema.optional(),
  title: localizedTextSchema.optional(),
  highlightedTitle: localizedTextSchema.optional(),
  description: localizedTextSchema.optional(),
  sideTitle: localizedTextSchema.optional(),
  bgImage: localizedMediaSchema.optional(),
});

// Create country
export const createMarketSchema = z.object({
  title: localizedTextSchema,
  order: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
});

// Update country
export const updateMarketSchema = z.object({
  title: localizedTextSchema.optional(),
  order: z.coerce.number().int().min(0).optional(),
  isActive: z.coerce.boolean().optional(),
});
