export type Lang = "en" | "ar";

export interface ILocalized {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId: string;
}

export interface ILocalizedMedia {
  en: IMedia[];
  ar: IMedia[];
}

export interface ILeadershipSection {
  leadershipTitle: ILocalized;
  leadershipDescription: ILocalized;

  teamTitle: ILocalized;
  teamDescription: ILocalized;

  backgroundImage: ILocalizedMedia;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILeadershipMember {
  name: ILocalized;
  role: ILocalized;
  department: ILocalized;
  bio: ILocalized;

  image: ILocalizedMedia;

  isFeatured: boolean;
  isActive: boolean;
  order: number;

  createdAt?: Date;
  updatedAt?: Date;
}
