import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().optional().default(""),
  ar: z.string().optional().default(""),
});

export const updateAboutUsSchema = z.object({
  hero: z.any().optional(),
  whoWeAre: z.any().optional(),
  ourStory: z.any().optional(),
  ourValues: z.any().optional(),
  nextChapter: z.any().optional(),
  removePublicIds: z.array(z.string()).optional().default([]),
});
