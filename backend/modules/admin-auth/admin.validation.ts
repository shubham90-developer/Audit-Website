import { z } from "zod";

export const signinSchema = z.object({
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const changeCredentialsSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newEmail: z.string().trim().toLowerCase().email().optional(),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .max(72, "New password must be at most 72 characters") // bcrypt limit
      .optional(),
  })
  .refine((v) => v.newEmail || v.newPassword, {
    message: "Provide a new email or a new password",
  });
