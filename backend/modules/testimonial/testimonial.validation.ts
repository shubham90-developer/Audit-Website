import { z } from 'zod'
const localized = z.object({ en: z.string(), ar: z.string() })
const item = z.object({
  _id: z.string().optional(),
  clientName: localized,
  review: localized,
  platform: z.enum(['google', 'trustpilot', 'other']),
  rating: z.number().min(0).max(5).default(5),
  order: z.number().int(),
  active: z.boolean(),
})
export const updateTestimonialSectionSchema = z.object({
  eyebrow: localized,
  heading: localized,
  googlePrefix: localized,
  googleReviewCount: z.number().int().min(0),
  googleSuffix: localized,
  trustpilotPrefix: localized,
  trustpilotRating: localized,
  trustpilotSuffix: localized,
  testimonials: z.array(item),
})
