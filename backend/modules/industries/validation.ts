import { z } from "zod";

const MAX_ITEMS = 10; // matches the item1..item10 upload fields

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

const localizedOptional = localizedString.optional();

// multer/qs sends arrays as { "0": ..., "1": ... }; JSON may send real arrays.
// Accept both, but only when keys are exactly 0..n-1 with no gaps.
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

const pointsSchema = indexedArray(
  z
    .array(localizedString)
    .min(1, "At least one point is required")
    .max(10, "A maximum of 10 points is allowed"),
);

// ---------- CREATE ----------
const itemCreateSchema = z.object({
  title: localizedString,
  description: localizedString,
  points: pointsSchema,
});

export const createIndustriesSchema = z.object({
  label: localizedString,
  heading: localizedString,
  subtitle: localizedString,
  items: indexedArray(
    z
      .array(itemCreateSchema)
      .min(1, "At least one industry is required")
      .max(MAX_ITEMS, `A maximum of ${MAX_ITEMS} industries is allowed`),
  ),
});

// ---------- UPDATE ----------
// Top-level text: every field optional, but if sent it needs en + ar.
export const updateIndustriesSchema = z.object({
  label: localizedOptional,
  heading: localizedOptional,
  subtitle: localizedOptional,
});

// Text of ONE industry, keyed by its position: { "0": {...}, "3": {...} }.
// If points are sent, the full list replaces the old one.
const itemUpdateSchema = z.object({
  title: localizedOptional,
  description: localizedOptional,
  points: pointsSchema.optional(),
});

export const updateItemsSchema = z.record(
  z.string().regex(/^\d+$/, "Item key must be a number"),
  itemUpdateSchema,
);
