"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublishedArticle = exports.updateBlogSection = exports.getBlogSection = void 0;
const blog_model_1 = require("./blog.model");
const blog_validation_1 = require("./blog.validation");
const seed = {
    key: "insights",
    heroTitle: { en: "Insights & Resources", ar: "المقالات والموارد" },
    heroDescription: {
        en: "Stay informed with expert insights, practical guidance, and the latest updates on accounting, tax, and business in the UAE.",
        ar: "اطلع على أحدث المقالات والإرشادات حول المحاسبة والضرائب والأعمال في الإمارات.",
    },
    heroImage: { en: { url: "", publicId: "" }, ar: { url: "", publicId: "" } },
    exploreLabel: { en: "Insights & Resources", ar: "المقالات والموارد" },
    categories: [
        {
            name: { en: "Audit & Assurance", ar: "التدقيق والضمان" },
            slug: "audit-assurance",
            order: 0,
            active: true,
        },
        {
            name: { en: "Tax Services", ar: "الخدمات الضريبية" },
            slug: "tax-services",
            order: 1,
            active: true,
        },
        {
            name: { en: "Accounting", ar: "المحاسبة" },
            slug: "accounting",
            order: 2,
            active: true,
        },
    ],
    articles: [],
};
const getBlogSection = async (_req, res, next) => {
    try {
        const data = await blog_model_1.BlogSection.findOneAndUpdate({ key: "insights" }, { $setOnInsert: seed }, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true });
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.getBlogSection = getBlogSection;
const updateBlogSection = async (req, res, next) => {
    try {
        const result = blog_validation_1.sectionInput.safeParse(req.body);
        if (!result.success)
            return res.status(400).json({
                success: false,
                message: "Invalid blog data",
                errors: result.error.flatten(),
            });
        const data = await blog_model_1.BlogSection.findOneAndUpdate({ key: "insights" }, { $set: result.data }, { upsert: true, returnDocument: "after", runValidators: true });
        res.json({ success: true, data });
    }
    catch (error) {
        next(error);
    }
};
exports.updateBlogSection = updateBlogSection;
const getPublishedArticle = async (req, res, next) => {
    try {
        const section = await blog_model_1.BlogSection.findOne({ key: "insights" }).lean();
        const article = section?.articles?.find((item) => item.slug === req.params.slug && item.status === "published");
        if (!article)
            return res
                .status(404)
                .json({ success: false, message: "Article not found" });
        res.json({ success: true, data: article });
    }
    catch (error) {
        next(error);
    }
};
exports.getPublishedArticle = getPublishedArticle;
