import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

// Text fields only. Logos arrive as files.
export const createPartnerSchema = z.object({
  title: localizedString,
  text: localizedString,
  // form-data sends numbers as strings
  order: z.coerce.number().int().min(0).default(0),
});

export const updatePartnerSchema = createPartnerSchema.partial().extend({
  removePublicIds: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v])),
});
