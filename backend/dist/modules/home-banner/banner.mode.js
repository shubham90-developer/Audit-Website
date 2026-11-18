"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Banner = void 0;
const mongoose_1 = require("mongoose");
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
const ctaSchema = new mongoose_1.Schema({
    label: localizedString,
    href: localizedString,
    variant: {
        type: String,
        enum: ["primary", "secondary"],
        required: true,
    },
}, { _id: false });
const ftaCardSchema = new mongoose_1.Schema({
    line1: localizedString,
    line2: localizedString,
    licenseNumber: localizedString,
}, { _id: false });
const partnerCardSchema = new mongoose_1.Schema({
    title: localizedString,
    subtitle: localizedString,
}, { _id: false });
const experienceCardSchema = new mongoose_1.Schema({
    value: localizedString,
    label: localizedString,
    tagline: localizedString,
}, { _id: false });
const reviewRatingSchema = new mongoose_1.Schema({
    platform: {
        type: String,
        enum: ["google", "trustpilot"],
        required: true,
    },
    score: { type: Number, required: true, min: 0, max: 5 },
    label: localizedString,
}, { _id: false });
const bannerSchema = new mongoose_1.Schema({
    establishmentYear: localizedString,
    titleHighlight: localizedString,
    titleRest: localizedString,
    intro: localizedString,
    speakLabel: localizedString,
    primaryCta: { type: ctaSchema, required: true },
    secondaryCta: { type: ctaSchema, required: true },
    ftaCard: { type: ftaCardSchema, required: true },
    partnerCard: { type: partnerCardSchema, required: true },
    experienceCard: { type: experienceCardSchema, required: true },
    reviewRatings: { type: [reviewRatingSchema], default: [] },
    trustedNote: localizedString,
    bgImages: localizedMedia,
    bgVideos: localizedMedia,
    posterImage: localizedMedia,
}, { timestamps: true });
exports.Banner = (0, mongoose_1.model)("Banner", bannerSchema);
