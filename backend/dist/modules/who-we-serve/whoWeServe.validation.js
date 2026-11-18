"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCardSchema = exports.createCardSchema = exports.updateSectionSchema = void 0;
const zod_1 = require("zod");
const whoWeServe_interface_1 = require("./whoWeServe.interface");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
// Section: text fields, all optional on update. Background comes as a file.
exports.updateSectionSchema = zod_1.z
    .object({
    pillTitle: localizedString,
    pillHighlight: localizedString,
    whyTitle: localizedString,
    brandName: localizedString,
    whyIntroStart: localizedString,
    whyIntroBold: localizedString,
    whyIntroEnd: localizedString,
})
    .partial();
// Card: text fields. Images arrive as files.
exports.createCardSchema = zod_1.z.object({
    kind: zod_1.z.enum(whoWeServe_interface_1.CARD_KINDS),
    title: localizedString,
    text: localizedString,
    // form-data sends numbers as strings
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
// kind cannot change after creation, so it is left out of updates
exports.updateCardSchema = exports.createCardSchema
    .omit({ kind: true })
    .partial()
    .extend({
    removePublicIds: zod_1.z
        .union([zod_1.z.string(), zod_1.z.array(zod_1.z.string())])
        .optional()
        .transform((v) => (v === undefined ? [] : Array.isArray(v) ? v : [v])),
});
