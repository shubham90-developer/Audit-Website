import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

const ctaSchema = z.object({
  label: localizedString,
  href: localizedString,
  variant: z.enum(["primary", "secondary"]),
});

const ftaCardSchema = z.object({
  line1: localizedString,
  line2: localizedString,
  licenseNumber: localizedString,
});

const partnerCardSchema = z.object({
  title: localizedString,
  subtitle: localizedString,
});

const experienceCardSchema = z.object({
  value: localizedString,
  label: localizedString,
  tagline: localizedString,
});

const reviewRatingSchema = z.object({
  platform: z.enum(["google", "trustpilot"]),
  // Form-data sends numbers as strings, so coerce before checking the range
  score: z.coerce
    .number()
    .min(0, "Score must be 0 or more")
    .max(5, "Score must be 5 or less"),
  label: localizedString,
});

// Text fields only. Images/videos arrive as files, not in the body.
export const createBannerSchema = z.object({
  establishmentYear: localizedString,

  titleHighlight: localizedString,
  titleRest: localizedString,
  intro: localizedString,
  speakLabel: localizedString,

  primaryCta: ctaSchema,
  secondaryCta: ctaSchema,

  ftaCard: ftaCardSchema,
  partnerCard: partnerCardSchema,
  experienceCard: experienceCardSchema,
  reviewRatings: z
    .array(reviewRatingSchema)
    .min(1, "At least one review rating is required"),

  trustedNote: localizedString,
});

export const updateBannerSchema = createBannerSchema.partial().extend({
  // publicIds of existing images/videos to remove (form-data sends one string or many)
  removePublicIds: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v])),
});

export const langQuerySchema = z.object({
  lang: z.enum(["en", "ar"]).optional(),
});
