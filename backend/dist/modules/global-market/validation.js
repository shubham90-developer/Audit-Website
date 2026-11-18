"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMarketSchema = exports.createMarketSchema = exports.updateSectionSchema = void 0;
const zod_1 = require("zod");
const localizedTextSchema = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
const mediaSchema = zod_1.z.object({
    url: zod_1.z.string().min(1),
    publicId: zod_1.z.string().optional().default(""),
});
const localizedMediaSchema = zod_1.z.object({
    en: zod_1.z.array(mediaSchema).optional(),
    ar: zod_1.z.array(mediaSchema).optional(),
});
// Main section
exports.updateSectionSchema = zod_1.z.object({
    badge: localizedTextSchema.optional(),
    title: localizedTextSchema.optional(),
    highlightedTitle: localizedTextSchema.optional(),
    description: localizedTextSchema.optional(),
    sideTitle: localizedTextSchema.optional(),
    bgImage: localizedMediaSchema.optional(),
});
// Create country
exports.createMarketSchema = zod_1.z.object({
    title: localizedTextSchema,
    order: zod_1.z.coerce.number().int().min(0).optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
});
// Update country
exports.updateMarketSchema = zod_1.z.object({
    title: localizedTextSchema.optional(),
    order: zod_1.z.coerce.number().int().min(0).optional(),
    isActive: zod_1.z.coerce.boolean().optional(),
});
