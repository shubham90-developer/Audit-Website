import { baseApi } from "./baseApi";
import type { ApiEnvelope, ContentRecord } from "./types";

/* ----------------------------- Types ----------------------------- */

export type LeadershipLang = "en" | "ar";

export interface LeadershipLocalized {
  en: string;
  ar: string;
}

export interface LeadershipMedia {
  url: string;
  publicId?: string;
}

export interface LeadershipLocalizedMedia {
  en: LeadershipMedia[];
  ar: LeadershipMedia[];
}

export interface LeadershipSection extends ContentRecord {
  _id: string;

  leadershipTitle: LeadershipLocalized;
  leadershipDescription: LeadershipLocalized;

  teamTitle: LeadershipLocalized;
  teamDescription: LeadershipLocalized;

  backgroundImage: LeadershipLocalizedMedia;

  createdAt?: string;
  updatedAt?: string;
}

export interface LeadershipMember extends ContentRecord {
  _id: string;

  name: LeadershipLocalized;
  role: LeadershipLocalized;
  bio: LeadershipLocalized;

  image?: LeadershipLocalizedMedia;

  order?: number;
  isActive?: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface LeadershipData extends ContentRecord {
  section: LeadershipSection | null;
  members: LeadershipMember[];
}

export const leadershipApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLeadership: builder.query<LeadershipData, void>({
      query: () => "/leadership",

      transformResponse: (response: ApiEnvelope<LeadershipData>) =>
        response.data,
    }),
  }),
});

/* ----------------------------- Hooks ----------------------------- */

export const { useGetLeadershipQuery, useLazyGetLeadershipQuery } =
  leadershipApi;
