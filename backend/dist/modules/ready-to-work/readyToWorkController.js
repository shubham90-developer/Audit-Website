"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFeature = exports.updateFeature = exports.createFeature = exports.updateSection = exports.getReadyToWork = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const readyToWork_model_1 = require("./readyToWork.model");
const readyToWork_validation_1 = require("./readyToWork.validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const FOLDER = "audit-website/ready-to-work/background";
const BG_FIELDS = { en: "bgImageEn", ar: "bgImageAr" };
// ---- Default content, inserted only when the collections are empty ----
// The Arabic text is a translation. Have a native speaker check it.
// buttonHref is a placeholder. Set the real link in the admin.
const DEFAULT_SECTION = {
    title: { en: "Ready to Work", ar: "جاهز للعمل مع" },
    highlight: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
    description: {
        en: "Tell us about your business, your accounting needs, and where you need support. Our team will help you identify the right services for your business.",
        ar: "أخبرنا عن عملك واحتياجاتك المحاسبية والمجالات التي تحتاج فيها إلى الدعم. سيساعدك فريقنا على تحديد الخدمات المناسبة لعملك.",
    },
    buttonLabel: { en: "Book a Consultation", ar: "احجز استشارة" },
    buttonHref: "/contact",
    tagOne: { en: "Private Consultation", ar: "استشارة خاصة" },
    tagTwo: { en: "Tailored Advice", ar: "نصائح مخصصة" },
};
const DEFAULT_FEATURES = [
    {
        icon: "users",
        label: { en: "Trusted by Businesses", ar: "موثوق من الشركات" },
    },
    {
        icon: "shield",
        label: { en: "Expert Guidance", ar: "إرشاد الخبراء" },
    },
    {
        icon: "chart",
        label: { en: "Tailored Solutions", ar: "حلول مخصصة" },
    },
    {
        icon: "clock",
        label: { en: "Responsive Support", ar: "دعم سريع الاستجابة" },
    },
];
const ensureDefaults = async () => {
    if (!(await readyToWork_model_1.ReadyToWorkSection.exists({}))) {
        await readyToWork_model_1.ReadyToWorkSection.create({
            ...DEFAULT_SECTION,
            bgImage: { en: [], ar: [] },
        });
    }
    if (!(await readyToWork_model_1.ReadyToWorkFeature.exists({}))) {
        await readyToWork_model_1.ReadyToWorkFeature.insertMany(DEFAULT_FEATURES.map((f, i) => ({ ...f, order: i })));
    }
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
// GET /v1/api/ready-to-work (public)
// Returns the section and the feature cards sorted by order
const getReadyToWork = async (_req, res) => {
    try {
        await ensureDefaults();
        const [section, features] = await Promise.all([
            readyToWork_model_1.ReadyToWorkSection.findOne(),
            readyToWork_model_1.ReadyToWorkFeature.find().sort({ order: 1, createdAt: 1 }),
        ]);
        res.status(200).json({
            status: "success",
            data: { section, features },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.getReadyToWork = getReadyToWork;
// PATCH /v1/api/ready-to-work/section (admin, multipart/form-data)
// Uploading a background replaces the old one for that language
const updateSection = async (req, res) => {
    try {
        const parsed = readyToWork_validation_1.updateSectionSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        await ensureDefaults();
        const section = await readyToWork_model_1.ReadyToWorkSection.findOne();
        if (!section) {
            res.status(404).json({ status: "error", message: "Section not found" });
            return;
        }
        section.set(parsed.data);
        const files = req.files;
        const toDelete = [];
        for (const lang of LANGS) {
            const incoming = files?.[BG_FIELDS[lang]];
            if (!incoming?.length)
                continue;
            const current = section.get(`bgImage.${lang}`) ?? [];
            toDelete.push(...current.map((x) => x.publicId));
            const added = await (0, upload_1.uploadMany)(incoming, FOLDER, "image");
            section.set(`bgImage.${lang}`, toMedia(added));
        }
        await section.save();
        await Promise.allSettled(toDelete.map((publicId) => (0, upload_1.deleteFromCloudinary)(publicId, "image")));
        res.status(200).json({ status: "success", data: section });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateSection = updateSection;
// ---- Features ----
// POST /v1/api/ready-to-work/features (admin)
const createFeature = async (req, res) => {
    try {
        const parsed = readyToWork_validation_1.createFeatureSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const feature = await readyToWork_model_1.ReadyToWorkFeature.create(parsed.data);
        res.status(201).json({ status: "success", data: feature });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.createFeature = createFeature;
// PATCH /v1/api/ready-to-work/features/:id (admin)
const updateFeature = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid feature id" });
            return;
        }
        const parsed = readyToWork_validation_1.updateFeatureSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const feature = await readyToWork_model_1.ReadyToWorkFeature.findByIdAndUpdate(id, parsed.data, {
            new: true,
            runValidators: true,
        });
        if (!feature) {
            res.status(404).json({ status: "error", message: "Feature not found" });
            return;
        }
        res.status(200).json({ status: "success", data: feature });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateFeature = updateFeature;
// DELETE /v1/api/ready-to-work/features/:id (admin)
const deleteFeature = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid feature id" });
            return;
        }
        const feature = await readyToWork_model_1.ReadyToWorkFeature.findByIdAndDelete(id);
        if (!feature) {
            res.status(404).json({ status: "error", message: "Feature not found" });
            return;
        }
        res.status(200).json({ status: "success", message: "Feature deleted" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.deleteFeature = deleteFeature;
