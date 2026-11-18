"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = void 0;
const mongoose_1 = require("mongoose");
const localizedString = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};
const mediaSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
}, { _id: false });
const localizedMedia = {
    en: { type: [mediaSchema], default: [] },
    ar: { type: [mediaSchema], default: [] },
};
const detailSchema = new mongoose_1.Schema({
    title: localizedString,
    description: localizedString,
    img: localizedMedia,
}, { _id: true });
const serviceSchema = new mongoose_1.Schema({
    title: localizedString,
    desc: localizedString,
    iconImg: localizedMedia,
    cardImg: localizedMedia,
    mainImg: localizedMedia,
    // NEW FIELDS
    bgImage: localizedMedia,
    bgVideo: localizedMedia,
    details: {
        type: [detailSchema],
        default: [],
    },
}, { timestamps: true });
exports.Service = (0, mongoose_1.model)("Service", serviceSchema);
