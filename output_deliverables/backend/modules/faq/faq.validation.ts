import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const createFaqCategorySchema = z.object({
  name: localizedStringSchema,
  order: z.number().optional().default(0),
});

export const createFaqItemSchema = z.object({
  categoryId: z.string().optional().default(""),
  categoryName: localizedStringSchema,
  question: localizedStringSchema,
  answer: localizedStringSchema,
  order: z.number().optional().default(0),
});

export const updateFaqItemSchema = createFaqItemSchema.partial();
