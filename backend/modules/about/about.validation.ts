import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

// Text fields only. The image arrives as a file, not in the body.
export const createMissionVisionSchema = z.object({
  title: localizedString,
  description: localizedString,
});

export const updateMissionVisionSchema = createMissionVisionSchema
  .partial()
  .extend({
    // publicIds of existing images to remove (form-data sends one string or many)
    removePublicIds: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v])),
  });
