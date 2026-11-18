"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTestimonialSectionSchema = void 0;
const zod_1 = require("zod");
const localized = zod_1.z.object({ en: zod_1.z.string(), ar: zod_1.z.string() });
const item = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    clientName: localized,
    review: localized,
    platform: zod_1.z.enum(['google', 'trustpilot', 'other']),
    rating: zod_1.z.number().min(0).max(5).default(5),
    order: zod_1.z.number().int(),
    active: zod_1.z.boolean(),
});
exports.updateTestimonialSectionSchema = zod_1.z.object({
    eyebrow: localized,
    heading: localized,
    googlePrefix: localized,
    googleReviewCount: zod_1.z.number().int().min(0),
    googleSuffix: localized,
    trustpilotPrefix: localized,
    trustpilotRating: localized,
    trustpilotSuffix: localized,
    testimonials: zod_1.z.array(item),
});
