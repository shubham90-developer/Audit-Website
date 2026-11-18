"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadershipMemberSchema = exports.createLeadershipMemberSchema = exports.updateLeadershipSectionSchema = void 0;
const zod_1 = require("zod");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English content is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic content is required"),
});
const localizedMedia = zod_1.z.object({
    en: zod_1.z
        .array(zod_1.z.object({
        url: zod_1.z.string().min(1),
        publicId: zod_1.z.string().optional().default(""),
    }))
        .optional(),
    ar: zod_1.z
        .array(zod_1.z.object({
        url: zod_1.z.string().min(1),
        publicId: zod_1.z.string().optional().default(""),
    }))
        .optional(),
});
// ================= SECTION =================
exports.updateLeadershipSectionSchema = zod_1.z.object({
    leadershipTitle: localizedString.optional(),
    leadershipDescription: localizedString.optional(),
    teamTitle: localizedString.optional(),
    teamDescription: localizedString.optional(),
});
// ================= MEMBER =================
exports.createLeadershipMemberSchema = zod_1.z.object({
    name: localizedString,
    role: localizedString,
    department: localizedString,
    bio: localizedString,
    isFeatured: zod_1.z.coerce.boolean().default(false),
    isActive: zod_1.z.coerce.boolean().default(true),
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
exports.updateLeadershipMemberSchema = zod_1.z.object({
    name: localizedString.optional(),
    role: localizedString.optional(),
    department: localizedString.optional(),
    bio: localizedString.optional(),
    isFeatured: zod_1.z.coerce.boolean().optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
    order: zod_1.z.coerce.number().int().min(0).optional(),
});
