"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOffice = exports.updateOffice = exports.createOffice = exports.deleteStat = exports.updateStat = exports.createStat = exports.updateSection = exports.getNumbersPresence = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const numbersPresence_model_1 = require("./numbersPresence.model");
const numbersPresence_validation_1 = require("./numbersPresence.validation");
const upload_1 = require("../../middlewares/upload");
const LANGS = ["en", "ar"];
const SECTION_FOLDER = "audit-website/numbers-presence/section";
const OFFICE_FOLDER = "audit-website/numbers-presence/offices";
const SECTION_BG_FIELDS = {
    sectionBg: { en: "sectionBgEn", ar: "sectionBgAr" },
    panelBg: { en: "panelBgEn", ar: "panelBgAr" },
};
const OFFICE_IMAGE_FIELDS = { en: "imageEn", ar: "imageAr" };
const GREEN = `style="color:#00852B"`;
// ---- Default content, inserted only when the collections are empty ----
// Rich text fields contain HTML with the green highlight as an inline style.
// The Arabic text is a translation. Have a native speaker check it.
const DEFAULT_SECTION = {
    numbersTitle: {
        en: `Our Strength <span ${GREEN}>in Numbers</span>`,
        ar: `قوتنا <span ${GREEN}>بالأرقام</span>`,
    },
    securityTitle: {
        en: `Your data is handled <span ${GREEN}>securely and confidentially.</span>`,
        ar: `تُدار بياناتك <span ${GREEN}>بأمان وسرية تامة.</span>`,
    },
    securityText: {
        en: "An NDA is included as standard with every engagement. Client records are stored in secure, access-controlled systems and can only be accessed by authorized team members assigned to your file. Records are retained only for as long as legally required, and your data is never shared outside the engagement team.",
        ar: "تُدرج اتفاقية عدم الإفصاح (NDA) تلقائيًا في كل تعاقد. تُحفظ سجلات العملاء في أنظمة آمنة ومحكومة بالصلاحيات، ولا يطّلع عليها إلا أعضاء الفريق المصرّح لهم والمكلفون بملفك. تُحفظ السجلات فقط للمدة التي يقتضيها القانون، ولا تُشارك بياناتك خارج فريق التعاقد أبدًا.",
    },
    insuranceText: {
        en: "Professional Indemnity Insurance is in place, and a certificate is available upon request.",
        ar: "تأمين المسؤولية المهنية ساري المفعول، وتتوفر الشهادة عند الطلب.",
    },
    globalLabel: { en: "Global Presence", ar: "الحضور العالمي" },
    globalTitle: {
        en: `Serving clients across the <span ${GREEN}>UAE, Canada, the USA and Panama</span>`,
        ar: `نخدم عملاءنا في <span ${GREEN}>الإمارات وكندا والولايات المتحدة وبنما</span>`,
    },
    globalText: {
        en: "Offices in Dubai and Canada (Mississauga), with an active presence in the USA and Panama. If you are entering the UAE from abroad, or running entities in more than one country, you deal with one firm, one engagement and one point of contact.",
        ar: "مكاتب في دبي وكندا (ميسيساغا)، مع حضور فعّال في الولايات المتحدة وبنما. إذا كنت تدخل الإمارات من الخارج، أو تدير كيانات في أكثر من دولة، فستتعامل مع شركة واحدة وتعاقد واحد ونقطة اتصال واحدة.",
    },
};
const DEFAULT_STATS = [
    {
        icon: "users",
        color: "violet",
        value: 25,
        suffix: "+",
        label: { en: "Years of Experience", ar: "سنوات من الخبرة" },
    },
    {
        icon: "globe",
        color: "emerald",
        value: 100,
        suffix: "%",
        label: { en: "UAE National Owned", ar: "مملوكة بالكامل لمواطنين إماراتيين" },
    },
    {
        icon: "document",
        color: "green",
        value: 5,
        suffix: "+",
        label: { en: "Service Areas", ar: "مجالات الخدمة" },
    },
    {
        icon: "mappin",
        color: "teal",
        value: 7,
        suffix: "+",
        label: { en: "Emirates Covered", ar: "إمارات تغطيها خدماتنا" },
    },
];
const DEFAULT_OFFICES = [
    {
        city: { en: "Dubai", ar: "دبي" },
        country: { en: "UAE", ar: "الإمارات" },
        flagCode: "ae",
    },
    {
        city: { en: "Mississauga", ar: "ميسيساغا" },
        country: { en: "Canada", ar: "كندا" },
        flagCode: "ca",
    },
    {
        city: { en: "New York", ar: "نيويورك" },
        country: { en: "USA", ar: "الولايات المتحدة" },
        flagCode: "us",
    },
    {
        city: { en: "Panama City", ar: "مدينة بنما" },
        country: { en: "Panama", ar: "بنما" },
        flagCode: "pa",
    },
];
const ensureDefaults = async () => {
    if (!(await numbersPresence_model_1.NumbersSection.exists({}))) {
        await numbersPresence_model_1.NumbersSection.create({
            ...DEFAULT_SECTION,
            sectionBg: { en: [], ar: [] },
            panelBg: { en: [], ar: [] },
        });
    }
    if (!(await numbersPresence_model_1.NumbersStat.exists({}))) {
        await numbersPresence_model_1.NumbersStat.insertMany(DEFAULT_STATS.map((s, i) => ({ ...s, order: i })));
    }
    if (!(await numbersPresence_model_1.NumbersOffice.exists({}))) {
        await numbersPresence_model_1.NumbersOffice.insertMany(DEFAULT_OFFICES.map((o, i) => ({
            ...o,
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
// Replaces the media for each language that has a new upload.
// Old files are queued for deletion after the save succeeds.
const swapMedia = async (doc, key, files, fields, folder, toDelete) => {
    for (const lang of LANGS) {
        const incoming = files?.[fields[lang]];
        if (!incoming?.length)
            continue;
        const current = doc.get(`${key}.${lang}`) ?? [];
        toDelete.push(...current.map((x) => x.publicId));
        const added = await (0, upload_1.uploadMany)(incoming, folder, "image");
        doc.set(`${key}.${lang}`, toMedia(added));
    }
};
// GET /v1/api/numbers-presence (public)
// Returns the section, the stats, and the offices, each sorted by order
const getNumbersPresence = async (_req, res) => {
    try {
        await ensureDefaults();
        const [section, stats, offices] = await Promise.all([
            numbersPresence_model_1.NumbersSection.findOne(),
            numbersPresence_model_1.NumbersStat.find().sort({ order: 1, createdAt: 1 }),
            numbersPresence_model_1.NumbersOffice.find().sort({ order: 1, createdAt: 1 }),
        ]);
        res.status(200).json({
            status: "success",
            data: { section, stats, offices },
        });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.getNumbersPresence = getNumbersPresence;
// PATCH /v1/api/numbers-presence/section (admin, JSON or multipart)
// Uploading a background replaces the old one for that language
const updateSection = async (req, res) => {
    try {
        const parsed = numbersPresence_validation_1.updateSectionSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        await ensureDefaults();
        const section = await numbersPresence_model_1.NumbersSection.findOne();
        if (!section) {
            res.status(404).json({ status: "error", message: "Section not found" });
            return;
        }
        section.set(parsed.data);
        const files = req.files;
        const toDelete = [];
        await swapMedia(section, "sectionBg", files, SECTION_BG_FIELDS.sectionBg, SECTION_FOLDER, toDelete);
        await swapMedia(section, "panelBg", files, SECTION_BG_FIELDS.panelBg, SECTION_FOLDER, toDelete);
        await section.save();
        await Promise.allSettled(toDelete.map((publicId) => (0, upload_1.deleteFromCloudinary)(publicId, "image")));
        res.status(200).json({ status: "success", data: section });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateSection = updateSection;
// ---- Stats ----
// POST /v1/api/numbers-presence/stats (admin)
const createStat = async (req, res) => {
    try {
        const parsed = numbersPresence_validation_1.createStatSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const stat = await numbersPresence_model_1.NumbersStat.create(parsed.data);
        res.status(201).json({ status: "success", data: stat });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.createStat = createStat;
// PATCH /v1/api/numbers-presence/stats/:id (admin)
const updateStat = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid stat id" });
            return;
        }
        const parsed = numbersPresence_validation_1.updateStatSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const stat = await numbersPresence_model_1.NumbersStat.findByIdAndUpdate(id, parsed.data, {
            new: true,
            runValidators: true,
        });
        if (!stat) {
            res.status(404).json({ status: "error", message: "Stat not found" });
            return;
        }
        res.status(200).json({ status: "success", data: stat });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateStat = updateStat;
// DELETE /v1/api/numbers-presence/stats/:id (admin)
const deleteStat = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid stat id" });
            return;
        }
        const stat = await numbersPresence_model_1.NumbersStat.findByIdAndDelete(id);
        if (!stat) {
            res.status(404).json({ status: "error", message: "Stat not found" });
            return;
        }
        res.status(200).json({ status: "success", message: "Stat deleted" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.deleteStat = deleteStat;
// ---- Offices ----
// POST /v1/api/numbers-presence/offices (admin, multipart/form-data)
const createOffice = async (req, res) => {
    try {
        const parsed = numbersPresence_validation_1.createOfficeSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const files = req.files;
        const image = {
            en: await (0, upload_1.uploadMany)(files?.[OFFICE_IMAGE_FIELDS.en], OFFICE_FOLDER, "image"),
            ar: await (0, upload_1.uploadMany)(files?.[OFFICE_IMAGE_FIELDS.ar], OFFICE_FOLDER, "image"),
        };
        const office = await numbersPresence_model_1.NumbersOffice.create({
            ...parsed.data,
            image: { en: toMedia(image.en), ar: toMedia(image.ar) },
        });
        res.status(201).json({ status: "success", data: office });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.createOffice = createOffice;
// PATCH /v1/api/numbers-presence/offices/:id (admin, multipart/form-data)
// New images are added. removePublicIds deletes existing images.
const updateOffice = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid office id" });
            return;
        }
        const parsed = numbersPresence_validation_1.updateOfficeSchema.safeParse(normalizeBody(req.body));
        if (!parsed.success) {
            res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
            return;
        }
        const office = await numbersPresence_model_1.NumbersOffice.findById(id);
        if (!office) {
            res.status(404).json({ status: "error", message: "Office not found" });
            return;
        }
        const { removePublicIds, ...fields } = parsed.data;
        const files = req.files;
        const toDelete = [];
        office.set(fields);
        for (const lang of LANGS) {
            const current = office.get(`image.${lang}`) ?? [];
            toDelete.push(...current
                .filter((x) => removePublicIds.includes(x.publicId))
                .map((x) => x.publicId));
            const keep = current.filter((x) => !removePublicIds.includes(x.publicId));
            const added = await (0, upload_1.uploadMany)(files?.[OFFICE_IMAGE_FIELDS[lang]], OFFICE_FOLDER, "image");
            office.set(`image.${lang}`, toMedia([...keep, ...added]));
        }
        await office.save();
        await Promise.allSettled(toDelete.map((publicId) => (0, upload_1.deleteFromCloudinary)(publicId, "image")));
        res.status(200).json({ status: "success", data: office });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.updateOffice = updateOffice;
// DELETE /v1/api/numbers-presence/offices/:id (admin, also deletes images from Cloudinary)
const deleteOffice = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.isValidObjectId(id)) {
            res.status(400).json({ status: "error", message: "Invalid office id" });
            return;
        }
        const office = await numbersPresence_model_1.NumbersOffice.findByIdAndDelete(id);
        if (!office) {
            res.status(404).json({ status: "error", message: "Office not found" });
            return;
        }
        const jobs = [...office.image.en, ...office.image.ar].map((x) => (0, upload_1.deleteFromCloudinary)(x.publicId, "image"));
        await Promise.allSettled(jobs);
        res.status(200).json({ status: "success", message: "Office deleted" });
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};
exports.deleteOffice = deleteOffice;
