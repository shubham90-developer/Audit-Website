"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatWeDoService = exports.WhatWeDoSection = void 0;
const mongoose_1 = require("mongoose");
const whatWeDo_interface_1 = require("./whatWeDo.interface");
const localizedString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};
const mediaSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
}, { _id: false });
const itemSchema = new mongoose_1.Schema({
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
}, { _id: false });
// ---- Section (heading, one document) ----
const sectionSchema = new mongoose_1.Schema({
    title: localizedString,
    colorTitle: localizedString,
    subtitle: localizedString,
    watermark: localizedString,
}, { timestamps: true });
exports.WhatWeDoSection = (0, mongoose_1.model)("WhatWeDoSection", sectionSchema);
// ---- Services (one document per tab) ----
const serviceSchema = new mongoose_1.Schema({
    name: localizedString,
    desc: localizedString,
    icon: { type: String, enum: [...whatWeDo_interface_1.ICON_KEYS], required: true },
    items: { type: [itemSchema], default: [] },
    image: {
        en: { type: [mediaSchema], default: [] },
        ar: { type: [mediaSchema], default: [] },
    },
    order: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
serviceSchema.index({ order: 1 });
exports.WhatWeDoService = (0, mongoose_1.model)("WhatWeDoService", serviceSchema);
