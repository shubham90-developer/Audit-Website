import { z } from "zod";
import { CARD_KINDS } from "./whoWeServe.interface";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

// Section: text fields, all optional on update. Background comes as a file.
export const updateSectionSchema = z
  .object({
    pillTitle: localizedString,
    pillHighlight: localizedString,
    whyTitle: localizedString,
    brandName: localizedString,
    whyIntroStart: localizedString,
    whyIntroBold: localizedString,
    whyIntroEnd: localizedString,
  })
  .partial();

// Card: text fields. Images arrive as files.
export const createCardSchema = z.object({
  kind: z.enum(CARD_KINDS),
  title: localizedString,
  text: localizedString,
  // form-data sends numbers as strings
  order: z.coerce.number().int().min(0).default(0),
});

// kind cannot change after creation, so it is left out of updates
export const updateCardSchema = createCardSchema
  .omit({ kind: true })
  .partial()
  .extend({
    removePublicIds: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v])),
  });
