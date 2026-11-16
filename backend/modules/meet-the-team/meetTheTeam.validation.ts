import { z } from "zod";

const localizedString = z.object({
  en: z.string().trim().min(1, "English value is required"),
  ar: z.string().trim().min(1, "Arabic value is required"),
});

// All fields optional on update. The image arrives as a file.
export const updateMeetTheTeamSchema = z
  .object({
    leftTitle: localizedString,
    scriptTitle: localizedString,
    watermark: localizedString,
  })
  .partial();
