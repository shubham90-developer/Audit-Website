"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.updateItem = exports.createItem = exports.updateSection = exports.getWhoWeAre = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const whoWeAre_model_1 = require("./whoWeAre.model");
const whoWeAre_validation_1 = require("./whoWeAre.validation");
// ---- Default content, inserted only when the collection is empty ----
// The Arabic text is a translation. Have a native speaker check it.
const DEFAULT_SECTION = {
    eyebrow: { en: "WHO WE ARE", ar: "من نحن" },
    headlinePrefix: { en: "Building trust through", ar: "نبني الثقة من خلال" },
    highlight: { en: "expertise", ar: "الخبرة" },
    headlineSuffix: { en: "and integrity.", ar: "والنزاهة." },
    brandName: {
        en: "Ahmed Al Mazroei Auditing & Accounting",
        ar: "أحمد المزروعي للتدقيق والمحاسبة",
    },
    body: {
        en: "is a UAE National-owned audit firm based in Abu Dhabi. Since 2000 we have helped companies, family businesses, government-related entities and investors with audit, accounting, tax and advisory services. We are licensed by the Department of Economic Development in Abu Dhabi and serve clients across all seven emirates.",
        ar: "شركة تدقيق مملوكة لمواطنين إماراتيين، مقرها أبوظبي. منذ عام 2000 نساعد الشركات والمؤسسات العائلية والجهات ذات الصلة بالحكومة والمستثمرين بخدمات التدقيق والمحاسبة والضرائب والاستشارات. نحن مرخصون من دائرة التنمية الاقتصادية في أبوظبي ونخدم عملاءنا في الإمارات السبع.",
    },
    quote: {
        en: "You can start with a trade licence and still be with us at your first corporate tax return. Most of our clients are.",
        ar: "يمكنك البدء برخصة تجارية والبقاء معنا حتى أول إقرار ضريبي للشركة. معظم عملائنا كذلك.",
    },
    ctaLabel: { en: "Explore Our Services", ar: "استكشف خدماتنا" },
    ctaHref: { en: "/services", ar: "/services" },
    watermark: { en: "Your Growth Partner", ar: "شريكك في النمو" },
    snapshotTitle: { en: "Firm Snapshot", ar: "لمحة عن الشركة" },
    snapshotTagline: {
        en: "Everything you need. Under one roof.",
        ar: "كل ما تحتاجه، تحت سقف واحد.",
    },
};
const DEFAULT_ITEMS = [
    {
        icon: "award",
        label: { en: "Established", ar: "تأسست" },
        value: { en: "Since 2000", ar: "منذ 2000" },
        note: {
            en: "UAE National-owned audit firm",
            ar: "شركة تدقيق مملوكة لمواطنين إماراتيين",
        },
    },
    {
        icon: "badge",
        label: { en: "Licensed by", ar: "مرخصة من" },
        value: {
            en: "Department of Economic Development, Abu Dhabi",
            ar: "دائرة التنمية الاقتصادية، أبوظبي",
        },
        note: { en: "", ar: "" },
    },
    {
        icon: "shield",
        label: { en: "Licence No.", ar: "رقم الرخصة" },
        value: { en: "30008692", ar: "30008692" },
        note: { en: "", ar: "" },
    },
    {
        icon: "globe",
        label: { en: "Coverage", ar: "التغطية" },
        value: { en: "All 7 Emirates", ar: "جميع الإمارات السبع" },
        note: {
            en: "Serving clients across the UAE",
            ar: "نخدم عملاء في مختلف أنحاء الدولة",
        },
    },
    {
        icon: "layers",
        label: { en: "Services", ar: "الخدمات" },
        value: {
            en: "Accounting, tax, audit, business setup and corporate services",
            ar: "محاسبة، ضرائب، تدقيق، تأسيس الأعمال والخدمات المؤسسية",
        },
        note: { en: "", ar: "" },
    },
    {
        icon: "pin",
        label: { en: "Office", ar: "المكتب" },
        value: {
            en: "Office 601, Damac Executive Bay Tower B, Business Bay, Dubai",
            ar: "مكتب 601، دامك إكزيكيوتيف باي تاور B، بيزنس باي، دبي",
        },
        note: { en: "", ar: "" },
    },
];
// Sorting keeps every request on the same document, even if two first requests raced.
const findSection = () => whoWeAre_model_1.WhoWeAreSection.findOne().sort({ createdAt: 1 });
const ensureDefaults = async () => {
    if (!(await whoWeAre_model_1.WhoWeAreSection.exists({}))) {
        await whoWeAre_model_1.WhoWeAreSection.create({
            ...DEFAULT_SECTION,
            snapshotItems: DEFAULT_ITEMS.map((item, i) => ({ ...item, order: i })),
        });
    }
};
const zodMessage = (error) => error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
// GET /v1/api/who-we-are (public)
// Returns the section with snapshot cards sorted by order
const getWhoWeAre = async (_req, res) => {
    try {
        await ensureDefaults();
        const section = await findSection();
        if (!section) {
            res.status(404).json({ status: "error", message: "Section not found" });
            return;
        }
        const items = [...section.snapshotItems].sort((a, b) => a.order - b.order);
        res.status(200).json({
            status: "success",
            data: { ...section.toObject(), snapshotItems: items },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.getWhoWeAre = getWhoWeAre;
// PATCH /v1/api/who-we-are (admin, JSON)
// Partial update. Send only the fields you change.
const updateSection = async (req, res) => {
    try {
        const parsed = whoWeAre_validation_1.updateSectionSchema.safeParse(req.body);
        if (!parsed.success) {
            res
                .status(400)
                .json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        await ensureDefaults();
        const section = await findSection();
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
// ---- Snapshot cards ----
// POST /v1/api/who-we-are/items (admin)
const createItem = async (req, res) => {
    try {
        const parsed = whoWeAre_validation_1.createItemSchema.safeParse(req.body);
        if (!parsed.success) {
            res
                .status(400)
                .json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        await ensureDefaults();
        const section = await findSection();
        if (!section) {
            res.status(404).json({ status: "error", message: "Section not found" });
            return;
        }
        const nextOrder = section.snapshotItems.length
            ? Math.max(...section.snapshotItems.map((i) => i.order)) + 1
            : 0;
        section.snapshotItems.push({
            ...parsed.data,
            order: parsed.data.order ?? nextOrder,
        });
        await section.save();
        const item = section.snapshotItems[section.snapshotItems.length - 1];
        res.status(201).json({ status: "success", data: item });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.createItem = createItem;
// PATCH /v1/api/who-we-are/items/:itemId (admin)
const updateItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        if (!mongoose_1.default.isValidObjectId(itemId)) {
            res.status(400).json({ status: "error", message: "Invalid item id" });
            return;
        }
        const parsed = whoWeAre_validation_1.updateItemSchema.safeParse(req.body);
        if (!parsed.success) {
            res
                .status(400)
                .json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const section = await findSection();
        const item = section?.snapshotItems.find((entry) => String(entry._id) === String(itemId));
        if (!section || !item) {
            res.status(404).json({ status: "error", message: "Item not found" });
            return;
        }
        Object.assign(item, parsed.data);
        await section.save();
        res.status(200).json({ status: "success", data: item });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateItem = updateItem;
// DELETE /v1/api/who-we-are/items/:itemId (admin)
const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        if (!mongoose_1.default.isValidObjectId(itemId)) {
            res.status(400).json({ status: "error", message: "Invalid item id" });
            return;
        }
        const section = await findSection();
        if (!section ||
            !section.snapshotItems.some((entry) => String(entry._id) === String(itemId))) {
            res.status(404).json({ status: "error", message: "Item not found" });
            return;
        }
        section.snapshotItems.splice(section.snapshotItems.findIndex((entry) => String(entry._id) === String(itemId)), 1);
        await section.save();
        res.status(200).json({ status: "success", message: "Item deleted" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.deleteItem = deleteItem;
