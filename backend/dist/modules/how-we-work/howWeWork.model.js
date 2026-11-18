"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HowWeWorkStep = exports.HowWeWorkSection = void 0;
const mongoose_1 = require("mongoose");
const howWeWork_interface_1 = require("./howWeWork.interface");
const localizedString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};
const mediaSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
}, { _id: false });
// ---- Section (heading and photo, one document) ----
const sectionSchema = new mongoose_1.Schema({
    title: localizedString,
    colorTitle: localizedString,
    subtitle: localizedString,
    watermark: localizedString,
    image: {
        en: { type: [mediaSchema], default: [] },
        ar: { type: [mediaSchema], default: [] },
    },
}, { timestamps: true });
exports.HowWeWorkSection = (0, mongoose_1.model)("HowWeWorkSection", sectionSchema);
// ---- Steps (one document per step) ----
const stepSchema = new mongoose_1.Schema({
    title: localizedString,
    desc: localizedString,
    icon: { type: String, enum: [...howWeWork_interface_1.STEP_ICONS], required: true },
    order: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
stepSchema.index({ order: 1 });
exports.HowWeWorkStep = (0, mongoose_1.model)("HowWeWorkStep", stepSchema);
