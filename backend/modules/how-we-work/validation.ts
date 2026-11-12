import { z } from "zod";
import { STEP_ICONS } from "./interface";

const MAX_STEPS = STEP_ICONS.length;

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

const localizedOptional = localizedString.optional();

const icon = z.enum(STEP_ICONS, {
  error: `icon must be one of: ${STEP_ICONS.join(", ")}`,
});

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

const uniqueIcons = (items: { icon: string }[]) =>
  new Set(items.map((i) => i.icon)).size === items.length;

// ---------- CREATE ----------
const stepCreateSchema = z.object({
  title: localizedString,
  description: localizedString,
  icon,
});

export const createHowWeWorkSchema = z.object({
  label: localizedString,
  heading: localizedString,
  videoUrl: z
    .string()
    .trim()
    .url("videoUrl must be a valid URL")
    .optional()
    .or(z.literal("")),
  steps: indexedArray(
    z
      .array(stepCreateSchema)
      .min(1, "At least one step is required")
      .max(MAX_STEPS, `A maximum of ${MAX_STEPS} steps is allowed`)
      .refine(uniqueIcons, "Each icon can only be used once"),
  ),
});

// ---------- UPDATE ----------
export const updateHowWeWorkSchema = z.object({
  label: localizedOptional,
  heading: localizedOptional,
  videoUrl: z
    .string()
    .trim()
    .url("videoUrl must be a valid URL")
    .optional()
    .or(z.literal("")),
});

const stepUpdateSchema = z.object({
  title: localizedOptional,
  description: localizedOptional,
  icon: icon.optional(),
});

export const updateStepsSchema = z.record(
  z.string().regex(/^\d+$/, "Step key must be a number"),
  stepUpdateSchema,
);
