import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

const mediaSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
});

export const createServiceCategorySchema = z.object({
  categoryId: z.number().int().positive(),
  slug: z.string().trim().min(1),
  name: localizedString,
  icon: z.string().trim().default("shield"),
  desc: localizedString,
  order: z.number().int().nonnegative().optional(),
});

export const updateServiceCategorySchema = createServiceCategorySchema.partial();

export const createServiceItemSchema = z.object({
  categoryId: z.number().int().positive(),
  categorySlug: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  name: localizedString,
  sub: localizedString,
  icon: z.string().trim().default("shield"),
  order: z.number().int().nonnegative().optional(),
});

export const updateServiceItemSchema = createServiceItemSchema.partial();
