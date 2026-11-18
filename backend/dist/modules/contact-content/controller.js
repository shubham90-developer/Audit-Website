"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContactContent = exports.getContactContent = void 0;
const model_1 = require("./model");
const validation_1 = require("./validation");
const upload_1 = require("../../middlewares/upload");
const text = (en, ar) => ({ en, ar });
const emptyMedia = () => ({ en: [], ar: [] });
const defaults = {
    heroBadge: text("LET'S GET IN TOUCH", "تواصل معنا"),
    heroTitle: text("Need Help?", "هل تحتاج إلى مساعدة؟"),
    heroHighlight: text("Contact Us", "اتصل بنا"),
    heroDescription: text("We would love to respond to your queries and help you succeed. Feel free to get in touch with our professional team.", "يسعدنا الرد على استفساراتك ومساعدتك على النجاح. تواصل مع فريقنا المتخصص."),
    heroBgImage: emptyMedia(),
    heroVideo: emptyMedia(),
    contactCards: [
        {
            key: "phone",
            label: text("Call Us", "اتصل بنا"),
            value: text("+97156 742 3428", "+97156 742 3428"),
            href: "tel:+971567423428",
            order: 0,
            isActive: true,
        },
        {
            key: "email",
            label: text("Email Us", "راسلنا"),
            value: text("info@almazroeiaudit.com", "info@almazroeiaudit.com"),
            href: "mailto:info@almazroeiaudit.com",
            order: 1,
            isActive: true,
        },
        {
            key: "whatsapp",
            label: text("WhatsApp", "واتساب"),
            value: text("+97156 742 3428", "+97156 742 3428"),
            href: "https://wa.me/971567423428",
            order: 2,
            isActive: true,
        },
        {
            key: "address",
            label: text("Office Address", "عنوان المكتب"),
            value: text("M-02, Building #19, Seashell Building, Medina St - Al Khalidiyah - W9 - Abu Dhabi", "أبوظبي، الخالدية، شارع المدينة، مبنى سي شيل 19، مكتب M-02"),
            href: "",
            order: 3,
            isActive: true,
        },
    ],
    sectionBadge: text("REACH OUT TO US", "تواصل معنا"),
    sectionTitle: text("We're Here to Help", "نحن هنا لمساعدتك"),
    sectionHighlight: text("Your Business Grow", "على تنمية أعمالك"),
    sectionDescription: text("For any queries, assistance, or potential collaborations — our team is ready to listen. Tell us what you need and the right specialist will come back to you.", "للاستفسارات أو المساعدة أو التعاون المحتمل، فريقنا مستعد للاستماع إليك."),
    sectionNote: text("Your inquiries are important to us.", "استفساراتك مهمة بالنسبة لنا."),
    sectionBgImage: emptyMedia(),
    features: [
        {
            icon: "headphones",
            title: text("Expert Consultation", "استشارة متخصصة"),
            description: text("Guidance from qualified UAE tax, audit and accounting professionals.", "إرشادات من متخصصين في الضرائب والتدقيق والمحاسبة في الإمارات."),
            order: 0,
            isActive: true,
        },
        {
            icon: "clock",
            title: text("Quick Response", "استجابة سريعة"),
            description: text("We reply within UAE business hours, not days later.", "نرد خلال ساعات العمل في الإمارات."),
            order: 1,
            isActive: true,
        },
        {
            icon: "users",
            title: text("Trusted by Businesses", "موثوق من الشركات"),
            description: text("Hundreds of clients served across the UAE and beyond.", "خدمنا مئات العملاء في الإمارات وخارجها."),
            order: 2,
            isActive: true,
        },
    ],
    formTitle: text("Book your Free Consultation", "احجز استشارتك المجانية"),
    formDescription: text("Fill out the form below, and we'll arrange a consultation at a time most suitable for you.", "املأ النموذج أدناه وسنرتب استشارة في الوقت المناسب لك."),
    formDisclaimer: text("No obligation", "دون أي التزام"),
};
const ensure = async () => model_1.ContactContentModel.findOneAndUpdate({}, { $setOnInsert: defaults }, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true });
const getContactContent = async (_req, res) => {
    try {
        const data = await ensure();
        res.status(200).json({ status: "success", data });
    }
    catch (e) {
        res.status(500).json({ status: "error", message: e.message });
    }
};
exports.getContactContent = getContactContent;
const updateContactContent = async (req, res) => {
    try {
        const body = {};
        for (const [key, val] of Object.entries(req.body)) {
            if (typeof val === "string" && /^[\[{]/.test(val.trim())) {
                try {
                    body[key] = JSON.parse(val);
                }
                catch {
                    body[key] = val;
                }
            }
            else
                body[key] = val;
        }
        const parsed = validation_1.updateContactContentSchema.safeParse(body);
        if (!parsed.success) {
            res.status(400).json({
                status: "error",
                message: parsed.error.issues
                    .map((x) => `${x.path.join(".")}: ${x.message}`)
                    .join(", "),
            });
            return;
        }
        const doc = await ensure();
        if (!doc) {
            res
                .status(500)
                .json({ status: "error", message: "Contact section missing" });
            return;
        }
        doc.set(parsed.data);
        const files = req.files;
        const specs = [
            { field: "heroBgImage", path: "heroBgImage", type: "image" },
            { field: "heroVideo", path: "heroVideo", type: "video" },
            { field: "sectionBgImage", path: "sectionBgImage", type: "image" },
        ];
        const stale = [];
        for (const spec of specs)
            for (const lang of ["en", "ar"]) {
                const input = files?.[`${spec.field}${lang === "en" ? "En" : "Ar"}`];
                if (!input?.length)
                    continue;
                const path = `${spec.path}.${lang}`;
                const previous = (doc.get(path) ?? []);
                const next = await (0, upload_1.uploadMany)(input, `audit-website/contact/${spec.field}`, spec.type);
                doc.set(path, next);
                for (const old of previous)
                    if (old.publicId)
                        stale.push({ publicId: old.publicId, type: spec.type });
            }
        await doc.save();
        await Promise.allSettled(stale.map((x) => (0, upload_1.deleteFromCloudinary)(x.publicId, x.type)));
        res.status(200).json({ status: "success", data: doc });
    }
    catch (e) {
        res.status(500).json({ status: "error", message: e.message });
    }
};
exports.updateContactContent = updateContactContent;
