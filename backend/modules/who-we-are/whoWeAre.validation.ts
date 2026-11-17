import { z } from "zod";
import { WHO_ICONS } from "./whoWeAre.interface";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

// Optional text, empty allowed
const optionalLocalizedString = z.object({
  en: z.string().trim().max(300, "English text is too long"),
  ar: z.string().trim().max(300, "Arabic text is too long"),
});

// Section text. All fields optional on update (PATCH).
// Snapshot cards are managed through the item endpoints below.
export const updateSectionSchema = z
  .object({
    eyebrow: localizedString,
    headlinePrefix: localizedString,
    highlight: localizedString,
    headlineSuffix: localizedString,
    brandName: localizedString,
    body: z.object({
      en: z.string().trim().min(1, "English body is required").max(2000),
      ar: z.string().trim().min(1, "Arabic body is required").max(2000),
    }),
    quote: localizedString,
    ctaLabel: localizedString,
    ctaHref: localizedString,
    watermark: optionalLocalizedString,
    snapshotTitle: localizedString,
    snapshotTagline: localizedString,
  })
  .partial();

// Snapshot card
export const createItemSchema = z.object({
  icon: z.enum(WHO_ICONS),
  label: localizedString,
  value: localizedString,
  note: optionalLocalizedString.optional(),
  // optional. If omitted, the card goes last.
  order: z.coerce.number().int().min(0).optional(),
});

export const updateItemSchema = createItemSchema.partial();
