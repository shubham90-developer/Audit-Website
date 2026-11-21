"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCredentialsSchema = exports.signinSchema = void 0;
const zod_1 = require("zod");
exports.signinSchema = zod_1.z.object({
    email: zod_1.z.string().trim().toLowerCase().email("Valid email is required"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.changeCredentialsSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, "Current password is required"),
    newEmail: zod_1.z.string().trim().toLowerCase().email().optional(),
    newPassword: zod_1.z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(72, "New password must be at most 72 characters") // bcrypt limit
        .optional(),
})
    .refine((v) => v.newEmail || v.newPassword, {
    message: "Provide a new email or a new password",
});
