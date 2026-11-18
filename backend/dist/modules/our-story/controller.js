"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStep = exports.updateStep = exports.createStep = exports.updateSection = exports.getOurStory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const model_1 = require("./model");
const validation_1 = require("./validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const SECTION_FOLDER = "audit-website/our-story/section";
const STEP_FOLDER = "audit-website/our-story/steps";
// Upload field names, one per language
const BG_FIELDS = { en: "bgImageEn", ar: "bgImageAr" };
const AUTHOR_FIELDS = {
    en: "authorImageEn",
    ar: "authorImageAr",
};
const STEP_FIELDS = { en: "imageEn", ar: "imageAr" };
// ---- Default content, inserted only when the collections are empty ----
// Images with an empty publicId live in the frontend /public folder.
const DEFAULT_SECTION = {
    badge: { en: "OUR STORY", ar: "قصتنا ومسيرتنا" },
    narrative: {
        en: "The firm was founded in 2000 by Mr. Ahmed Al Mazroei with one goal: to give UAE businesses honest, high-quality audit services from a local firm they can trust. What started as an audit practice has grown into a full-service firm covering audit, tax, advisory and consulting. After more than 25 years, our values remain the same: integrity, quality and personal service.",
        ar: "تأسس المكتب في عام 2000 على يد السيد أحمد المزروعي بهدف واضح: تزويد مجتمع الأعمال في الإمارات بخدمات تدقيق ومحاسبة عالية الجودة تتسم بالأمانة والاحترافية من شركة محلية تحظى بثقتهم الكاملة. واليوم، وبعد أكثر من 25 عاماً من الريادة، لا تزال قيمنا الأساسية ثابتة: النزاهة التامة، والجودة الفائقة، والاهتمام الشخصي المباشر بكل عميل.",
    },
    bgImage: {
        en: [{ url: "/img/banner/bg9.avif", publicId: "" }],
        ar: [{ url: "/img/banner/bg9.avif", publicId: "" }],
    },
    quote: {
        en: "Our growth has never been about adding services for the sake of looking bigger. We add expertise when it solves a real problem for our clients.",
        ar: "لم يكن نمونا يوماً مجرد إضافة خدمات لزيادة الحجم، بل نضيف الخبرات التخصصية دائماً عندما تقدم حلاً حقيقياً وملموساً لتحديات عملائنا.",
    },
    authorName: {
        en: "Mr. Ahmed Al Mazroei, UAE-CA.",
        ar: "السيد أحمد المزروعي، محاسب قانوني إماراتي",
    },
    authorRole: {
        en: "Director of Accounting and Taxation",
        ar: "مدير المحاسبة والضرائب",
    },
    authorImage: {
        en: [{ url: "/img/banner/1.jpg", publicId: "" }],
        ar: [{ url: "/img/banner/1.jpg", publicId: "" }],
    },
};
const DEFAULT_STEPS = [
    {
        title: { en: "It Started With the Numbers", ar: "البداية كانت مع الأرقام" },
        text: {
            en: "Ahmed Al Mazroei began as an accounting and tax firm, helping businesses manage bookkeeping, financial reporting, tax filings and regulatory compliance.",
            ar: "بدأ المكتب بتقديم خدمات المحاسبة ومسك الدفاتر والتقارير المالية والامتثال الضريبي للشركات والمؤسسات المحلية.",
        },
        image: {
            en: [{ url: "/img/banner/1.jpg", publicId: "" }],
            ar: [{ url: "/img/banner/1.jpg", publicId: "" }],
        },
    },
    {
        title: {
            en: "Then the Questions Got Bigger",
            ar: "ثم توسعت طموحات عملائنا",
        },
        text: {
            en: "As our clients' businesses grew, their questions expanded beyond the numbers to company formation, business structuring, new regulations and entering new markets.",
            ar: "مع نمو أعمال عملائنا، امتدت استفساراتهم لتشمل هيكلة الشركات، التأسيس في المناطق الحرة، واستيفاء اللوائح المنظمة الجديدة.",
        },
        image: {
            en: [{ url: "/img/banner/2.jpg", publicId: "" }],
            ar: [{ url: "/img/banner/2.jpg", publicId: "" }],
        },
    },
    {
        title: {
            en: "Clients Needed More Than Accounting",
            ar: "الحاجة إلى حلول متكاملة",
        },
        text: {
            en: "Operating across different jurisdictions required support in accounting, tax, audit, corporate advisory and business setup through one integrated provider.",
            ar: "تطلب التوسع في أسواق متعددة الحصول على خدمات التدقيق والضرائب والاستشارات وتأسيس الشركات من شريك واحد متكامل وموثوق.",
        },
        image: {
            en: [{ url: "/img/banner/3.jpg", publicId: "" }],
            ar: [{ url: "/img/banner/3.jpg", publicId: "" }],
        },
    },
    {
        title: {
            en: "So We Built One Integrated Team",
            ar: "بناء فريق عمل متكامل عالمي",
        },
        text: {
            en: "To meet these growing needs, we expanded our team, our expertise and our presence across different countries, offering seamless cross-border financial advisory.",
            ar: "لمواكبة هذا التوسع، قمنا بتعزيز فريقنا بخبرات دولية رفيعة المستوى وحضور إقليمي وعالمي يقدم استشارات مالية عابرة للحدود.",
        },
        image: {
            en: [{ url: "/img/banner/4.jpg", publicId: "" }],
            ar: [{ url: "/img/banner/4.jpg", publicId: "" }],
        },
    },
];
const ensureDefaults = async () => {
    if (!(await model_1.OurStorySection.exists({}))) {
        await model_1.OurStorySection.create(DEFAULT_SECTION);
    }
    if (!(await model_1.OurStoryStep.exists({}))) {
        await model_1.OurStoryStep.insertMany(DEFAULT_STEPS.map((s, i) => ({ ...s, order: i })));
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
const toMedia = (items) => items.map((x) => ({ url: x.url, publicId: x.publicId ?? "" }));
// Default images have an empty publicId, so they are skipped
const mediaIds = (list) => (list ?? []).map((x) => x.publicId ?? "").filter((id) => id !== "");
const deleteAll = (ids) => Promise.allSettled(ids.map((id) => (0, upload_1.deleteFromCloudinary)(id, "image")));
// GET /v1/api/our-story (public)
// Returns the section and the steps sorted by order
const getOurStory = async (_req, res) => {
    try {
        await ensureDefaults();
        const [section, steps] = await Promise.all([
            model_1.OurStorySection.findOne(),
            model_1.OurStoryStep.find().sort({ order: 1, createdAt: 1 }),
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
exports.getOurStory = getOurStory;
// PATCH /v1/api/our-story/section (admin, multipart/form-data)
// A new image replaces the old one for that language
const updateSection = async (req, res) => {
    try {
        const parsed = validation_1.updateSectionSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res
                .status(400)
                .json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        await ensureDefaults();
        const section = await model_1.OurStorySection.findOne();
        if (!section) {
            res.status(404).json({ status: "error", message: "Section not found" });
            return;
        }
        section.set(parsed.data);
        const files = req.files;
        const toDelete = [];
        const slots = [
            { field: "bgImage", names: BG_FIELDS },
            { field: "authorImage", names: AUTHOR_FIELDS },
        ];
        for (const slot of slots) {
            for (const lang of LANGS) {
                const incoming = files?.[slot.names[lang]];
                if (!incoming?.length)
                    continue;
                const path = `${slot.field}.${lang}`;
                toDelete.push(...mediaIds(section.get(path)));
                const added = await (0, upload_1.uploadMany)(incoming, SECTION_FOLDER, "image");
                section.set(path, toMedia(added));
            }
        }
        await section.save();
        await deleteAll(toDelete);
        res.status(200).json({ status: "success", data: section });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateSection = updateSection;
// ---- Steps ----
// POST /v1/api/our-story/steps (admin, multipart/form-data)
const createStep = async (req, res) => {
    try {
        const parsed = validation_1.createStepSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res
                .status(400)
                .json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const files = req.files;
        const image = {
            en: await (0, upload_1.uploadMany)(files?.[STEP_FIELDS.en], STEP_FOLDER, "image"),
            ar: await (0, upload_1.uploadMany)(files?.[STEP_FIELDS.ar], STEP_FOLDER, "image"),
        };
        const step = await model_1.OurStoryStep.create({
            ...parsed.data,
            image: { en: toMedia(image.en), ar: toMedia(image.ar) },
        });
        res.status(201).json({ status: "success", data: step });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.createStep = createStep;
// PATCH /v1/api/our-story/steps/:id (admin, multipart/form-data)
// A new image replaces the old one for that language
const updateStep = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid step id" });
            return;
        }
        const parsed = validation_1.updateStepSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res
                .status(400)
                .json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const step = await model_1.OurStoryStep.findById(id);
        if (!step) {
            res.status(404).json({ status: "error", message: "Step not found" });
            return;
        }
        step.set(parsed.data);
        const files = req.files;
        const toDelete = [];
        for (const lang of LANGS) {
            const incoming = files?.[STEP_FIELDS[lang]];
            if (!incoming?.length)
                continue;
            const path = `image.${lang}`;
            toDelete.push(...mediaIds(step.get(path)));
            const added = await (0, upload_1.uploadMany)(incoming, STEP_FOLDER, "image");
            step.set(path, toMedia(added));
        }
        await step.save();
        await deleteAll(toDelete);
        res.status(200).json({ status: "success", data: step });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateStep = updateStep;
// DELETE /v1/api/our-story/steps/:id (admin, also deletes its images from Cloudinary)
const deleteStep = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid step id" });
            return;
        }
        const step = await model_1.OurStoryStep.findByIdAndDelete(id);
        if (!step) {
            res.status(404).json({ status: "error", message: "Step not found" });
            return;
        }
        await deleteAll([...mediaIds(step.image.en), ...mediaIds(step.image.ar)]);
        res.status(200).json({ status: "success", message: "Step deleted" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.deleteStep = deleteStep;
