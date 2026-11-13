import { z } from "zod";
import { ICON_KEYS } from "./whatWeDo.interface";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

// Section: all fields optional on update
export const updateSectionSchema = z
  .object({
    title: localizedString,
    colorTitle: localizedString,
    subtitle: localizedString,
    watermark: localizedString,
  })
  .partial();

// Service: text fields. Images arrive as files.
export const createServiceSchema = z.object({
  name: localizedString,
  desc: localizedString,
  icon: z.enum(ICON_KEYS),
  items: z.array(localizedString).default([]),
  // form-data sends numbers as strings
  order: z.coerce.number().int().min(0).default(0),
});

export const updateServiceSchema = createServiceSchema.partial().extend({
  removePublicIds: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v])),
});
