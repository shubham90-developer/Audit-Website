"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Industry = exports.IndustriesSection = void 0;
const mongoose_1 = require("mongoose");
const industries_interface_1 = require("./industries.interface");
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
// ---- Section (one document) ----
const sectionSchema = new mongoose_1.Schema({
    watermark: localizedString,
    title: localizedString,
    description: localizedString,
    footerTitle: localizedString,
    footerNote: localizedString,
    footerIcon: { type: String, enum: [...industries_interface_1.INDUSTRY_ICONS], required: true },
    sectionBg: localizedMedia,
}, { timestamps: true });
// Model names differ from the old industries module on purpose, so this
// module starts with fresh collections and does not clash with old documents.
exports.IndustriesSection = (0, mongoose_1.model)("IndustriesPageSection", sectionSchema);
// ---- Industries (cards) ----
const industrySchema = new mongoose_1.Schema({
    icon: { type: String, enum: [...industries_interface_1.INDUSTRY_ICONS], required: true },
    title: localizedString,
    desc: localizedString,
    image: localizedMedia,
    order: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
industrySchema.index({ order: 1 });
exports.Industry = (0, mongoose_1.model)("IndustryEntry", industrySchema);
