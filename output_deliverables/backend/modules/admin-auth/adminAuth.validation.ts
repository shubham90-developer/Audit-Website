import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

export const changeCredentialsSchema = z.object({
  currentPassword: z.string().min(4),
  newEmail: z.string().email().optional(),
  newPassword: z.string().min(6).optional(),
});
