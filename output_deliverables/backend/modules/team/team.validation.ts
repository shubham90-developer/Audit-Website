import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});

export const updateTeamSectionSchema = z.object({
  leadershipTitle: localizedStringSchema,
  leadershipColorTitle: localizedStringSchema,
  leadershipSubtitle: localizedStringSchema,
  leadershipWatermark: localizedStringSchema,

  teamTitle: localizedStringSchema,
  teamColorTitle: localizedStringSchema,
  teamSubtitle: localizedStringSchema,
  teamWatermark: localizedStringSchema,
});

export const createLeadershipSchema = z.object({
  name: localizedStringSchema,
  role: localizedStringSchema,
  bio: localizedStringSchema,
  order: z.number().optional().default(0),
});

export const updateLeadershipSchema = createLeadershipSchema.partial().extend({
  removePublicIds: z.array(z.string()).optional().default([]),
});

export const createTeamMemberSchema = z.object({
  name: localizedStringSchema,
  role: localizedStringSchema,
  dept: localizedStringSchema,
  order: z.number().optional().default(0),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial().extend({
  removePublicIds: z.array(z.string()).optional().default([]),
});
