"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceSchema = exports.createServiceSchema = void 0;
const zod_1 = require("zod");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
exports.createServiceSchema = zod_1.z.object({
    title: localizedString,
    desc: localizedString,
    details: zod_1.z
        .array(zod_1.z.object({
        title: localizedString,
        description: localizedString,
    }))
        .default([]),
});
exports.updateServiceSchema = zod_1.z.object({
    title: localizedString.optional(),
    desc: localizedString.optional(),
    details: zod_1.z
        .array(zod_1.z.object({
        _id: zod_1.z.string().optional(),
        title: localizedString,
        description: localizedString,
    }))
        .optional(),
});
