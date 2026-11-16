import { Schema, model } from "mongoose";
import { ITeamSection, ILeadershipMember, ITeamMember } from "./team.interface";

const localizedString = {
  en: { type: String, required: true, trim: true },
  ar: { type: String, required: true, trim: true },
};

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const localizedMedia = {
  en: { type: [mediaSchema], default: [] },
  ar: { type: [mediaSchema], default: [] },
};

const teamSectionSchema = new Schema<ITeamSection>(
  {
    leadershipTitle: localizedString,
    leadershipColorTitle: localizedString,
    leadershipSubtitle: localizedString,
    leadershipWatermark: localizedString,

    teamTitle: localizedString,
    teamColorTitle: localizedString,
    teamSubtitle: localizedString,
    teamWatermark: localizedString,
  },
  { timestamps: true }
);

const leadershipMemberSchema = new Schema<ILeadershipMember>(
  {
    name: localizedString,
    role: localizedString,
    bio: localizedString,
    image: localizedMedia,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const teamMemberSchema = new Schema<ITeamMember>(
  {
    name: localizedString,
    role: localizedString,
    dept: localizedString,
    image: localizedMedia,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const TeamSection = model<ITeamSection>("TeamSection", teamSectionSchema);
export const LeadershipMember = model<ILeadershipMember>("LeadershipMember", leadershipMemberSchema);
export const TeamMember = model<ITeamMember>("TeamMember", teamMemberSchema);
