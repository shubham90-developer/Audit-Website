"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestimonialSection = void 0;
const mongoose_1 = require("mongoose");
const localized = new mongoose_1.Schema({ en: { type: String, default: "" }, ar: { type: String, default: "" } }, { _id: false });
const testimonial = new mongoose_1.Schema({
    clientName: { type: localized, default: () => ({}) },
    review: { type: localized, default: () => ({}) },
    platform: {
        type: String,
        enum: ["google", "trustpilot", "other"],
        default: "google",
    },
    rating: { type: Number, min: 0, max: 5, default: 5 },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
}, { timestamps: true });
const schema = new mongoose_1.Schema({
    singleton: { type: String, unique: true, default: "client-feedback" },
    eyebrow: {
        type: localized,
        default: () => ({ en: "CLIENT FEEDBACK", ar: "آراء العملاء" }),
    },
    heading: {
        type: localized,
        default: () => ({
            en: "What clients say about our Accounting Firm in Dubai",
            ar: "ماذا يقول عملاؤنا عن شركتنا للمحاسبة في دبي",
        }),
    },
    googlePrefix: {
        type: localized,
        default: () => ({ en: "Based on", ar: "بناءً على" }),
    },
    googleReviewCount: { type: Number, default: 200 },
    googleSuffix: {
        type: localized,
        default: () => ({ en: "Google Reviews", ar: "تقييمات جوجل" }),
    },
    trustpilotPrefix: {
        type: localized,
        default: () => ({ en: "Rated", ar: "التقييم" }),
    },
    trustpilotRating: {
        type: localized,
        default: () => ({ en: "Excellent", ar: "ممتاز" }),
    },
    trustpilotSuffix: {
        type: localized,
        default: () => ({ en: "on Trustpilot", ar: "على تراست بايلوت" }),
    },
    testimonials: { type: [testimonial], default: [] },
}, { timestamps: true });
exports.TestimonialSection = (0, mongoose_1.model)("TestimonialSection", schema);
