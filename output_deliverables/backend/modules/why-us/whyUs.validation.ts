import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const updateWhyUsSectionSchema = z.object({
  label: localizedStringSchema,
  title: localizedStringSchema,
  watermark: localizedStringSchema,
  removePublicIds: z.array(z.string()).optional().default([]),
});

export const createWhyUsCardSchema = z.object({
  title: localizedStringSchema,
  text: localizedStringSchema,
  icon: z.string().default("shield"),
  side: z.enum(["left", "right"]),
  order: z.number().optional().default(0),
});

export const updateWhyUsCardSchema = createWhyUsCardSchema.partial();
