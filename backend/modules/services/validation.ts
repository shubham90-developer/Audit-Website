import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

// top-level text (both optional)
export const updateWhatWeDoSchema = z.object({
  label: localizedString.optional(),
  heading: localizedString.optional(),
});

// text of ONE service card (both optional, but each one sent needs en + ar)
const itemTextSchema = z.object({
  title: localizedString.optional(),
  description: localizedString.optional(),
});

// body.items looks like { "0": { title: {...} }, "3": { description: {...} } }
// (key = position of the card in the list, starting at 0)
export const itemsInputSchema = z.record(
  z.string().regex(/^\d+$/, "Item key must be a number"),
  itemTextSchema,
);
