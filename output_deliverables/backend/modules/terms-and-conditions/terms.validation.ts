import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().optional().default(""),
  ar: z.string().optional().default(""),
});

export const updateTermsSchema = z.object({
  title: localizedStringSchema,
  subTitle: localizedStringSchema,
  shortDesc: localizedStringSchema,
  content: localizedStringSchema,
});
