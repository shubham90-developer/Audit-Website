import { Schema, model } from "mongoose";

import { ILeadershipSection, ILeadershipMember } from "./interface";

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

// ================= SECTION =================

const leadershipSectionSchema = new Schema<ILeadershipSection>(
  {
    leadershipTitle: localizedString,
    leadershipDescription: localizedString,

    teamTitle: localizedString,
    teamDescription: localizedString,

    backgroundImage: localizedMedia,
  },
  { timestamps: true },
);

export const LeadershipSection = model<ILeadershipSection>(
  "LeadershipSection",
  leadershipSectionSchema,
);

// ================= MEMBERS =================

const leadershipMemberSchema = new Schema<ILeadershipMember>(
  {
    name: localizedString,
    role: localizedString,
    department: localizedString,
    bio: localizedString,

    image: localizedMedia,

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

leadershipMemberSchema.index({
  order: 1,
  isActive: 1,
});

export const LeadershipMember = model<ILeadershipMember>(
  "LeadershipMember",
  leadershipMemberSchema,
);
