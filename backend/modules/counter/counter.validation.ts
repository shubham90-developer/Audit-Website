import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

const statSchema = z.object({
  value: localizedString,
  unit: localizedString,
  label: localizedString,
});

// send heading, stats, or both. If you send stats, send the full list (it replaces the old one).
export const updateCounterSchema = z
  .object({
    heading: localizedString.optional(),
    stats: z
      .array(statSchema)
      .min(1, "At least one stat is required")
      .optional(),
  })
  .refine((data) => data.heading !== undefined || data.stats !== undefined, {
    message: "Send at least heading or stats",
  });
