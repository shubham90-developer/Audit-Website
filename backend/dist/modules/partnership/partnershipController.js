"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePartner = exports.updatePartner = exports.createPartner = exports.getPartnershipData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const partnership_model_1 = require("./partnership.model");
const partnership_validation_1 = require("./partnership.validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const FOLDER = "audit-website/partners/logos";
const LOGO_FIELDS = { en: "logoEn", ar: "logoAr" };
// Default partners, inserted only when the collection is empty
const DEFAULT_PARTNERS = [
    {
        title: { en: "FTA Approved Tax Agency", ar: "وكالة ضريبية معتمدة من الهيئة الاتحادية للضرائب" },
        text: { en: "Registered Tax Agency · No. 30008692", ar: "وكالة ضريبية مسجلة · رقم 30008692" },
    },
    {
        title: { en: "RAKEZ Appreciation Certificate", ar: "شهادة تقدير من RAKEZ" },
        text: { en: "Recognised for Excellence in Partner Performance", ar: "معترف بها للتميز في أداء الشركاء" },
    },
    {
        title: { en: "IFZA Gold Tier Partner Recognition", ar: "تقدير شريك IFZA من الفئة الذهبية" },
        text: { en: "Gold Tier Recognition · Elite Loyalty Programme", ar: "تقدير الفئة الذهبية · برنامج الولاء النخبوي" },
    },
    {
        title: { en: "Accounting Software Experience", ar: "خبرة في برامج المحاسبة" },
        text: { en: "Hands-on Experience Across Leading Accounting Platforms", ar: "خبرة عملية في أبرز منصات المحاسبة" },
    },
    {
        title: { en: "ACCA Approved Employer", ar: "جهة توظيف معتمدة من ACCA" },
        text: { en: "Trainee & Professional Development · ID 29477922", ar: "تدريب وتطوير مهني · المعرّف 29477922" },
    },
    {
        title: { en: "ICAEW Approved Employer", ar: "جهة توظيف معتمدة من ICAEW" },
        text: { en: "Supporting Professional Training and Development", ar: "دعم التدريب والتطوير المهني" },
    },
    {
        title: { en: "KIZAD", ar: "KIZAD" },
        text: { en: "Business Setup Partner in Abu Dhabi", ar: "شريك تأسيس الأعمال في أبوظبي" },
    },
    {
        title: { en: "Meydan Free Zone", ar: "المنطقة الحرة في ميدان" },
        text: { en: "Company Formation Partner in Dubai", ar: "شريك تأسيس الشركات في دبي" },
    },
];
const ensureDefaultPartners = async () => {
    const exists = await partnership_model_1.Partner.exists({});
    if (exists)
        return;
    await partnership_model_1.Partner.insertMany(DEFAULT_PARTNERS.map((p, i) => ({
        ...p,
        order: i,
        logo: { en: [], ar: [] },
    })));
};
const zodMessage = (error) => error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
// Multipart sends nested objects as JSON strings. Parse them back.
const normalizeBody = (body) => {
    const out = {};
    for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
            try {
                out[key] = JSON.parse(value);
                continue;
            }
            catch {
                // not JSON, keep the raw value and let validation report it
            }
        }
        out[key] = value;
    }
    return out;
};
const toMedia = (items) => items.map((x) => ({ url: x.url, publicId: x.publicId }));
// GET /v1/api/partners (public)
// Creates the default partners first if the collection is empty
const getPartnershipData = async (_req, res) => {
    try {
        await ensureDefaultPartners();
        const partners = await partnership_model_1.Partner.find().sort({ order: 1, createdAt: 1 });
        res
            .status(200)
            .json({ status: "success", results: partners.length, data: partners });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.getPartnershipData = getPartnershipData;
// POST /v1/api/partners (admin, multipart/form-data)
const createPartner = async (req, res) => {
    try {
        const parsed = partnership_validation_1.createPartnerSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const files = req.files;
        const logo = {
            en: await (0, upload_1.uploadMany)(files?.[LOGO_FIELDS.en], FOLDER, "image"),
            ar: await (0, upload_1.uploadMany)(files?.[LOGO_FIELDS.ar], FOLDER, "image"),
        };
        const partner = await partnership_model_1.Partner.create({
            ...parsed.data,
            logo: { en: toMedia(logo.en), ar: toMedia(logo.ar) },
        });
        res.status(201).json({ status: "success", data: partner });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.createPartner = createPartner;
// PATCH /v1/api/partners/:id (admin, multipart/form-data)
// New logos are added. removePublicIds deletes existing logos.
const updatePartner = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid partner id" });
            return;
        }
        const parsed = partnership_validation_1.updatePartnerSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const partner = await partnership_model_1.Partner.findById(id);
        if (!partner) {
            res.status(404).json({ status: "error", message: "Partner not found" });
            return;
        }
        const { removePublicIds, ...fields } = parsed.data;
        const files = req.files;
        const toDelete = [];
        partner.set(fields);
        for (const lang of LANGS) {
            const current = partner.get(`logo.${lang}`) ?? [];
            toDelete.push(...current
                .filter((x) => removePublicIds.includes(x.publicId))
                .map((x) => x.publicId));
            const keep = current.filter((x) => !removePublicIds.includes(x.publicId));
            const added = await (0, upload_1.uploadMany)(files?.[LOGO_FIELDS[lang]], FOLDER, "image");
            partner.set(`logo.${lang}`, toMedia([...keep, ...added]));
        }
        await partner.save();
        await Promise.allSettled(toDelete.map((publicId) => (0, upload_1.deleteFromCloudinary)(publicId, "image")));
        res.status(200).json({ status: "success", data: partner });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updatePartner = updatePartner;
// DELETE /v1/api/partners/:id (admin, also deletes logos from Cloudinary)
const deletePartner = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid partner id" });
            return;
        }
        const partner = await partnership_model_1.Partner.findByIdAndDelete(id);
        if (!partner) {
            res.status(404).json({ status: "error", message: "Partner not found" });
            return;
        }
        const jobs = [...partner.logo.en, ...partner.logo.ar].map((x) => (0, upload_1.deleteFromCloudinary)(x.publicId, "image"));
        await Promise.allSettled(jobs);
        res.status(200).json({ status: "success", message: "Partner deleted" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.deletePartner = deletePartner;
