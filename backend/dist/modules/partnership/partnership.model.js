"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Partner = void 0;
const mongoose_1 = require("mongoose");
const localizedString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};
const mediaSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
}, { _id: false });
const partnerSchema = new mongoose_1.Schema({
    title: localizedString,
    text: localizedString,
    logo: {
        en: { type: [mediaSchema], default: [] },
        ar: { type: [mediaSchema], default: [] },
    },
    order: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
partnerSchema.index({ order: 1 });
exports.Partner = (0, mongoose_1.model)("Partner", partnerSchema);
