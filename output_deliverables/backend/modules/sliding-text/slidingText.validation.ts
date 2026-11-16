import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const updateSlidingTextSchema = z.object({
  textLeft: localizedStringSchema,
  textRight: localizedStringSchema,
  speed: z.number().optional().default(60),
  separator: z.string().optional().default("•"),
});
