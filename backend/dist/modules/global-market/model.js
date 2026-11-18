"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalMarket = exports.GlobalMarketsSection = void 0;
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
// Main section schema
const globalMarketsSectionSchema = new mongoose_1.Schema({
    badge: localizedString,
    title: localizedString,
    highlightedTitle: localizedString,
    description: localizedString,
    sideTitle: localizedString,
    bgImage: localizedMedia,
}, { timestamps: true });
// Country cards schema
const globalMarketSchema = new mongoose_1.Schema({
    title: localizedString,
    image: localizedMedia,
    order: {
        type: Number,
        default: 0,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
globalMarketSchema.index({ order: 1 });
exports.GlobalMarketsSection = (0, mongoose_1.model)("GlobalMarketsSection", globalMarketsSectionSchema);
exports.GlobalMarket = (0, mongoose_1.model)("GlobalMarket", globalMarketSchema);
