"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMarket = exports.updateMarket = exports.createMarket = exports.updateSection = exports.getGlobalMarkets = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const model_1 = require("./model");
const validation_1 = require("./validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const SECTION_FOLDER = "audit-website/global-markets/section";
const MARKET_FOLDER = "audit-website/global-markets/countries";
const BG_FIELDS = {
    en: "bgImageEn",
    ar: "bgImageAr",
};
const MARKET_FIELDS = {
    en: "marketImageEn",
    ar: "marketImageAr",
};
// Default content
const DEFAULT_SECTION = {
    badge: {
        en: "THE NEXT CHAPTER",
        ar: "الفصل التالي",
    },
    title: {
        en: "And the Story Expanded Across",
        ar: "وتوسعت قصتنا عبر",
    },
    highlightedTitle: {
        en: "Four Global Markets",
        ar: "أربعة أسواق عالمية",
    },
    description: {
        en: "What started in Business Bay grew into offices and an active presence across Dubai, Mississauga, the USA and Panama, helping businesses go further, wherever they are.",
        ar: "ما بدأ في منطقة الخليج التجاري توسع ليصبح حضوراً فعالاً ومكاتب في دبي وميسيساغا والولايات المتحدة وبنما، لمساعدة الشركات على التوسع والنمو أينما كانت.",
    },
    sideTitle: {
        en: "From Business Bay to the World",
        ar: "من الخليج التجاري إلى العالم",
    },
    bgImage: {
        en: [],
        ar: [],
    },
};
const DEFAULT_MARKETS = [
    {
        title: { en: "UAE", ar: "الإمارات العربية المتحدة" },
        image: { en: [], ar: [] },
        order: 0,
        isActive: true,
    },
    {
        title: { en: "Canada", ar: "كندا" },
        image: { en: [], ar: [] },
        order: 1,
        isActive: true,
    },
    {
        title: { en: "USA", ar: "الولايات المتحدة الأمريكية" },
        image: { en: [], ar: [] },
        order: 2,
        isActive: true,
    },
    {
        title: { en: "Panama", ar: "بنما" },
        image: { en: [], ar: [] },
        order: 3,
        isActive: true,
    },
];
// Initialize default content
const ensureDefaults = async () => {
    if (!(await model_1.GlobalMarketsSection.exists({}))) {
        await model_1.GlobalMarketsSection.create(DEFAULT_SECTION);
    }
    if (!(await model_1.GlobalMarket.exists({}))) {
        await model_1.GlobalMarket.insertMany(DEFAULT_MARKETS);
    }
};
// Parse multipart JSON fields
const normalizeBody = (body) => {
    const out = {};
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
            try {
                out[key] = JSON.parse(value);
                continue;
            }
            catch {
                // Keep original value
            }
        }
        out[key] = value;
    }
    return out;
};
const zodMessage = (error) => error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
const toMedia = (items) => items.map((item) => ({
    url: item.url,
    publicId: item.publicId ?? "",
}));
const mediaIds = (list) => (list ?? []).map((item) => item.publicId ?? "").filter((id) => id !== "");
const deleteAll = (ids) => Promise.allSettled(ids.map((id) => (0, upload_1.deleteFromCloudinary)(id, "image")));
// =====================================================
// GET GLOBAL MARKETS
// GET /v1/api/global-markets
// =====================================================
const getGlobalMarkets = async (_req, res) => {
    try {
        await ensureDefaults();
        const [section, markets] = await Promise.all([
            model_1.GlobalMarketsSection.findOne(),
            model_1.GlobalMarket.find().sort({ order: 1, createdAt: 1 }),
        ]);
        res.status(200).json({
            status: "success",
            data: {
                section,
                markets,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.getGlobalMarkets = getGlobalMarkets;
// =====================================================
// UPDATE MAIN SECTION
// PATCH /v1/api/global-markets/section
// =====================================================
const updateSection = async (req, res) => {
    try {
        const parsed = validation_1.updateSectionSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({
                status: "error",
                message: zodMessage(parsed.error),
            });
            return;
        }
        await ensureDefaults();
        const section = await model_1.GlobalMarketsSection.findOne();
        if (!section) {
            res.status(404).json({
                status: "error",
                message: "Section not found",
            });
            return;
        }
        section.set(parsed.data);
        const files = req.files;
        const toDelete = [];
        for (const lang of LANGS) {
            const incoming = files?.[BG_FIELDS[lang]];
            if (!incoming?.length)
                continue;
            const path = `bgImage.${lang}`;
            toDelete.push(...mediaIds(section.get(path)));
            const uploaded = await (0, upload_1.uploadMany)(incoming, SECTION_FOLDER, "image");
            section.set(path, toMedia(uploaded));
        }
        await section.save();
        await deleteAll(toDelete);
        res.status(200).json({
            status: "success",
            data: section,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.updateSection = updateSection;
// =====================================================
// CREATE COUNTRY CARD
// POST /v1/api/global-markets/countries
// =====================================================
const createMarket = async (req, res) => {
    try {
        const parsed = validation_1.createMarketSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({
                status: "error",
                message: zodMessage(parsed.error),
            });
            return;
        }
        const files = req.files;
        const images = {
            en: await (0, upload_1.uploadMany)(files?.[MARKET_FIELDS.en], MARKET_FOLDER, "image"),
            ar: await (0, upload_1.uploadMany)(files?.[MARKET_FIELDS.ar], MARKET_FOLDER, "image"),
        };
        const market = await model_1.GlobalMarket.create({
            ...parsed.data,
            image: {
                en: toMedia(images.en),
                ar: toMedia(images.ar),
            },
        });
        res.status(201).json({
            status: "success",
            data: market,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.createMarket = createMarket;
// =====================================================
// UPDATE COUNTRY CARD
// PATCH /v1/api/global-markets/countries/:id
// =====================================================
const updateMarket = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({
                status: "error",
                message: "Invalid market id",
            });
            return;
        }
        const parsed = validation_1.updateMarketSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({
                status: "error",
                message: zodMessage(parsed.error),
            });
            return;
        }
        const market = await model_1.GlobalMarket.findById(id);
        if (!market) {
            res.status(404).json({
                status: "error",
                message: "Market not found",
            });
            return;
        }
        market.set(parsed.data);
        const files = req.files;
        const toDelete = [];
        for (const lang of LANGS) {
            const incoming = files?.[MARKET_FIELDS[lang]];
            if (!incoming?.length)
                continue;
            const path = `image.${lang}`;
            toDelete.push(...mediaIds(market.get(path)));
            const uploaded = await (0, upload_1.uploadMany)(incoming, MARKET_FOLDER, "image");
            market.set(path, toMedia(uploaded));
        }
        await market.save();
        await deleteAll(toDelete);
        res.status(200).json({
            status: "success",
            data: market,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.updateMarket = updateMarket;
// =====================================================
// DELETE COUNTRY CARD
// DELETE /v1/api/global-markets/countries/:id
// =====================================================
const deleteMarket = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({
                status: "error",
                message: "Invalid market id",
            });
            return;
        }
        const market = await model_1.GlobalMarket.findByIdAndDelete(id);
        if (!market) {
            res.status(404).json({
                status: "error",
                message: "Market not found",
            });
            return;
        }
        await deleteAll([
            ...mediaIds(market.image.en),
            ...mediaIds(market.image.ar),
        ]);
        res.status(200).json({
            status: "success",
            message: "Market deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message,
        });
    }
};
exports.deleteMarket = deleteMarket;
