"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStep = exports.updateStep = exports.createStep = exports.updateSection = exports.getHowWeWork = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const howWeWork_model_1 = require("./howWeWork.model");
const howWeWork_validation_1 = require("./howWeWork.validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const FOLDER = "audit-website/how-we-work/image";
const IMAGE_FIELDS = { en: "imageEn", ar: "imageAr" };
// ---- Default content, inserted only when the collections are empty ----
// The Arabic text is a translation. Have a native speaker check it.
const DEFAULT_SECTION = {
    title: { en: "How We", ar: "كيف" },
    colorTitle: { en: "Work", ar: "نعمل" },
    subtitle: {
        en: "Simple, Clear and On Time",
        ar: "بسيط وواضح وفي الوقت المحدد",
    },
    watermark: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
};
const DEFAULT_STEPS = [
    {
        icon: "headset",
        title: { en: "Talk to Us", ar: "تحدّث إلينا" },
        desc: {
            en: "A free first meeting to understand your needs.",
            ar: "اجتماع أول مجاني لفهم احتياجاتك.",
        },
    },
    {
        icon: "document",
        title: { en: "Clear Proposal", ar: "عرض واضح" },
        desc: {
            en: "Scope, timeline and fixed fee agreed in writing.",
            ar: "يُتفق كتابةً على النطاق والجدول الزمني والأتعاب الثابتة.",
        },
    },
    {
        icon: "settings",
        title: { en: "We Do the Work", ar: "ننفّذ العمل" },
        desc: {
            en: "Our team works with yours, on-site or online.",
            ar: "يعمل فريقنا مع فريقك، في موقعك أو عبر الإنترنت.",
        },
    },
    {
        icon: "shield",
        title: { en: "Results & Support", ar: "النتائج والدعم" },
        desc: {
            en: "Clear report, practical advice and ongoing help.",
            ar: "تقرير واضح ونصائح عملية ودعم مستمر.",
        },
    },
];
const ensureDefaults = async () => {
    if (!(await howWeWork_model_1.HowWeWorkSection.exists({}))) {
        await howWeWork_model_1.HowWeWorkSection.create({
            ...DEFAULT_SECTION,
            image: { en: [], ar: [] },
        });
    }
    if (!(await howWeWork_model_1.HowWeWorkStep.exists({}))) {
        await howWeWork_model_1.HowWeWorkStep.insertMany(DEFAULT_STEPS.map((s, i) => ({ ...s, order: i })));
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
// GET /v1/api/how-we-work (public)
// Returns the section and the steps sorted by order
const getHowWeWork = async (_req, res) => {
    try {
        await ensureDefaults();
        const [section, steps] = await Promise.all([
            howWeWork_model_1.HowWeWorkSection.findOne(),
            howWeWork_model_1.HowWeWorkStep.find().sort({ order: 1, createdAt: 1 }),
        ]);
        res.status(200).json({
            status: "success",
            data: { section, steps },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.getHowWeWork = getHowWeWork;
// PATCH /v1/api/how-we-work/section (admin, multipart/form-data)
// Uploading a photo replaces the old one for that language
const updateSection = async (req, res) => {
    try {
        const parsed = howWeWork_validation_1.updateSectionSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        await ensureDefaults();
        const section = await howWeWork_model_1.HowWeWorkSection.findOne();
        if (!section) {
            res.status(404).json({ status: "error", message: "Section not found" });
            return;
        }
        section.set(parsed.data);
        const files = req.files;
        const toDelete = [];
        for (const lang of LANGS) {
            const incoming = files?.[IMAGE_FIELDS[lang]];
            if (!incoming?.length)
                continue;
            const current = section.get(`image.${lang}`) ?? [];
            toDelete.push(...current.map((x) => x.publicId));
            const added = await (0, upload_1.uploadMany)(incoming, FOLDER, "image");
            section.set(`image.${lang}`, toMedia(added));
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
// ---- Steps ----
// POST /v1/api/how-we-work/steps (admin)
const createStep = async (req, res) => {
    try {
        const parsed = howWeWork_validation_1.createStepSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const step = await howWeWork_model_1.HowWeWorkStep.create(parsed.data);
        res.status(201).json({ status: "success", data: step });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.createStep = createStep;
// PATCH /v1/api/how-we-work/steps/:id (admin)
const updateStep = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid step id" });
            return;
        }
        const parsed = howWeWork_validation_1.updateStepSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const step = await howWeWork_model_1.HowWeWorkStep.findByIdAndUpdate(id, parsed.data, {
            new: true,
            runValidators: true,
        });
        if (!step) {
            res.status(404).json({ status: "error", message: "Step not found" });
            return;
        }
        res.status(200).json({ status: "success", data: step });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateStep = updateStep;
// DELETE /v1/api/how-we-work/steps/:id (admin)
const deleteStep = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid step id" });
            return;
        }
        const step = await howWeWork_model_1.HowWeWorkStep.findByIdAndDelete(id);
        if (!step) {
            res.status(404).json({ status: "error", message: "Step not found" });
            return;
        }
        res.status(200).json({ status: "success", message: "Step deleted" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.deleteStep = deleteStep;
