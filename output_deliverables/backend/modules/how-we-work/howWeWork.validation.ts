import { z } from "zod";
import { STEP_ICONS } from "./howWeWork.interface";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

// Section text: all fields optional on update. The photo arrives as a file.
export const updateSectionSchema = z
  .object({
    title: localizedString,
    colorTitle: localizedString,
    subtitle: localizedString,
    watermark: localizedString,
  })
  .partial();

// Step: text only
export const createStepSchema = z.object({
  title: localizedString,
  desc: localizedString,
  icon: z.enum(STEP_ICONS),
  // form-data sends numbers as strings
  order: z.coerce.number().int().min(0).default(0),
});

export const updateStepSchema = createStepSchema.partial();
