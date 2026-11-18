"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.updateSection = exports.getWhatWeDo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const whatWeDo_model_1 = require("./whatWeDo.model");
const whatWeDo_validation_1 = require("./whatWeDo.validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const FOLDER = "audit-website/what-we-do/images";
const IMAGE_FIELDS = { en: "imageEn", ar: "imageAr" };
// ---- Default content, inserted only when the collection is empty ----
// Service names and descriptions are placeholders. Replace them in the admin.
const DEFAULT_SECTION = {
    title: { en: "What We", ar: "ما" },
    colorTitle: { en: "Do", ar: "نقدّمه" },
    subtitle: {
        en: "Comprehensive financial and tax solutions tailored for your business growth.",
        ar: "حلول مالية وضريبية شاملة مصممة لدعم نمو أعمالك.",
    },
    watermark: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
};
const DEFAULT_SERVICES = [
    {
        icon: "shield",
        name: { en: "Audit & Assurance", ar: "التدقيق والتأكيد" },
        desc: { en: "Placeholder description.", ar: "وصف مؤقت." },
        items: [
            { en: "Statutory audit", ar: "التدقيق القانوني" },
            { en: "Internal audit", ar: "التدقيق الداخلي" },
        ],
    },
    {
        icon: "percent",
        name: { en: "VAT Services", ar: "خدمات ضريبة القيمة المضافة" },
        desc: { en: "Placeholder description.", ar: "وصف مؤقت." },
        items: [
            { en: "VAT registration", ar: "التسجيل في ضريبة القيمة المضافة" },
            { en: "VAT return filing", ar: "تقديم الإقرارات الضريبية" },
        ],
    },
    {
        icon: "briefcase",
        name: { en: "Business Setup", ar: "تأسيس الأعمال" },
        desc: { en: "Placeholder description.", ar: "وصف مؤقت." },
        items: [
            { en: "Company formation", ar: "تأسيس الشركات" },
            { en: "Free zone licensing", ar: "ترخيص المناطق الحرة" },
        ],
    },
    {
        icon: "trending",
        name: { en: "Accounting & Bookkeeping", ar: "المحاسبة ومسك الدفاتر" },
        desc: { en: "Placeholder description.", ar: "وصف مؤقت." },
        items: [
            { en: "Monthly bookkeeping", ar: "مسك الدفاتر شهريًا" },
            { en: "Financial statements", ar: "القوائم المالية" },
        ],
    },
    {
        icon: "book",
        name: { en: "Corporate Tax", ar: "ضريبة الشركات" },
        desc: { en: "Placeholder description.", ar: "وصف مؤقت." },
        items: [
            { en: "Corporate tax registration", ar: "التسجيل في ضريبة الشركات" },
            { en: "Corporate tax filing", ar: "تقديم إقرار ضريبة الشركات" },
        ],
    },
];
const ensureDefaults = async () => {
    if (!(await whatWeDo_model_1.WhatWeDoSection.exists({}))) {
        await whatWeDo_model_1.WhatWeDoSection.create(DEFAULT_SECTION);
    }
    if (!(await whatWeDo_model_1.WhatWeDoService.exists({}))) {
        await whatWeDo_model_1.WhatWeDoService.insertMany(DEFAULT_SERVICES.map((s, i) => ({
            ...s,
            order: i,
            image: { en: [], ar: [] },
        })));
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
// GET /v1/api/what-we-do (public)
// Returns the section and the services sorted by order
const getWhatWeDo = async (_req, res) => {
    try {
        await ensureDefaults();
        const [section, services] = await Promise.all([
            whatWeDo_model_1.WhatWeDoSection.findOne(),
            whatWeDo_model_1.WhatWeDoService.find().sort({ order: 1, createdAt: 1 }),
        ]);
        res.status(200).json({
            status: "success",
            data: { section, services },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.getWhatWeDo = getWhatWeDo;
// PATCH /v1/api/what-we-do/section (admin, JSON or multipart)
const updateSection = async (req, res) => {
    try {
        const parsed = whatWeDo_validation_1.updateSectionSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        await ensureDefaults();
        const section = await whatWeDo_model_1.WhatWeDoSection.findOne();
        if (!section) {
            res.status(404).json({ status: "error", message: "Section not found" });
            return;
        }
        section.set(parsed.data);
        await section.save();
        res.status(200).json({ status: "success", data: section });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateSection = updateSection;
// POST /v1/api/what-we-do/services (admin, multipart/form-data)
const createService = async (req, res) => {
    try {
        const parsed = whatWeDo_validation_1.createServiceSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const files = req.files;
        const image = {
            en: await (0, upload_1.uploadMany)(files?.[IMAGE_FIELDS.en], FOLDER, "image"),
            ar: await (0, upload_1.uploadMany)(files?.[IMAGE_FIELDS.ar], FOLDER, "image"),
        };
        const service = await whatWeDo_model_1.WhatWeDoService.create({
            ...parsed.data,
            image: { en: toMedia(image.en), ar: toMedia(image.ar) },
        });
        res.status(201).json({ status: "success", data: service });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.createService = createService;
// PATCH /v1/api/what-we-do/services/:id (admin, multipart/form-data)
// New images are added. removePublicIds deletes existing images.
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid service id" });
            return;
        }
        const parsed = whatWeDo_validation_1.updateServiceSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const service = await whatWeDo_model_1.WhatWeDoService.findById(id);
        if (!service) {
            res.status(404).json({ status: "error", message: "Service not found" });
            return;
        }
        const { removePublicIds, ...fields } = parsed.data;
        const files = req.files;
        const toDelete = [];
        service.set(fields);
        for (const lang of LANGS) {
            const current = service.get(`image.${lang}`) ?? [];
            toDelete.push(...current
                .filter((x) => removePublicIds.includes(x.publicId))
                .map((x) => x.publicId));
            const keep = current.filter((x) => !removePublicIds.includes(x.publicId));
            const added = await (0, upload_1.uploadMany)(files?.[IMAGE_FIELDS[lang]], FOLDER, "image");
            service.set(`image.${lang}`, toMedia([...keep, ...added]));
        }
        await service.save();
        await Promise.allSettled(toDelete.map((publicId) => (0, upload_1.deleteFromCloudinary)(publicId, "image")));
        res.status(200).json({ status: "success", data: service });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateService = updateService;
// DELETE /v1/api/what-we-do/services/:id (admin, also deletes images from Cloudinary)
const deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid service id" });
            return;
        }
        const service = await whatWeDo_model_1.WhatWeDoService.findByIdAndDelete(id);
        if (!service) {
            res.status(404).json({ status: "error", message: "Service not found" });
            return;
        }
        const jobs = [...service.image.en, ...service.image.ar].map((x) => (0, upload_1.deleteFromCloudinary)(x.publicId, "image"));
        await Promise.allSettled(jobs);
        res.status(200).json({ status: "success", message: "Service deleted" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.deleteService = deleteService;
