import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

export const createEnquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  company: z.string().trim().optional(),
  email: z.string().email("Valid email is required"),
  code: z.string().trim().default("+971"),
  phone: z.string().trim().min(5, "Valid phone number is required"),
  service: z.string().trim().optional(),
  message: z.string().trim().optional(),
});

export const updateEnquiryStatusSchema = z.object({
  status: z.enum(["new", "in_progress", "resolved"]),
});
