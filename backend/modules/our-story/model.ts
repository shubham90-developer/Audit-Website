import { Schema, model } from "mongoose";
import { IOurStorySection, IOurStoryStep } from "./interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
  },
  { _id: false },
);

const localizedMedia = {
  en: { type: [mediaSchema], default: [] },
  ar: { type: [mediaSchema], default: [] },
};

// ---- Section (one document) ----
const sectionSchema = new Schema<IOurStorySection>(
  {
    badge: localizedString,
    narrative: localizedString,
    quote: localizedString,
    authorName: localizedString,
    authorRole: localizedString,
    authorImage: localizedMedia,
    bgImage: localizedMedia,
  },
  { timestamps: true },
);

export const OurStorySection = model<IOurStorySection>(
  "OurStoryContent",
  sectionSchema,
);

// ---- Steps (timeline) ----
const stepSchema = new Schema<IOurStoryStep>(
  {
    title: localizedString,
    text: localizedString,
    image: localizedMedia,
    order: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

stepSchema.index({ order: 1 });

export const OurStoryStep = model<IOurStoryStep>("OurStoryStep", stepSchema);
