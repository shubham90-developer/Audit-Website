import { Schema, model } from "mongoose";
import { ICounter } from "./counter.interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const statSchema = new Schema(
  {
    value: localizedString,
    unit: localizedString,
    label: localizedString,
  },
  { _id: false },
);

const counterSchema = new Schema<ICounter>(
  {
    heading: localizedString,
    stats: { type: [statSchema], default: [] },
  },
  { timestamps: true },
);

export const Counter = model<ICounter>("Counter", counterSchema);
