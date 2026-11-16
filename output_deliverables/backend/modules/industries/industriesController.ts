import { Request, Response } from "express";
import mongoose from "mongoose";
import { IndustriesSection, IndustryItem } from "./industries.model";
import {
  updateIndustriesSectionSchema,
  createIndustryItemSchema,
  updateIndustryItemSchema,
} from "./industries.validation";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const normalizeBody = (body: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && /^[\[\{]/.test(value.trim())) {
      try {
        out[key] = JSON.parse(value);
        continue;
      } catch {}
    }
    out[key] = value;
  }
  return out;
};

const DEFAULT_SECTION = {
  title: { en: "Industries We", ar: "القطاعات التي" },
  colorTitle: { en: "Serve", ar: "نخدمها" },
  subtitle: {
    en: "Audit, tax and advisory support tailored to the regulatory and operational realities of your sector.",
    ar: "خدمات تدقيق وضرائب واستشارات مصممة خصيصاً لتناسب المتطلبات التنظيمية والتشغيلية لقطاعك.",
  },
  watermark: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
  bgImage: {
    en: [{ url: "/img/banner/bg7.avif", publicId: "" }],
    ar: [{ url: "/img/banner/bg7.avif", publicId: "" }],
  },
};

const DEFAULT_INDUSTRIES = [
  {
    title: { en: "Government & Semi-Government", ar: "الجهات الحكومية وشبه الحكومية" },
    text: { en: "Audit, tax and advisory support tailored to government entities and semi-government organisations.", ar: "دعم مخصص في التدقيق والضرائب والاستشارات للمؤسسات والشركات شبه الحكومية." },
    icon: "building",
    image: { en: [{ url: "/img/banner/1.jpg", publicId: "" }], ar: [{ url: "/img/banner/1.jpg", publicId: "" }] },
    order: 0,
  },
  {
    title: { en: "Real Estate & Construction", ar: "العقارات والإنشاءات" },
    text: { en: "Reliable assurance, accounting and compliance services for property developers and construction businesses.", ar: "خدمات موثوقة في التدقيق والمحاسبة والامتثال لشركات التطوير العقاري والمقاولات." },
    icon: "home",
    image: { en: [{ url: "/img/banner/2.jpg", publicId: "" }], ar: [{ url: "/img/banner/2.jpg", publicId: "" }] },
    order: 1,
  },
  {
    title: { en: "Oil, Gas & Energy", ar: "النفط والغاز والطاقة" },
    text: { en: "Strategic financial reporting, risk management and tax advisory for energy businesses.", ar: "تقارير مالية استراتيجية وإدارة مخاطر واستشارات ضريبية متخصصة لقطاع الطاقة." },
    icon: "bolt",
    image: { en: [{ url: "/img/banner/3.jpg", publicId: "" }], ar: [{ url: "/img/banner/3.jpg", publicId: "" }] },
    order: 2,
  },
  {
    title: { en: "Trading & Distribution", ar: "التجارة والتوزيع" },
    text: { en: "Practical audit, inventory and tax solutions that help trading businesses improve financial performance.", ar: "حلول عملية في التدقيق والجرد والضرائب تدعم كفاءة وأداء شركات التجارة والتوزيع." },
    icon: "truck",
    image: { en: [{ url: "/img/banner/4.jpg", publicId: "" }], ar: [{ url: "/img/banner/4.jpg", publicId: "" }] },
    order: 3,
  },
  {
    title: { en: "Healthcare", ar: "الرعاية الصحية" },
    text: { en: "Financial clarity and compliance support for healthcare providers and medical organisations.", ar: "وضوح مالي وامتثال تنظيمي لمقدمي الرعاية الصحية والمؤسسات الطبية." },
    icon: "heart",
    image: { en: [{ url: "/img/banner/1.jpg", publicId: "" }], ar: [{ url: "/img/banner/1.jpg", publicId: "" }] },
    order: 4,
  },
  {
    title: { en: "Hospitality & Tourism", ar: "الضيافة والسياحة" },
    text: { en: "Accounting, assurance and advisory services for hotels, restaurants and tourism businesses.", ar: "خدمات تدقيق ومحاسبة واستشارات لقطاع الفنادق والمطاعم والشركات السياحية." },
    icon: "globe",
    image: { en: [{ url: "/img/banner/2.jpg", publicId: "" }], ar: [{ url: "/img/banner/2.jpg", publicId: "" }] },
    order: 5,
  },
  {
    title: { en: "Manufacturing", ar: "الصناعة والإنتاج" },
    text: { en: "Financial insights and risk management for manufacturers seeking operational efficiency.", ar: "رؤى مالية وإدارة للمخاطر للمصانع والشركات الإنتاجية لتعزيز الكفاءة التشغيلية." },
    icon: "cog",
    image: { en: [{ url: "/img/banner/3.jpg", publicId: "" }], ar: [{ url: "/img/banner/3.jpg", publicId: "" }] },
    order: 6,
  },
  {
    title: { en: "Technology & Start-ups", ar: "التكنولوجيا والشركات الناشئة" },
    text: { en: "Flexible financial and advisory services for growing technology companies and emerging businesses.", ar: "حلول مالية واستشارية مرنة لشركات التكنولوجيا النامية والمشاريع الناشئة." },
    icon: "chip",
    image: { en: [{ url: "/img/banner/1.jpg", publicId: "" }], ar: [{ url: "/img/banner/1.jpg", publicId: "" }] },
    order: 7,
  },
  {
    title: { en: "Family Businesses", ar: "الشركات العائلية" },
    text: { en: "Trusted financial guidance to support sustainable growth, governance and long-term business continuity.", ar: "توجيه مالي موثوق لدعم الحوكمة والنمو المستدام واستمرارية الأعمال العائلية عبر الأجيال." },
    icon: "users",
    image: { en: [{ url: "/img/banner/2.jpg", publicId: "" }], ar: [{ url: "/img/banner/2.jpg", publicId: "" }] },
    order: 8,
  },
  {
    title: { en: "Non-Profit Organisations", ar: "المؤسسات غير الربحية" },
    text: { en: "Transparent reporting, audit and compliance services for non-profit and charitable organisations.", ar: "تقارير شفافة وخدمات تدقيق وامتثال للهيئات غير الربحية والجمعيات الخيرية." },
    icon: "hand",
    image: { en: [{ url: "/img/banner/3.jpg", publicId: "" }], ar: [{ url: "/img/banner/3.jpg", publicId: "" }] },
    order: 9,
  },
];

export const ensureDefaultIndustries = async (): Promise<void> => {
  const sectionExists = await IndustriesSection.exists({});
  if (!sectionExists) {
    await IndustriesSection.create(DEFAULT_SECTION);
  }

  const itemsCount = await IndustryItem.countDocuments();
  if (itemsCount === 0) {
    await IndustryItem.insertMany(DEFAULT_INDUSTRIES);
  }
};

export const getIndustriesData = async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultIndustries();
    const section = await IndustriesSection.findOne();
    const items = await IndustryItem.find().sort({ order: 1 });
    res.status(200).json({
      status: "success",
      data: {
        section,
        items,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateIndustriesSection = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultIndustries();
    let section = await IndustriesSection.findOne();
    if (!section) section = await IndustriesSection.create(DEFAULT_SECTION);

    const parsed = updateIndustriesSectionSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    section.set(fields);

    const files = req.files as Record<string, any[]> | undefined;
    for (const lang of ["en", "ar"] as const) {
      const fieldName = lang === "en" ? "bgImageEn" : "bgImageAr";
      const currentList = (section.get("bgImage." + lang) || []) as any[];
      const keep = currentList.filter((item: any) => !removePublicIds.includes(item.publicId));

      const uploaded = await uploadMany(files?.[fieldName], "audit-website/industries", "image");
      if (uploaded.length > 0) {
        section.set("bgImage." + lang, [...keep, ...uploaded]);
      } else if (removePublicIds.length > 0) {
        section.set("bgImage." + lang, keep);
      }
    }

    await section.save();
    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createIndustryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createIndustryItemSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const image = { en: [], ar: [] } as any;
    for (const lang of ["en", "ar"] as const) {
      const fieldName = lang === "en" ? "imageEn" : "imageAr";
      image[lang] = await uploadMany(files?.[fieldName], "audit-website/industries/items", "image");
    }

    const item = await IndustryItem.create({ ...parsed.data, image });
    res.status(201).json({ status: "success", data: item });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateIndustryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid ID" });
      return;
    }
    const item = await IndustryItem.findById(id);
    if (!item) {
      res.status(404).json({ status: "error", message: "Industry item not found" });
      return;
    }

    const parsed = updateIndustryItemSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    item.set(fields);

    const files = req.files as Record<string, any[]> | undefined;
    for (const lang of ["en", "ar"] as const) {
      const fieldName = lang === "en" ? "imageEn" : "imageAr";
      const currentList = (item.get("image." + lang) || []) as any[];
      const keep = currentList.filter((x: any) => !removePublicIds?.includes(x.publicId));

      const uploaded = await uploadMany(files?.[fieldName], "audit-website/industries/items", "image");
      if (uploaded.length > 0) {
        item.set("image." + lang, [...keep, ...uploaded]);
      } else if (removePublicIds && removePublicIds.length > 0) {
        item.set("image." + lang, keep);
      }
    }

    await item.save();
    res.status(200).json({ status: "success", data: item });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteIndustryItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid ID" });
      return;
    }
    await IndustryItem.findByIdAndDelete(id);
    res.status(200).json({ status: "success", message: "Industry deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
