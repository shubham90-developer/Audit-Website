"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSection = void 0;
const mongoose_1 = require("mongoose");
const localized = new mongoose_1.Schema({ en: { type: String, default: "" }, ar: { type: String, default: "" } }, { _id: false });
const media = new mongoose_1.Schema({
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
}, { _id: false });
const localizedMedia = new mongoose_1.Schema({
    en: { type: media, default: () => ({}) },
    ar: { type: media, default: () => ({}) },
}, { _id: false });
const categorySchema = new mongoose_1.Schema({
    name: { type: localized, required: true },
    slug: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
});
const articleSchema = new mongoose_1.Schema({
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    slug: { type: String, required: true, trim: true },
    title: { type: localized, required: true },
    excerpt: { type: localized, required: true },
    content: { type: localized, required: true },
    cardImage: { type: localizedMedia, default: () => ({}) },
    mainImage: { type: localizedMedia, default: () => ({}) },
    publishedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    order: { type: Number, default: 0 },
}, { timestamps: true });
const blogSectionSchema = new mongoose_1.Schema({
    key: { type: String, default: "insights", unique: true },
    heroTitle: { type: localized, default: () => ({}) },
    heroDescription: { type: localized, default: () => ({}) },
    heroImage: { type: localizedMedia, default: () => ({}) },
    exploreLabel: {
        type: localized,
        default: () => ({ en: "Insights & Resources", ar: "المقالات والموارد" }),
    },
    categories: { type: [categorySchema], default: [] },
    articles: { type: [articleSchema], default: [] },
}, { timestamps: true });
exports.BlogSection = mongoose_1.models.BlogSection || (0, mongoose_1.model)("BlogSection", blogSectionSchema);
