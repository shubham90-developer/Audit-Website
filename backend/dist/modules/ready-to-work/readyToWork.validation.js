"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeatureSchema = exports.createFeatureSchema = exports.updateSectionSchema = void 0;
const zod_1 = require("zod");
const readyToWork_interface_1 = require("./readyToWork.interface");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
// Only allow safe link targets: a path, an anchor, or an http(s) URL.
// This blocks values like javascript:alert(1).
const safeHref = zod_1.z
    .string()
    .trim()
    .min(1, "Button link is required")
    .max(300, "Button link is too long")
    .refine((v) => /^(\/|#|https?:\/\/)/i.test(v), {
    message: "Button link must start with /, # or http(s)://",
});
// Section text: all fields optional on update. The background arrives as a file.
exports.updateSectionSchema = zod_1.z
    .object({
    title: localizedString,
    highlight: localizedString,
    description: localizedString,
    buttonLabel: localizedString,
    buttonHref: safeHref,
    tagOne: localizedString,
    tagTwo: localizedString,
})
    .partial();
// Feature card: text only
exports.createFeatureSchema = zod_1.z.object({
    icon: zod_1.z.enum(readyToWork_interface_1.FEATURE_ICONS),
    label: localizedString,
    // form-data sends numbers as strings
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
exports.updateFeatureSchema = exports.createFeatureSchema.partial();
