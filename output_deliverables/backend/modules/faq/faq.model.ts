import { Schema, model } from "mongoose";
import { IFaqCategory, IFaqItem } from "./faq.interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const faqCategorySchema = new Schema<IFaqCategory>(
  {
    name: localizedString,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const faqItemSchema = new Schema<IFaqItem>(
  {
    categoryId: { type: String, default: "" },
    categoryName: localizedString,
    question: localizedString,
    answer: localizedString,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const FaqCategory = model<IFaqCategory>("FaqCategory", faqCategorySchema);
export const FaqItem = model<IFaqItem>("FaqItem", faqItemSchema);
