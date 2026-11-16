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
    image: {
      en: { type: [mediaSchema], default: [] },
      ar: { type: [mediaSchema], default: [] },
    },
  },
  { timestamps: true },
);

export const MeetTheTeam = model<IMeetTheTeam>("MeetTheTeam", meetTheTeamSchema);
