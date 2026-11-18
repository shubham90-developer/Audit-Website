"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhoWeServeCard = exports.WhoWeServeSection = void 0;
const mongoose_1 = require("mongoose");
const whoWeServe_interface_1 = require("./whoWeServe.interface");
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
// ---- Section (headings and background, one document) ----
const sectionSchema = new mongoose_1.Schema({
    pillTitle: localizedString,
    pillHighlight: localizedString,
    whyTitle: localizedString,
    brandName: localizedString,
    whyIntroStart: localizedString,
    whyIntroBold: localizedString,
    whyIntroEnd: localizedString,
    leftBg: localizedMedia,
}, { timestamps: true });
exports.WhoWeServeSection = (0, mongoose_1.model)("WhoWeServeSection", sectionSchema);
// ---- Cards (serve cards and why cards) ----
const cardSchema = new mongoose_1.Schema({
    kind: { type: String, enum: [...whoWeServe_interface_1.CARD_KINDS], required: true },
    title: localizedString,
    text: localizedString,
    image: localizedMedia,
    order: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
cardSchema.index({ kind: 1, order: 1 });
exports.WhoWeServeCard = (0, mongoose_1.model)("WhoWeServeCard", cardSchema);
