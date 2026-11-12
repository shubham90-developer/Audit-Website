import { Schema, model } from "mongoose";
import { IMissionVision } from "./about.interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

// each object in the array keeps its own _id (used for update / delete)
const sectionSchema = new Schema({
  title: localizedString,
  description: localizedString,
  image: {
    en: { type: [mediaSchema], default: [] },
    ar: { type: [mediaSchema], default: [] },
  },
});

const missionVisionSchema = new Schema<IMissionVision>(
  {
    sections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true },
);

export const MissionVision = model<IMissionVision>(
  "MissionVision",
  missionVisionSchema,
);
