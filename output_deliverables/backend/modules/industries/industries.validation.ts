import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const updateIndustriesSectionSchema = z.object({
  title: localizedStringSchema,
  colorTitle: localizedStringSchema,
  subtitle: localizedStringSchema,
  watermark: localizedStringSchema,
  removePublicIds: z.array(z.string()).optional().default([]),
});

export const createIndustryItemSchema = z.object({
  title: localizedStringSchema,
  text: localizedStringSchema,
  icon: z.string().optional().default("building"),
  order: z.number().optional().default(0),
});

export const updateIndustryItemSchema = createIndustryItemSchema.partial().extend({
  removePublicIds: z.array(z.string()).optional().default([]),
});
