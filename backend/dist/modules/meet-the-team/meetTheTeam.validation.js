"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeetTheTeamSchema = void 0;
const zod_1 = require("zod");
const localizedString = zod_1.z.object({
    en: zod_1.z.string().trim().min(1, "English value is required"),
    ar: zod_1.z.string().trim().min(1, "Arabic value is required"),
});
// All fields optional on update. The image arrives as a file.
exports.updateMeetTheTeamSchema = zod_1.z
    .object({
    leftTitle: localizedString,
    scriptTitle: localizedString,
    watermark: localizedString,
})
    .partial();
