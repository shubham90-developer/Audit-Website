import { Schema, model } from "mongoose";
import { IHowWeWork, STEP_ICONS } from "./interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const media = {
  url: { type: String, default: "" },
  publicId: { type: String, default: "" },
};

const stepSchema = new Schema(
  {
    title: localizedString,
    description: localizedString,
    icon: { type: String, enum: STEP_ICONS, required: true },
  },
  { _id: false },
);

const howWeWorkSchema = new Schema<IHowWeWork>(
  {
    singleton: { type: Boolean, default: true, unique: true, immutable: true },
    label: localizedString,
    heading: localizedString,
    videoUrl: { type: String, default: "", trim: true },
    image: {
      en: media,
      ar: media,
    },
    steps: {
      type: [stepSchema],
      default: [],
      validate: {
        validator: (v: unknown[]) => v.length <= STEP_ICONS.length,
        message: `A maximum of ${STEP_ICONS.length} steps is allowed`,
      },
    },
  },
  { timestamps: true },
);

export const HowWeWork = model<IHowWeWork>("HowWeWork", howWeWorkSchema);
