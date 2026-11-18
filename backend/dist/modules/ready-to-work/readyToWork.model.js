"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadyToWorkFeature = exports.ReadyToWorkSection = void 0;
const mongoose_1 = require("mongoose");
const readyToWork_interface_1 = require("./readyToWork.interface");
const localizedString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};
const mediaSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
}, { _id: false });
// ---- Section (one document) ----
const sectionSchema = new mongoose_1.Schema({
    title: localizedString,
    highlight: localizedString,
    description: localizedString,
    buttonLabel: localizedString,
    buttonHref: { type: String, required: true, trim: true },
    tagOne: localizedString,
    tagTwo: localizedString,
    bgImage: {
        en: { type: [mediaSchema], default: [] },
        ar: { type: [mediaSchema], default: [] },
    },
}, { timestamps: true });
exports.ReadyToWorkSection = (0, mongoose_1.model)("ReadyToWorkSection", sectionSchema);
// ---- Features (bottom cards) ----
const featureSchema = new mongoose_1.Schema({
    icon: { type: String, enum: [...readyToWork_interface_1.FEATURE_ICONS], required: true },
    label: localizedString,
    order: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
featureSchema.index({ order: 1 });
exports.ReadyToWorkFeature = (0, mongoose_1.model)("ReadyToWorkFeature", featureSchema);
