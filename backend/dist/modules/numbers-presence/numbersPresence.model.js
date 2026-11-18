"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumbersOffice = exports.NumbersStat = exports.NumbersSection = void 0;
const mongoose_1 = require("mongoose");
const numbersPresence_interface_1 = require("./numbersPresence.interface");
const localizedString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};
const mediaSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
}, { _id: false });
const localizedMedia = {
    en: { type: [mediaSchema], default: [] },
    ar: { type: [mediaSchema], default: [] },
};
// ---- Section (rich text and backgrounds, one document) ----
const sectionSchema = new mongoose_1.Schema({
    numbersTitle: localizedString,
    securityTitle: localizedString,
    securityText: localizedString,
    insuranceText: localizedString,
    globalLabel: localizedString,
    globalTitle: localizedString,
    globalText: localizedString,
    sectionBg: localizedMedia,
    panelBg: localizedMedia,
}, { timestamps: true });
exports.NumbersSection = (0, mongoose_1.model)("NumbersSection", sectionSchema);
// ---- Stats ----
const statSchema = new mongoose_1.Schema({
    icon: { type: String, enum: [...numbersPresence_interface_1.STAT_ICONS], required: true },
    color: { type: String, enum: [...numbersPresence_interface_1.STAT_COLORS], required: true },
    value: { type: Number, required: true, min: 0 },
    suffix: { type: String, default: "", trim: true, maxlength: 5 },
    label: localizedString,
    order: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
statSchema.index({ order: 1 });
exports.NumbersStat = (0, mongoose_1.model)("NumbersStat", statSchema);
// ---- Offices ----
const officeSchema = new mongoose_1.Schema({
    city: localizedString,
    country: localizedString,
    flagCode: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        match: /^[a-z]{2}$/,
    },
    image: localizedMedia,
    order: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
officeSchema.index({ order: 1 });
exports.NumbersOffice = (0, mongoose_1.model)("NumbersOffice", officeSchema);
