import { z } from "zod";

const MAX_ITEMS = 20;

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

const localizedOptional = localizedString.optional();

// multer/qs sends arrays as { "0": ..., "1": ... }; JSON may send real arrays.
const toArray = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const keys = Object.keys(value).map(Number);
  if (keys.some(Number.isNaN)) return value;
  keys.sort((a, b) => a - b);
  if (!keys.every((k, i) => k === i)) return value;
  return keys.map((k) => (value as any)[k]);
};

const indexedArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess(toArray, schema);

const itemSchema = z.object({
  question: localizedString,
  answer: localizedString,
});

const itemsSchema = indexedArray(
  z
    .array(itemSchema)
    .min(1, "At least one question is required")
    .max(MAX_ITEMS, `A maximum of ${MAX_ITEMS} questions is allowed`),
);

// ---------- CREATE ----------
export const createFaqSchema = z.object({
  label: localizedString,
  heading: localizedString,
  ctaTitle: localizedString,
  ctaText: localizedString,
  items: itemsSchema,
});

// ---------- UPDATE ----------
// Sending `items` replaces the full list (use it to add, remove or reorder).
export const updateFaqSchema = z.object({
  label: localizedOptional,
  heading: localizedOptional,
  ctaTitle: localizedOptional,
  ctaText: localizedOptional,
  items: itemsSchema.optional(),
});
