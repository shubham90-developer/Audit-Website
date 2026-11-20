import type { Request, Response, NextFunction } from "express";
import { BlogSection } from "./blog.model";
import { sectionInput } from "./blog.validation";
import { uploadBuffer } from "../../middlewares/upload";

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

export const getBlogSection = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await BlogSection.findOneAndUpdate(
      { key: "insights" },
      { $setOnInsert: seed },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateBlogSection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = sectionInput.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid blog data",
        errors: result.error.flatten(),
      });
    }
    const data = await BlogSection.findOneAndUpdate(
      { key: "insights" },
      { $set: result.data },
      { upsert: true, returnDocument: "after", runValidators: true },
    );
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPublishedArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const section = await BlogSection.findOne({ key: "insights" }).lean();
    const article = section?.articles?.find(
      (item: any) =>
        item.slug === req.params.slug && item.status === "published",
    );
    if (!article) {
      return res
        .status(404)
        .json({ success: false, message: "Article not found" });
    }
    res.json({ success: true, data: article });
  } catch (error) {
    next(error);
  }
};

export const uploadBlogImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image required" });
    }
    const data = await uploadBuffer(req.file.buffer, "audit-blog", "image");
    res.json({ success: true, data }); // { url, publicId }
  } catch (error) {
    next(error);
  }
};
