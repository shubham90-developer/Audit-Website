"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.getAllBanners = exports.createBanner = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const banner_mode_1 = require("./banner.mode");
const banner_validation_1 = require("./banner.validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
// which multer field / Cloudinary folder / resource type belongs to each media key
const MEDIA = [
    {
        key: "bgImages",
        type: "image",
        folder: "audit-website/banner/images",
        fields: { en: "bgImagesEn", ar: "bgImagesAr" },
    },
    {
        key: "posterImage",
        type: "image",
        folder: "audit-website/banner/images",
        fields: { en: "posterImageEn", ar: "posterImageAr" },
    },
    {
        key: "bgVideos",
        type: "video",
        folder: "audit-website/banner/videos",
        fields: { en: "bgVideosEn", ar: "bgVideosAr" },
    },
];
// Default content used when the collection is empty.
// Values come from the original hardcoded component. Media starts empty,
// so upload real images and videos through PATCH.
const DEFAULT_BANNER = {
    establishmentYear: { en: "Established 1999", ar: "تأسست عام 1999" },
    titleHighlight: { en: "Expert Advice", ar: "نصائح الخبراء" },
    titleRest: { en: "to Help You Grow", ar: "لمساعدتك على النمو" },
    intro: {
        en: "Independent audit, accounting and tax services for businesses across the UAE, from an Emirati firm with more than 25 years of experience.",
        ar: "خدمات تدقيق ومحاسبة وضرائب مستقلة للشركات في جميع أنحاء الإمارات، من شركة إماراتية تتمتع بخبرة تزيد عن 25 عامًا.",
    },
    speakLabel: {
        en: "— Speak Directly with an Expert —",
        ar: "— تحدّث مباشرة مع خبير —",
    },
    primaryCta: {
        label: {
            en: "Book Free 20-Min Call",
            ar: "احجز مكالمة مجانية لمدة 20 دقيقة",
        },
        href: { en: "/contact", ar: "/ar/contact" },
        variant: "primary",
    },
    secondaryCta: {
        label: { en: "Explore Tax Services", ar: "استكشف الخدمات الضريبية" },
        href: { en: "/tax-services", ar: "/ar/tax-services" },
        variant: "secondary",
    },
    ftaCard: {
        line1: { en: "FTA Approved", ar: "وكالة ضريبية" },
        line2: { en: "Tax Agency", ar: "معتمدة من الهيئة الاتحادية للضرائب" },
        licenseNumber: { en: "No. 30008692", ar: "رقم 30008692" },
    },
    partnerCard: {
        title: { en: "Business Setup Partner", ar: "شريك تأسيس الأعمال" },
        subtitle: { en: "for Dubai Free Zones", ar: "للمناطق الحرة في دبي" },
    },
    experienceCard: {
        value: { en: "25+ YEARS", ar: "+25 عامًا" },
        label: { en: "of Experience", ar: "من الخبرة" },
        tagline: { en: "You Can Count On", ar: "يمكنك الاعتماد عليها" },
    },
    reviewRatings: [
        {
            platform: "google",
            score: 4.8,
            label: {
                en: "from 200+ Google Reviews",
                ar: "من أكثر من 200 تقييم على Google",
            },
        },
        {
            platform: "trustpilot",
            score: 4.8,
            label: {
                en: "from 75+ Trustpilot Reviews",
                ar: "من أكثر من 75 تقييمًا على Trustpilot",
            },
        },
    ],
    trustedNote: {
        en: "Trusted by 1,000+ Businesses in the UAE and worldwide to stay compliant and find the best opportunities.",
        ar: "يثق بنا أكثر من 1,000 شركة في الإمارات وحول العالم للحفاظ على الامتثال واغتنام أفضل الفرص.",
    },
};
const emptyMedia = () => ({ en: [], ar: [] });
// Inserts the default banner only when the collection is empty
const ensureDefaultBanner = async () => {
    const exists = await banner_mode_1.Banner.exists({});
    if (exists)
        return;
    await banner_mode_1.Banner.create({
        ...DEFAULT_BANNER,
        bgImages: emptyMedia(),
        bgVideos: emptyMedia(),
        posterImage: emptyMedia(),
    });
};
const zodMessage = (error) => error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
// Multipart bodies send nested objects as JSON strings. Parse them back
// so the Zod schemas receive the structure they expect.
const normalizeBody = (body) => {
    const out = {};
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
            try {
                out[key] = JSON.parse(value);
                continue;
            }
            catch {
                // not valid JSON, keep the raw string and let validation report it
            }
        }
        out[key] = value;
    }
    return out;
};
// POST /api/banners  (multipart/form-data)
const createBanner = async (req, res) => {
    try {
        const parsed = banner_validation_1.createBannerSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res
                .status(400)
                .json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const files = req.files;
        const media = {};
        for (const m of MEDIA) {
            media[m.key] = { en: [], ar: [] };
            for (const lang of LANGS) {
                media[m.key][lang] = await (0, upload_1.uploadMany)(files?.[m.fields[lang]], m.folder, m.type);
            }
        }
        const banner = await banner_mode_1.Banner.create({ ...parsed.data, ...media });
        res.status(201).json({ status: "success", data: banner });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.createBanner = createBanner;
// GET /api/banners
// Creates the default banner first if none exists yet
const getAllBanners = async (_req, res) => {
    try {
        await ensureDefaultBanner();
        const banners = await banner_mode_1.Banner.find().sort({ createdAt: 1 });
        res
            .status(200)
            .json({ status: "success", results: banners.length, data: banners });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.getAllBanners = getAllBanners;
// PATCH /api/banners/:id  (multipart/form-data)
// new files are added to existing media, removePublicIds deletes old ones
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid banner id" });
            return;
        }
        const parsed = banner_validation_1.updateBannerSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res
                .status(400)
                .json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const banner = await banner_mode_1.Banner.findById(id);
        if (!banner) {
            res.status(404).json({ status: "error", message: "Banner not found" });
            return;
        }
        const { removePublicIds, ...textFields } = parsed.data;
        const files = req.files;
        const toDelete = [];
        banner.set(textFields);
        for (const m of MEDIA) {
            for (const lang of LANGS) {
                const current = banner.get(`${m.key}.${lang}`) ?? [];
                const keep = current.filter((x) => !removePublicIds.includes(x.publicId));
                current
                    .filter((x) => removePublicIds.includes(x.publicId))
                    .forEach((x) => toDelete.push({ publicId: x.publicId, type: m.type }));
                const added = await (0, upload_1.uploadMany)(files?.[m.fields[lang]], m.folder, m.type);
                banner.set(`${m.key}.${lang}`, [...keep, ...added].map((x) => ({
                    url: x.url,
                    publicId: x.publicId,
                })));
            }
        }
        await banner.save();
        await Promise.allSettled(toDelete.map((x) => (0, upload_1.deleteFromCloudinary)(x.publicId, x.type)));
        res.status(200).json({ status: "success", data: banner });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateBanner = updateBanner;
// DELETE /api/banners/:id  (also deletes its media from Cloudinary)
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid banner id" });
            return;
        }
        const banner = await banner_mode_1.Banner.findByIdAndDelete(id);
        if (!banner) {
            res.status(404).json({ status: "error", message: "Banner not found" });
            return;
        }
        const jobs = [];
        for (const m of MEDIA) {
            for (const lang of LANGS) {
                const items = banner.get(`${m.key}.${lang}`) ?? [];
                items.forEach((x) => jobs.push((0, upload_1.deleteFromCloudinary)(x.publicId, m.type)));
            }
        }
        await Promise.allSettled(jobs);
        res.status(200).json({ status: "success", message: "Banner deleted" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.deleteBanner = deleteBanner;
