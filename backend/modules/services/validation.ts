import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

export const createServiceSchema = z.object({
  title: localizedString,
  desc: localizedString,

  details: z
    .array(
      z.object({
        title: localizedString,
        description: localizedString,
      }),
    )
    .default([]),
});

export const updateServiceSchema = z.object({
  title: localizedString.optional(),
  desc: localizedString.optional(),

  details: z
    .array(
      z.object({
        _id: z.string().optional(),
        title: localizedString,
        description: localizedString,
      }),
    )
    .optional(),
});
