import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId?: string;
}

export interface ILocalizedMedia {
  en: IMedia[];
  ar: IMedia[];
}

export interface ITeamSection extends Document {
  leadershipTitle: ILocalizedString;
  leadershipColorTitle: ILocalizedString;
  leadershipSubtitle: ILocalizedString;
  leadershipWatermark: ILocalizedString;

  teamTitle: ILocalizedString;
  teamColorTitle: ILocalizedString;
  teamSubtitle: ILocalizedString;
  teamWatermark: ILocalizedString;

  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadershipMember extends Document {
  name: ILocalizedString;
  role: ILocalizedString;
  bio: ILocalizedString;
  image: ILocalizedMedia;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeamMember extends Document {
  name: ILocalizedString;
  role: ILocalizedString;
  dept: ILocalizedString;
  image: ILocalizedMedia;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
