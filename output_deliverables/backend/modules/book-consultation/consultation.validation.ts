import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().optional().default(""),
  ar: z.string().optional().default(""),
});

export const updateConsultationSectionSchema = z.object({
  title: localizedStringSchema.optional(),
  colorTitle: localizedStringSchema.optional(),
  subtitle: localizedStringSchema.optional(),
  watermark: localizedStringSchema.optional(),
  formTitle: localizedStringSchema.optional(),
  formSubtitle: localizedStringSchema.optional(),
  buttonLabel: localizedStringSchema.optional(),
  confidentialNote: localizedStringSchema.optional(),
  contactBoxTitle: localizedStringSchema.optional(),
  contactBoxSubtitle: localizedStringSchema.optional(),
  contactBoxDesc: localizedStringSchema.optional(),
  officeHours: localizedStringSchema.optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  removePublicIds: z.array(z.string()).optional().default([]),
});

export const createConsultationEnquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  subject: z.string().optional().default(""),
  message: z.string().optional().default(""),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});
