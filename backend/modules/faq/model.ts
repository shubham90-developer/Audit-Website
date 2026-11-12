import { Schema, model } from "mongoose";
import { IFaq } from "./interface";

const MAX_ITEMS = 20;

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const itemSchema = new Schema(
  {
    question: localizedString,
    answer: localizedString,
  },
  { _id: false },
);

const faqSchema = new Schema<IFaq>(
  {
    singleton: { type: Boolean, default: true, unique: true, immutable: true },
    label: localizedString,
    heading: localizedString,
    ctaTitle: localizedString,
    ctaText: localizedString,
    items: {
      type: [itemSchema],
      default: [],
      validate: {
        validator: (v: unknown[]) => v.length <= MAX_ITEMS,
        message: `A maximum of ${MAX_ITEMS} questions is allowed`,
      },
    },
  },
  { timestamps: true },
);

export const Faq = model<IFaq>("Faq", faqSchema);
