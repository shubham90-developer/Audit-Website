"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePartnerSchema = exports.createPartnerSchema = void 0;
const zod_1 = require("zod");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
// Text fields only. Logos arrive as files.
exports.createPartnerSchema = zod_1.z.object({
    title: localizedString,
    text: localizedString,
    // form-data sends numbers as strings
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
exports.updatePartnerSchema = exports.createPartnerSchema.partial().extend({
    removePublicIds: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .optional()
        .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v])),
});
