import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English content is required"),
  ar: z.string().trim().min(1, "Arabic content is required"),
});

const localizedMedia = z.object({
  en: z
    .array(
      z.object({
        url: z.string().min(1),
        publicId: z.string().optional().default(""),
      }),
    )
    .optional(),

  ar: z
    .array(
      z.object({
        url: z.string().min(1),
        publicId: z.string().optional().default(""),
      }),
    )
    .optional(),
});

// ================= SECTION =================

export const updateLeadershipSectionSchema = z.object({
  leadershipTitle: localizedString.optional(),

  leadershipDescription: localizedString.optional(),

  teamTitle: localizedString.optional(),

  teamDescription: localizedString.optional(),
});

// ================= MEMBER =================

export const createLeadershipMemberSchema = z.object({
  name: localizedString,
  role: localizedString,
  department: localizedString,
  bio: localizedString,

  isFeatured: z.coerce.boolean().default(false),

  isActive: z.coerce.boolean().default(true),

  order: z.coerce.number().int().min(0).default(0),
});

export const updateLeadershipMemberSchema = z.object({
  name: localizedString.optional(),
  role: localizedString.optional(),
  department: localizedString.optional(),
  bio: localizedString.optional(),

  isFeatured: z.coerce.boolean().optional(),
  isActive: z.coerce.boolean().optional(),

  order: z.coerce.number().int().min(0).optional(),
});
