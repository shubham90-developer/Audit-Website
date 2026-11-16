import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string().optional().default(""),
  ar: z.string().optional().default(""),
});

export const updateSettingsSchema = z.object({
  mobileNo: z.string().optional(),
  alternateMobileNo: z.string().optional(),
  mail: z.string().optional(),
  alternateEmail: z.string().optional(),
  whatsApp: z.string().optional(),

  address: localizedStringSchema.optional(),
  addressIframe: z.string().optional(),
  workingHrs: localizedStringSchema.optional(),

  facebook: z.string().optional(),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),

  footerDesc: localizedStringSchema.optional(),
  footerCopyrights: localizedStringSchema.optional(),

  removePublicIds: z.array(z.string()).optional().default([]),
});
