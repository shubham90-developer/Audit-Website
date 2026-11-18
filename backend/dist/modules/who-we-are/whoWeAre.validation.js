"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItemSchema = exports.createItemSchema = exports.updateSectionSchema = void 0;
const zod_1 = require("zod");
const whoWeAre_interface_1 = require("./whoWeAre.interface");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
// Optional text, empty allowed
const optionalLocalizedString = zod_1.z.object({
    en: zod_1.z.string().trim().max(300, "English text is too long"),
    ar: zod_1.z.string().trim().max(300, "Arabic text is too long"),
});
// Section text. All fields optional on update (PATCH).
// Snapshot cards are managed through the item endpoints below.
exports.updateSectionSchema = zod_1.z
    .object({
    eyebrow: localizedString,
    headlinePrefix: localizedString,
    highlight: localizedString,
    headlineSuffix: localizedString,
    brandName: localizedString,
    body: zod_1.z.object({
        en: zod_1.z.string().trim().min(1, "English body is required").max(2000),
        ar: zod_1.z.string().trim().min(1, "Arabic body is required").max(2000),
    }),
    quote: localizedString,
    ctaLabel: localizedString,
    ctaHref: localizedString,
    watermark: optionalLocalizedString,
    snapshotTitle: localizedString,
    snapshotTagline: localizedString,
})
    .partial();
// Snapshot card
exports.createItemSchema = zod_1.z.object({
    icon: zod_1.z.enum(whoWeAre_interface_1.WHO_ICONS),
    label: localizedString,
    value: localizedString,
    note: optionalLocalizedString.optional(),
    // optional. If omitted, the card goes last.
    order: zod_1.z.coerce.number().int().min(0).optional(),
});
exports.updateItemSchema = exports.createItemSchema.partial();
