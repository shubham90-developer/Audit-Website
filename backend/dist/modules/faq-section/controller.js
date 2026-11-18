"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFaqSection = exports.getFaqSection = void 0;
const model_1 = require("./model");
const validation_1 = require("./validation");
const upload_1 = require("../../middlewares/upload");
const t = (en, ar) => ({ en, ar });
const defaultData = {
    singleton: 'faq-page',
    title: t('Frequently Asked Questions', 'الأسئلة الشائعة'),
    description: t('Clear answers on company setup, corporate tax, VAT, accounting, audit and visas in Dubai and the UAE, from an FTA registered tax agency.', 'إجابات واضحة حول تأسيس الشركات والضرائب والمحاسبة والتدقيق والتأشيرات في دبي والإمارات.'),
    breadcrumbHome: t('Home', 'الرئيسية'), exploreLabel: t('EXPLORE ANSWERS', 'استكشف الإجابات'), questionsLabel: t('Questions', 'أسئلة'), emptyLabel: t('Questions coming soon', 'الأسئلة ستتوفر قريباً'),
    ctaTitle: t('Still have questions?', 'هل لديك المزيد من الأسئلة؟'), ctaDescription: t('Our team is ready to help with your business and financial needs.', 'فريقنا مستعد لمساعدتك في احتياجاتك التجارية والمالية.'), ctaButton: t('Contact Our Team', 'تواصل مع فريقنا'),
    backgroundImage: { en: { url: '/img/banner/bg2.avif', publicId: '' }, ar: { url: '/img/banner/bg2.avif', publicId: '' } },
    categories: [
        { name: t('About Ahmed Al Mazroei', 'عن أحمد المزروعي'), order: 0, active: true, questions: [
                { question: t('What services do you provide?', 'ما الخدمات التي تقدمونها؟'), answer: t('We offer accounting, tax, audit and business advisory services. This is sample content.', 'نقدم خدمات المحاسبة والضرائب والتدقيق والاستشارات التجارية. هذا محتوى تجريبي.'), order: 0, active: true },
                { question: t('How can I get started?', 'كيف يمكنني البدء؟'), answer: t('Contact our team to discuss your requirements. This is sample content.', 'تواصل مع فريقنا لمناقشة متطلباتك. هذا محتوى تجريبي.'), order: 1, active: true },
            ] },
        ...[['Business Setup', 'تأسيس الأعمال'], ['Tax', 'الضرائب'], ['Accounting', 'المحاسبة'], ['Audit & Compliance', 'التدقيق والامتثال'], ['Corporate Services', 'خدمات الشركات'], ['Visa & Other', 'التأشيرات وغيرها']].map(([en, ar], i) => ({ name: t(en, ar), order: i + 1, active: true, questions: [] }))
    ],
};
const getFaqSection = async (_req, res) => {
    try {
        const data = await model_1.FaqSection.findOneAndUpdate({ singleton: 'faq-page' }, { $setOnInsert: defaultData }, { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true });
        res.json({ success: true, data });
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
exports.getFaqSection = getFaqSection;
const updateFaqSection = async (req, res) => {
    try {
        const parsedBody = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body;
        const validated = validation_1.faqSectionSchema.safeParse(parsedBody);
        if (!validated.success) {
            res.status(400).json({ success: false, message: validated.error.issues.map(x => `${x.path.join('.')}: ${x.message}`).join('; ') });
            return;
        }
        const existing = await model_1.FaqSection.findOne({ singleton: 'faq-page' });
        const incoming = validated.data;
        const files = (req.files ?? []);
        const uploaded = [];
        const oldMedia = [];
        const backgroundImage = { en: { url: existing?.backgroundImage?.en?.url ?? defaultData.backgroundImage.en.url, publicId: existing?.backgroundImage?.en?.publicId ?? '' }, ar: { url: existing?.backgroundImage?.ar?.url ?? defaultData.backgroundImage.ar.url, publicId: existing?.backgroundImage?.ar?.publicId ?? '' } };
        try {
            for (const lang of ['en', 'ar']) {
                const file = files.find(f => f.fieldname === `backgroundImage${lang === 'en' ? 'En' : 'Ar'}`);
                if (file) {
                    const next = await (0, upload_1.uploadBuffer)(file.buffer, 'audit-website/faq', 'image');
                    uploaded.push(next);
                    if (backgroundImage[lang].publicId)
                        oldMedia.push({ publicId: backgroundImage[lang].publicId });
                    backgroundImage[lang] = next;
                }
            }
            const data = await model_1.FaqSection.findOneAndUpdate({ singleton: 'faq-page' }, { $set: { ...incoming, backgroundImage } }, { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true });
            await Promise.allSettled(oldMedia.map(m => (0, upload_1.deleteFromCloudinary)(m.publicId, 'image')));
            res.json({ success: true, data });
        }
        catch (e) {
            await Promise.allSettled(uploaded.map(m => (0, upload_1.deleteFromCloudinary)(m.publicId, 'image')));
            throw e;
        }
    }
    catch (e) {
        res.status(500).json({ success: false, message: e.message });
    }
};
exports.updateFaqSection = updateFaqSection;
