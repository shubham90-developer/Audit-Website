"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactContentModel = void 0;
const mongoose_1 = require("mongoose");
const localized = {
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
};
const media = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
}, { _id: false });
const localizedMedia = {
    en: { type: [media], default: [] },
    ar: { type: [media], default: [] },
};
const card = new mongoose_1.Schema({
    key: {
        type: String,
        enum: ["phone", "email", "whatsapp", "address"],
        required: true,
    },
    label: localized,
    value: localized,
    href: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
});
const feature = new mongoose_1.Schema({
    icon: {
        type: String,
        enum: ["headphones", "clock", "users", "shield"],
        default: "headphones",
    },
    title: localized,
    description: localized,
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
});
const schema = new mongoose_1.Schema({
    heroBadge: localized,
    heroTitle: localized,
    heroHighlight: localized,
    heroDescription: localized,
    heroBgImage: localizedMedia,
    heroVideo: localizedMedia,
    contactCards: { type: [card], default: [] },
    sectionBadge: localized,
    sectionTitle: localized,
    sectionHighlight: localized,
    sectionDescription: localized,
    sectionNote: localized,
    sectionBgImage: localizedMedia,
    features: { type: [feature], default: [] },
    formTitle: localized,
    formDescription: localized,
    formDisclaimer: localized,
}, { timestamps: true });
exports.ContactContentModel = (0, mongoose_1.model)("ContactPageContent", schema);
