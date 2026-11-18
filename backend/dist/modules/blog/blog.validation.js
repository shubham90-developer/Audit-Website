"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sectionInput = exports.articleInput = exports.categoryInput = void 0;
const zod_1 = require("zod");
const localized = zod_1.z.object({ en: zod_1.z.string(), ar: zod_1.z.string() });
const media = zod_1.z.object({
    url: zod_1.z.string(),
    publicId: zod_1.z.string().optional().default(""),
});
const localizedMedia = zod_1.z.object({ en: media, ar: media });
const objectId = zod_1.z.string().regex(/^[a-fA-F0-9]{24}$/);
exports.categoryInput = zod_1.z.object({
    _id: objectId.optional(),
    name: localized,
    slug: zod_1.z.string().min(1),
    order: zod_1.z.number(),
    active: zod_1.z.boolean(),
});
exports.articleInput = zod_1.z.object({
    _id: objectId.optional(),
    categoryId: objectId,
    slug: zod_1.z.string().min(1),
    title: localized,
    excerpt: localized,
    content: localized,
    cardImage: localizedMedia,
    mainImage: localizedMedia,
    publishedAt: zod_1.z.string(),
    status: zod_1.z.enum(["draft", "published"]),
    order: zod_1.z.number(),
});
exports.sectionInput = zod_1.z
    .object({
    heroTitle: localized,
    heroDescription: localized,
    heroImage: localizedMedia,
    exploreLabel: localized,
    categories: zod_1.z.array(exports.categoryInput),
    articles: zod_1.z.array(exports.articleInput),
})
    .superRefine((data, ctx) => {
    const categoryIds = new Set(data.categories.map((c) => c._id).filter(Boolean));
    const slugs = new Set();
    data.articles.forEach((a, i) => {
        if (!categoryIds.has(a.categoryId))
            ctx.addIssue({
                code: "custom",
                path: ["articles", i, "categoryId"],
                message: "Select a saved category",
            });
        if (slugs.has(a.slug))
            ctx.addIssue({
                code: "custom",
                path: ["articles", i, "slug"],
                message: "Duplicate article slug",
            });
        slugs.add(a.slug);
    });
});
