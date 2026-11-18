"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateServiceSchema = exports.createServiceSchema = exports.updateSectionSchema = void 0;
const zod_1 = require("zod");
const whatWeDo_interface_1 = require("./whatWeDo.interface");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
// Section: all fields optional on update
exports.updateSectionSchema = zod_1.z
    .object({
    title: localizedString,
    colorTitle: localizedString,
    subtitle: localizedString,
    watermark: localizedString,
})
    .partial();
// Service: text fields. Images arrive as files.
exports.createServiceSchema = zod_1.z.object({
    name: localizedString,
    desc: localizedString,
    icon: zod_1.z.enum(whatWeDo_interface_1.ICON_KEYS),
    items: zod_1.z.array(localizedString).default([]),
    // form-data sends numbers as strings
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
exports.updateServiceSchema = exports.createServiceSchema.partial().extend({
    removePublicIds: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .optional()
        .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v])),
});
