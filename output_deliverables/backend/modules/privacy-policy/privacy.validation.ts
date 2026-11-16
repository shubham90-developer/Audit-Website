import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().optional().default(""),
  ar: z.string().optional().default(""),
});

export const updatePrivacySchema = z.object({
  title: localizedStringSchema,
  subTitle: localizedStringSchema,
  shortDesc: localizedStringSchema,
  content: localizedStringSchema,
});
