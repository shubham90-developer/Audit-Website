"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStepSchema = exports.createStepSchema = exports.updateSectionSchema = void 0;
const zod_1 = require("zod");
const howWeWork_interface_1 = require("./howWeWork.interface");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
// Section text: all fields optional on update. The photo arrives as a file.
exports.updateSectionSchema = zod_1.z
    .object({
    title: localizedString,
    colorTitle: localizedString,
    subtitle: localizedString,
    watermark: localizedString,
})
    .partial();
// Step: text only
exports.createStepSchema = zod_1.z.object({
    title: localizedString,
    desc: localizedString,
    icon: zod_1.z.enum(howWeWork_interface_1.STEP_ICONS),
    // form-data sends numbers as strings
    order: zod_1.z.coerce.number().int().min(0).default(0),
});
exports.updateStepSchema = exports.createStepSchema.partial();
