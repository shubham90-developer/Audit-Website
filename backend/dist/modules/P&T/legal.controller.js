"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLegalPage = exports.getLegalPage = void 0;
const legal_model_1 = require("./legal.model");
const legal_defaults_1 = require("./legal.defaults");
const legal_upload_1 = require("./legal.upload");
const kinds = ["privacy-policy", "terms-and-conditions"];
const valid = (value) => typeof value === "string" && kinds.includes(value);
const localized = (value) => value && typeof value.en === "string" && typeof value.ar === "string";
// GET LEGAL PAGE
const getLegalPage = async (req, res) => {
    try {
        const kind = req.params.kind;
        if (!valid(kind)) {
            return res.status(400).json({
                success: false,
                message: "Invalid legal page",
            });
        }
        const data = await legal_model_1.LegalPage.findOneAndUpdate({ kind }, {
            $setOnInsert: (0, legal_defaults_1.defaultLegalPage)(kind),
        }, {
            upsert: true,
            returnDocument: "after",
            runValidators: true,
        });
        return res.json({
            success: true,
            data,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to fetch legal page",
        });
    }
};
exports.getLegalPage = getLegalPage;
// UPDATE LEGAL PAGE
const updateLegalPage = async (req, res) => {
    try {
        const kind = req.params.kind;
        if (!valid(kind)) {
            return res.status(400).json({
                success: false,
                message: "Invalid legal page",
            });
        }
        const payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
        // Validate localized fields
        for (const key of [
            "heroTitle",
            "heroDescription",
            "intro",
            "sidebarTitle",
        ]) {
            if (!localized(payload[key])) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid ${key}`,
                });
            }
        }
        // Validate sections
        if (!Array.isArray(payload.sections) ||
            payload.sections.some((s) => !localized(s.title) ||
                !localized(s.body) ||
                !Array.isArray(s.bullets) ||
                s.bullets.some((b) => !localized(b)))) {
            return res.status(400).json({
                success: false,
                message: "Invalid sections",
            });
        }
        // Get existing page
        const existing = await legal_model_1.LegalPage.findOne({
            kind,
        });
        const heroImage = existing?.heroImage?.toObject?.() || (0, legal_defaults_1.defaultLegalPage)(kind).heroImage;
        // Handle Cloudinary image uploads
        const files = req.files;
        for (const lang of ["en", "ar"]) {
            const file = files?.[`heroImage${lang === "en" ? "En" : "Ar"}`]?.[0];
            if (file) {
                heroImage[lang] = await (0, legal_upload_1.uploadToCloudinary)(file);
            }
        }
        // Update legal page
        const data = await legal_model_1.LegalPage.findOneAndUpdate({ kind }, {
            $set: {
                heroTitle: payload.heroTitle,
                heroDescription: payload.heroDescription,
                intro: payload.intro,
                sidebarTitle: payload.sidebarTitle,
                sections: payload.sections,
                heroImage,
            },
        }, {
            upsert: true,
            returnDocument: "after",
            runValidators: true,
        });
        return res.json({
            success: true,
            message: "Page updated",
            data,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to update legal page",
        });
    }
};
exports.updateLegalPage = updateLegalPage;
