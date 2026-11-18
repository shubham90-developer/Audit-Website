"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OurStoryStep = exports.OurStorySection = void 0;
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
// ---- Section (one document) ----
const sectionSchema = new mongoose_1.Schema({
    badge: localizedString,
    narrative: localizedString,
    quote: localizedString,
    authorName: localizedString,
    authorRole: localizedString,
    authorImage: localizedMedia,
    bgImage: localizedMedia,
}, { timestamps: true });
exports.OurStorySection = (0, mongoose_1.model)("OurStoryContent", sectionSchema);
// ---- Steps (timeline) ----
const stepSchema = new mongoose_1.Schema({
    title: localizedString,
    text: localizedString,
    image: localizedMedia,
    order: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
stepSchema.index({ order: 1 });
exports.OurStoryStep = (0, mongoose_1.model)("OurStoryStep", stepSchema);
