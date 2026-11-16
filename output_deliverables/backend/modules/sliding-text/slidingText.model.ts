import { Schema, model } from "mongoose";
import { ISlidingText } from "./slidingText.interface";

const localizedString = {
  en: { type: String, default: "", trim: true },
  ar: { type: String, default: "", trim: true },
};

const slidingTextSchema = new Schema<ISlidingText>(
  {
    textLeft: localizedString,
    textRight: localizedString,
    speed: { type: Number, default: 60 },
    separator: { type: String, default: "•" },
  },
  { timestamps: true }
);

export const SlidingText = model<ISlidingText>("SlidingText", slidingTextSchema);
