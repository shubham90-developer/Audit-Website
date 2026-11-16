import { Schema, model } from "mongoose";
import { ITermsAndConditions } from "./terms.interface";

const localizedString = {
  en: { type: String, default: "", trim: true },
  ar: { type: String, default: "", trim: true },
};

const termsSchema = new Schema<ITermsAndConditions>(
  {
    title: localizedString,
    subTitle: localizedString,
    shortDesc: localizedString,
    content: localizedString,
  },
  { timestamps: true }
);

export const TermsAndConditions = model<ITermsAndConditions>("TermsAndConditions", termsSchema);
