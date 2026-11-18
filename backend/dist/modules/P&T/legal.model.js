"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegalPage = void 0;
const mongoose_1 = require("mongoose");
const localized = new mongoose_1.Schema({ en: { type: String, default: '' }, ar: { type: String, default: '' } }, { _id: false });
const media = new mongoose_1.Schema({ url: { type: String, default: '' }, publicId: { type: String, default: '' } }, { _id: false });
const localizedMedia = new mongoose_1.Schema({ en: { type: media, default: () => ({}) }, ar: { type: media, default: () => ({}) } }, { _id: false });
const section = new mongoose_1.Schema({ title: { type: localized, required: true }, body: { type: localized, required: true }, bullets: { type: [localized], default: [] }, order: { type: Number, default: 0 } });
const schema = new mongoose_1.Schema({
    kind: { type: String, enum: ['privacy-policy', 'terms-and-conditions'], unique: true, required: true },
    heroTitle: { type: localized, required: true },
    heroDescription: { type: localized, required: true },
    heroImage: { type: localizedMedia, default: () => ({}) },
    intro: { type: localized, required: true },
    sidebarTitle: { type: localized, default: () => ({ en: 'ON THIS PAGE', ar: 'في هذه الصفحة' }) },
    sections: { type: [section], default: [] },
}, { timestamps: true });
exports.LegalPage = mongoose_1.models.LegalPage || (0, mongoose_1.model)('LegalPage', schema);
