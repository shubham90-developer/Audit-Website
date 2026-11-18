"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEnquirySchema = exports.createEnquirySchema = void 0;
const zod_1 = require("zod");
exports.createEnquirySchema = zod_1.z
    .object({
    name: zod_1.z.string().trim().min(1).max(150),
    companyName: zod_1.z.string().trim().max(200).optional().default(""),
    email: zod_1.z.email().max(254),
    countryCode: zod_1.z
        .string()
        .trim()
        .regex(/^\+\d{1,4}$/)
        .default("+971"),
    mobile: zod_1.z
        .string()
        .trim()
        .regex(/^\d{7,15}$/),
    service: zod_1.z.string().trim().min(1).max(200),
    requirements: zod_1.z.string().trim().min(1).max(5000),
    language: zod_1.z.enum(["en", "ar"]).default("en"),
})
    .strict();
exports.updateEnquirySchema = zod_1.z
    .object({
    status: zod_1.z.enum(["new", "contacted", "in_progress", "closed"]).optional(),
    adminNotes: zod_1.z.string().max(5000).optional(),
})
    .strict()
    .refine((v) => Object.keys(v).length > 0, {
    message: "Provide at least one field",
});
