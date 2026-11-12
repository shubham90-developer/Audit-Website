import { z } from "zod";
import { WHY_ICONS } from "./interface";

const MAX_ITEMS = WHY_ICONS.length; // 6 cards in the design

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

const localizedOptional = localizedString.optional();

const icon = z.enum(WHY_ICONS, {
  error: `icon must be one of: ${WHY_ICONS.join(", ")}`,
});
// multer/qs sends arrays as { "0": ..., "1": ... }; JSON may send real arrays.
// Accept both, but only when the keys are exactly 0..n-1 with no gaps.
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

const uniqueIcons = (items: { icon: string }[]) =>
  new Set(items.map((i) => i.icon)).size === items.length;

// ---------- CREATE ----------
const itemCreateSchema = z.object({
  title: localizedString,
  description: localizedString,
  icon,
});

export const createWhyChooseUsSchema = z.object({
  label: localizedString,
  heading: localizedString,
  items: indexedArray(
    z
      .array(itemCreateSchema)
      .min(1, "At least one item is required")
      .max(MAX_ITEMS, `A maximum of ${MAX_ITEMS} items is allowed`)
      .refine(uniqueIcons, "Each icon can only be used once"),
  ),
});

// ---------- UPDATE ----------
// Top-level text: every field optional, but if sent it needs en + ar.
export const updateWhyChooseUsSchema = z.object({
  label: localizedOptional,
  heading: localizedOptional,
});

// Text of ONE item, keyed by its position: { "0": {...}, "3": {...} }.
const itemUpdateSchema = z.object({
  title: localizedOptional,
  description: localizedOptional,
  icon: icon.optional(),
});

export const updateItemsSchema = z.record(
  z.string().regex(/^\d+$/, "Item key must be a number"),
  itemUpdateSchema,
);
