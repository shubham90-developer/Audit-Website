import { Schema, model } from "mongoose";
import { WHO_ICONS, IWhoWeAreSection } from "./whoWeAre.interface";

// Required in both languages
const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

// Optional in both languages. Empty string is allowed.
const optionalLocalizedString = {
  en: { type: String, default: "", trim: true },
  ar: { type: String, default: "", trim: true },
};

// ---- Snapshot card (embedded in the section, has its own _id) ----
const snapshotItemSchema = new Schema(
  {
    icon: { type: String, enum: [...WHO_ICONS], required: true },
    label: localizedString,
    value: localizedString,
    note: optionalLocalizedString,
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: false },
);

// ---- Section (one document) ----
const whoWeAreSchema = new Schema<IWhoWeAreSection>(
  {
    eyebrow: localizedString,
    headlinePrefix: localizedString,
    highlight: localizedString,
    headlineSuffix: localizedString,
    brandName: localizedString,
    body: localizedString,
    quote: localizedString,
    ctaLabel: localizedString,
    ctaHref: localizedString,
    watermark: optionalLocalizedString,
    snapshotTitle: localizedString,
    snapshotTagline: localizedString,
    snapshotItems: { type: [snapshotItemSchema], default: [] },
  },
  { timestamps: true },
);

export const WhoWeAreSection = model<IWhoWeAreSection>(
  "WhoWeAreSection",
  whoWeAreSchema,
);
