import { z } from "zod";
import { FEATURE_ICONS } from "./readyToWork.interface";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

// Only allow safe link targets: a path, an anchor, or an http(s) URL.
// This blocks values like javascript:alert(1).
const safeHref = z
  .string()
  .trim()
  .min(1, "Button link is required")
  .max(300, "Button link is too long")
  .refine((v) => /^(\/|#|https?:\/\/)/i.test(v), {
    message: "Button link must start with /, # or http(s)://",
  });

// Section text: all fields optional on update. The background arrives as a file.
export const updateSectionSchema = z
  .object({
    title: localizedString,
    highlight: localizedString,
    description: localizedString,
    buttonLabel: localizedString,
    buttonHref: safeHref,
    tagOne: localizedString,
    tagTwo: localizedString,
  })
  .partial();

// Feature card: text only
export const createFeatureSchema = z.object({
  icon: z.enum(FEATURE_ICONS),
  label: localizedString,
  // form-data sends numbers as strings
  order: z.coerce.number().int().min(0).default(0),
});

export const updateFeatureSchema = createFeatureSchema.partial();
