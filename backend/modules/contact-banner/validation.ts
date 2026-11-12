import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

// Text fields only (all optional). Images arrive as files, not in the body.
export const updateContactBannerSchema = z.object({
  header: localizedString.optional(),
  title: localizedString.optional(),
  description: localizedString.optional(),
});
