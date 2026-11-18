import { z } from "zod";
const localized = z.object({ en: z.string(), ar: z.string() });
const media = z.object({
  url: z.string(),
  publicId: z.string().optional().default(""),
});
const localizedMedia = z.object({ en: media, ar: media });
const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/);
export const categoryInput = z.object({
  _id: objectId.optional(),
  name: localized,
  slug: z.string().min(1),
  order: z.number(),
  active: z.boolean(),
});
export const articleInput = z.object({
  _id: objectId.optional(),
  categoryId: objectId,
  slug: z.string().min(1),
  title: localized,
  excerpt: localized,
  content: localized,
  cardImage: localizedMedia,
  mainImage: localizedMedia,
  publishedAt: z.string(),
  status: z.enum(["draft", "published"]),
  order: z.number(),
});
export const sectionInput = z
  .object({
    heroTitle: localized,
    heroDescription: localized,
    heroImage: localizedMedia,
    exploreLabel: localized,
    categories: z.array(categoryInput),
    articles: z.array(articleInput),
  })
  .superRefine((data, ctx) => {
    const categoryIds = new Set(
      data.categories.map((c) => c._id).filter(Boolean),
    );
    const slugs = new Set<string>();
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
