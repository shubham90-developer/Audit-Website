import { Schema, model } from "mongoose";
import { IPrivacyPolicy } from "./privacy.interface";

const localizedString = {
  en: { type: String, default: "", trim: true },
  ar: { type: String, default: "", trim: true },
};

const privacyPolicySchema = new Schema<IPrivacyPolicy>(
  {
    title: localizedString,
    subTitle: localizedString,
    shortDesc: localizedString,
    content: localizedString,
  },
  { timestamps: true }
);

export const PrivacyPolicy = model<IPrivacyPolicy>("PrivacyPolicy", privacyPolicySchema);
