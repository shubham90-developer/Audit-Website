import { Schema, model } from "mongoose";
import { IMeetTheTeam } from "./meetTheTeam.interface";

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

const meetTheTeamSchema = new Schema<IMeetTheTeam>(
  {
    leftTitle: localizedString,
    scriptTitle: localizedString,
    watermark: localizedString,
    marqueeText: {
      en: { type: String, default: "ACCOUNTING • TAX • AUDIT • " },
      ar: { type: String, default: "محاسبة • ضرائب • تدقيق • " },
    },
    marqueeSeconds: { type: Number, default: 60 },
    video: { type: mediaSchema, required: false },
    videoPoster: { type: mediaSchema, required: false },
    bgImage: { type: mediaSchema, required: false },
    image: {
      en: { type: [mediaSchema], default: [] },
      ar: { type: [mediaSchema], default: [] },
    },
  },
  { timestamps: true },
);

export const MeetTheTeam = model<IMeetTheTeam>("MeetTheTeam", meetTheTeamSchema);
