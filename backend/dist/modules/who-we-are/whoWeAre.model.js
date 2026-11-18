"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhoWeAreSection = void 0;
const mongoose_1 = require("mongoose");
const whoWeAre_interface_1 = require("./whoWeAre.interface");
// Required in both languages
const localizedString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};
// Optional in both languages. Empty string is allowed.
const optionalLocalizedString = {
    en: { type: String, default: "", trim: true },
    ar: { type: String, default: "", trim: true },
};
// ---- Snapshot card (embedded in the section, has its own _id) ----
const snapshotItemSchema = new mongoose_1.Schema({
    icon: { type: String, enum: [...whoWeAre_interface_1.WHO_ICONS], required: true },
    label: localizedString,
    value: localizedString,
    note: optionalLocalizedString,
    order: { type: Number, default: 0, min: 0 },
}, { timestamps: false });
// ---- Section (one document) ----
const whoWeAreSchema = new mongoose_1.Schema({
    eyebrow: localizedString,
    headlinePrefix: localizedString,
    highlight: localizedString,
    headlineSuffix: localizedString,
    brandName: localizedString,
    body: localizedString,
    quote: localizedString,
    ctaLabel: localizedString,
    ctaHref: localizedString,
    watermark: optionalLocalizedString,
    snapshotTitle: localizedString,
    snapshotTagline: localizedString,
    snapshotItems: { type: [snapshotItemSchema], default: [] },
}, { timestamps: true });
exports.WhoWeAreSection = (0, mongoose_1.model)("WhoWeAreSection", whoWeAreSchema);
