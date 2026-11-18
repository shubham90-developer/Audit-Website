import { z } from "zod";

export const createEnquirySchema = z
  .object({
    name: z.string().trim().min(1).max(150),
    companyName: z.string().trim().max(200).optional().default(""),
    email: z.email().max(254),
    countryCode: z
      .string()
      .trim()
      .regex(/^\+\d{1,4}$/)
      .default("+971"),
    mobile: z
      .string()
      .trim()
      .regex(/^\d{7,15}$/),
    service: z.string().trim().min(1).max(200),
    requirements: z.string().trim().min(1).max(5000),
    language: z.enum(["en", "ar"]).default("en"),
  })
  .strict();

export const updateEnquirySchema = z
  .object({
    status: z.enum(["new", "contacted", "in_progress", "closed"]).optional(),
    adminNotes: z.string().max(5000).optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, {
    message: "Provide at least one field",
  });
