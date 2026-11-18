"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SiteSettingsModel = void 0;
const mongoose_1 = require("mongoose");
const localized = new mongoose_1.Schema({ en: { type: String, default: '' }, ar: { type: String, default: '' } }, { _id: false });
const media = new mongoose_1.Schema({ url: { type: String, default: '' }, publicId: { type: String, default: '' } }, { _id: false });
const schema = new mongoose_1.Schema({
    singleton: { type: String, unique: true, default: 'site-settings' },
    companyName: { type: localized, default: () => ({}) },
    tagline: { type: localized, default: () => ({}) },
    address: { type: localized, default: () => ({}) },
    officeHours: { type: localized, default: () => ({}) },
    footerDescription: { type: localized, default: () => ({}) },
    copyright: { type: localized, default: () => ({}) },
    footerQuickLinksTitle: { type: localized, default: () => ({}) },
    footerServicesTitle: { type: localized, default: () => ({}) },
    footerContactTitle: { type: localized, default: () => ({}) },
    headerFollowTitle: { type: localized, default: () => ({}) },
    whatsappCta: { type: localized, default: () => ({}) },
    phone: { type: String, default: '' },
    alternatePhone: { type: String, default: '' },
    email: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    googleMapsUrl: { type: String, default: '' },
    socials: { instagram: { type: String, default: '' }, facebook: { type: String, default: '' }, youtube: { type: String, default: '' }, linkedin: { type: String, default: '' }, x: { type: String, default: '' } },
    logo: { type: media, default: () => ({}) },
    footerLogo: { type: media, default: () => ({}) },
    favicon: { type: media, default: () => ({}) },
}, { timestamps: true });
exports.SiteSettingsModel = (0, mongoose_1.model)('SiteSettings', schema);
