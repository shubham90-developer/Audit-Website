"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutUs = void 0;
const mongoose_1 = require("mongoose");
const localizedString = {
    en: { type: String, default: "", trim: true },
    ar: { type: String, default: "", trim: true },
};
const mediaSchema = new mongoose_1.Schema({
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
}, { _id: false });
const localizedMedia = {
    en: { type: [mediaSchema], default: [] },
    ar: { type: [mediaSchema], default: [] },
};
const aboutUsSchema = new mongoose_1.Schema({
    hero: {
        title: localizedString,
        subtitle: localizedString,
        intro1: localizedString,
        intro2: localizedString,
        cta1Label: localizedString,
        cta1Href: { type: String, default: "/contact", trim: true },
        cta2Label: localizedString,
        cta2Href: { type: String, default: "/about", trim: true },
        speakLabel: localizedString,
        heroImage: localizedMedia,
        bgImage: localizedMedia,
        stats: [
            {
                value: { type: String, default: "" },
                label: localizedString,
                icon: { type: String, default: "building" },
            },
        ],
    },
    whoWeAre: {
        badge: localizedString,
        title: localizedString,
        text: localizedString,
        quote: localizedString,
        buttonLabel: localizedString,
        buttonHref: { type: String, default: "/services", trim: true },
        scriptText: localizedString,
        bgImage: localizedMedia,
        headerImage: localizedMedia,
        snapshotItems: [
            {
                label: localizedString,
                value: localizedString,
                text: localizedString,
                icon: { type: String, default: "award" },
            },
        ],
    },
    ourStory: {
        badge: localizedString,
        narrative: localizedString,
        bgImage: localizedMedia,
        steps: [
            {
                number: { type: String, default: "01" },
                title: localizedString,
                text: localizedString,
                image: localizedMedia,
            },
        ],
        quote: localizedString,
        authorName: localizedString,
        authorRole: localizedString,
        authorImage: localizedMedia,
    },
    ourValues: {
        label: localizedString,
        title: localizedString,
        values: [
            {
                number: { type: String, default: "01" },
                title: localizedString,
                text: localizedString,
                icon: { type: String, default: "target" },
            },
        ],
    },
    nextChapter: {
        badge: localizedString,
        title: localizedString,
        description: localizedString,
        scriptTagline: localizedString,
        bgImage: localizedMedia,
        countries: [
            {
                name: localizedString,
                image: localizedMedia,
            },
        ],
    },
}, { timestamps: true });
exports.AboutUs = (0, mongoose_1.model)("AboutUs", aboutUsSchema);
