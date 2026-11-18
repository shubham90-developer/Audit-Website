"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCard = exports.updateCard = exports.createCard = exports.updateSection = exports.getWhoWeServe = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const whoWeServe_model_1 = require("./whoWeServe.model");
const whoWeServe_validation_1 = require("./whoWeServe.validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const SECTION_FOLDER = "audit-website/who-we-serve/section";
const CARD_FOLDER = "audit-website/who-we-serve/cards";
const SECTION_BG_FIELDS = { en: "leftBgEn", ar: "leftBgAr" };
const CARD_IMAGE_FIELDS = { en: "imageEn", ar: "imageAr" };
// ---- Default content, inserted only when the collections are empty ----
// The Arabic text is a translation. Have a native speaker check it.
const DEFAULT_SECTION = {
    pillTitle: { en: "Who We", ar: "من" },
    pillHighlight: { en: "Serve", ar: "نخدم" },
    whyTitle: { en: "Why Businesses Choose", ar: "لماذا تختار الشركات" },
    brandName: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
    whyIntroStart: { en: "We are one of the", ar: "نحن إحدى" },
    whyIntroBold: {
        en: "chartered accountant firms in Dubai",
        ar: "مكاتب المحاسبة القانونية المعتمدة في دبي",
    },
    whyIntroEnd: {
        en: "that also holds FTA tax agency approval. The books, the tax filings and the audit file come from one team. Nothing is translated, re-entered, or lost between providers.",
        ar: "والتي تحمل أيضًا اعتماد وكالة ضريبية من الهيئة الاتحادية للضرائب. تأتي الدفاتر والإقرارات الضريبية وملف التدقيق من فريق واحد، ولا يُترجم شيء أو يُعاد إدخاله أو يُفقد بين المزودين.",
    },
};
const DEFAULT_CARDS = [
    {
        kind: "serve",
        title: { en: "Multinational Groups", ar: "المجموعات متعددة الجنسيات" },
        text: {
            en: "Transfer pricing documentation, consolidated group reporting and treaty positions. IFRS output your auditors accept without rework.",
            ar: "توثيق أسعار التحويل، والتقارير المجمّعة للمجموعة، ومواقف الاتفاقيات الضريبية. مخرجات IFRS يقبلها مدققو حساباتك دون إعادة عمل.",
        },
    },
    {
        kind: "serve",
        title: { en: "Business Setup & New Entrants", ar: "تأسيس الأعمال والوافدون الجدد" },
        text: {
            en: "Mainland or free zone, chosen on the tax outcome and not the licence price. Formation, visas, banking and your first filings.",
            ar: "البر الرئيسي أو المنطقة الحرة، يُختار وفق النتيجة الضريبية لا وفق سعر الرخصة. التأسيس والتأشيرات والخدمات البنكية وأولى الإقرارات.",
        },
    },
    {
        kind: "serve",
        title: { en: "Free Zone & QFZP", ar: "المنطقة الحرة وQFZP" },
        text: {
            en: "Whether you qualify for the 0% free zone rate, and what it takes to keep it. Income tested, substance documented and de minimis monitored.",
            ar: "ما إذا كنت مؤهلًا لمعدل 0% في المناطق الحرة، وما يلزم للحفاظ عليه. اختبار الدخل، وتوثيق الوجود الفعلي، ومراقبة الحد الأدنى غير الجوهري.",
        },
    },
    {
        kind: "serve",
        title: { en: "Individuals & Expats", ar: "الأفراد والمقيمون الأجانب" },
        text: {
            en: "Tax residency, TRC applications, wills registration and personal exposure across more than one jurisdiction. Filed with your company.",
            ar: "الإقامة الضريبية، وطلبات شهادة الإقامة الضريبية TRC، وتسجيل الوصايا، والتعرض الضريبي الشخصي عبر أكثر من دولة. يُقدَّم مع ملف شركتك.",
        },
    },
    {
        kind: "why",
        title: { en: "FTA Registered Tax Agency", ar: "وكالة ضريبية مسجلة لدى الهيئة الاتحادية للضرائب" },
        text: {
            en: "FTA Approved Tax Agency No. 30008692. If the authority raises a query or opens a tax audit, we represent you before them. You do not face the FTA alone.",
            ar: "وكالة ضريبية معتمدة من الهيئة الاتحادية للضرائب رقم 30008692. إذا طرحت الجهة استفسارًا أو فتحت تدقيقًا ضريبيًا، نمثلك أمامها. لن تواجه الهيئة وحدك.",
        },
    },
    {
        kind: "why",
        title: { en: "Approved Auditors", ar: "مدققون معتمدون" },
        text: {
            en: "Audit reports issued through our network of approved auditors, accepted by every UAE free zone authority, mainland licensing body and bank. We prepare the file, so the numbers already agree.",
            ar: "تُصدر تقارير التدقيق عبر شبكتنا من المدققين المعتمدين، والمقبولة لدى كل هيئات المناطق الحرة في الإمارات وجهات الترخيص في البر الرئيسي والبنوك. نُعد الملف بحيث تتطابق الأرقام منذ البداية.",
        },
    },
];
const ensureDefaults = async () => {
    if (!(await whoWeServe_model_1.WhoWeServeSection.exists({}))) {
        await whoWeServe_model_1.WhoWeServeSection.create({
            ...DEFAULT_SECTION,
            leftBg: { en: [], ar: [] },
        });
    }
    if (!(await whoWeServe_model_1.WhoWeServeCard.exists({}))) {
        await whoWeServe_model_1.WhoWeServeCard.insertMany(DEFAULT_CARDS.map((c, i) => ({
            ...c,
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
// GET /v1/api/who-we-serve (public)
// Returns the section, the serve cards, and the why cards, each sorted by order
const getWhoWeServe = async (_req, res) => {
    try {
        await ensureDefaults();
        const [section, cards] = await Promise.all([
            whoWeServe_model_1.WhoWeServeSection.findOne(),
            whoWeServe_model_1.WhoWeServeCard.find().sort({ order: 1, createdAt: 1 }),
        ]);
        res.status(200).json({
            status: "success",
            data: {
                section,
                serve: cards.filter((c) => c.kind === "serve"),
                why: cards.filter((c) => c.kind === "why"),
            },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.getWhoWeServe = getWhoWeServe;
// PATCH /v1/api/who-we-serve/section (admin, JSON or multipart)
// Uploading a new background replaces the old one for that language
const updateSection = async (req, res) => {
    try {
        const parsed = whoWeServe_validation_1.updateSectionSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        await ensureDefaults();
        const section = await whoWeServe_model_1.WhoWeServeSection.findOne();
        if (!section) {
            res.status(404).json({ status: "error", message: "Section not found" });
            return;
        }
        section.set(parsed.data);
        const files = req.files;
        const toDelete = [];
        for (const lang of LANGS) {
            const incoming = files?.[SECTION_BG_FIELDS[lang]];
            if (!incoming?.length)
                continue;
            toDelete.push(...section.leftBg[lang].map((x) => x.publicId));
            const added = await (0, upload_1.uploadMany)(incoming, SECTION_FOLDER, "image");
            section.set(`leftBg.${lang}`, toMedia(added));
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
// POST /v1/api/who-we-serve/cards (admin, multipart/form-data)
const createCard = async (req, res) => {
    try {
        const parsed = whoWeServe_validation_1.createCardSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const files = req.files;
        const image = {
            en: await (0, upload_1.uploadMany)(files?.[CARD_IMAGE_FIELDS.en], CARD_FOLDER, "image"),
            ar: await (0, upload_1.uploadMany)(files?.[CARD_IMAGE_FIELDS.ar], CARD_FOLDER, "image"),
        };
        const card = await whoWeServe_model_1.WhoWeServeCard.create({
            ...parsed.data,
            image: { en: toMedia(image.en), ar: toMedia(image.ar) },
        });
        res.status(201).json({ status: "success", data: card });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.createCard = createCard;
// PATCH /v1/api/who-we-serve/cards/:id (admin, multipart/form-data)
// New images are added. removePublicIds deletes existing images.
const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid card id" });
            return;
        }
        const parsed = whoWeServe_validation_1.updateCardSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const card = await whoWeServe_model_1.WhoWeServeCard.findById(id);
        if (!card) {
            res.status(404).json({ status: "error", message: "Card not found" });
            return;
        }
        const { removePublicIds, ...fields } = parsed.data;
        const files = req.files;
        const toDelete = [];
        card.set(fields);
        for (const lang of LANGS) {
            const current = card.get(`image.${lang}`) ?? [];
            toDelete.push(...current
                .filter((x) => removePublicIds.includes(x.publicId))
                .map((x) => x.publicId));
            const keep = current.filter((x) => !removePublicIds.includes(x.publicId));
            const added = await (0, upload_1.uploadMany)(files?.[CARD_IMAGE_FIELDS[lang]], CARD_FOLDER, "image");
            card.set(`image.${lang}`, toMedia([...keep, ...added]));
        }
        await card.save();
        await Promise.allSettled(toDelete.map((publicId) => (0, upload_1.deleteFromCloudinary)(publicId, "image")));
        res.status(200).json({ status: "success", data: card });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateCard = updateCard;
// DELETE /v1/api/who-we-serve/cards/:id (admin, also deletes images from Cloudinary)
const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid card id" });
            return;
        }
        const card = await whoWeServe_model_1.WhoWeServeCard.findByIdAndDelete(id);
        if (!card) {
            res.status(404).json({ status: "error", message: "Card not found" });
            return;
        }
        const jobs = [...card.image.en, ...card.image.ar].map((x) => (0, upload_1.deleteFromCloudinary)(x.publicId, "image"));
        await Promise.allSettled(jobs);
        res.status(200).json({ status: "success", message: "Card deleted" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.deleteCard = deleteCard;
