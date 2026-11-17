import { Request, Response } from "express";
import mongoose from "mongoose";
import { IndustriesSection, Industry } from "./industries.model";
import {
  updateSectionSchema,
  createIndustrySchema,
  updateIndustrySchema,
} from "./industries.validation";
import {
  IMedia,
  ILocalizedString,
  IndustryIcon,
} from "./industries.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

type Lang = "en" | "ar";
const LANGS: Lang[] = ["en", "ar"];

const SECTION_FOLDER = "audit-website/industries/section";
const ITEM_FOLDER = "audit-website/industries/items";
const BG_FIELDS: Record<Lang, string> = { en: "sectionBgEn", ar: "sectionBgAr" };
const IMAGE_FIELDS: Record<Lang, string> = { en: "imageEn", ar: "imageAr" };

const GREEN = `style="color:#00852B"`;

// ---- Default content, inserted only when the collections are empty ----
// title and footerTitle are rich text (HTML) with the green part as a span.
// The Arabic text is a translation. Have a native speaker check it.
const DEFAULT_SECTION: {
  watermark: ILocalizedString;
  title: ILocalizedString;
  description: ILocalizedString;
  footerTitle: ILocalizedString;
  footerNote: ILocalizedString;
  footerIcon: IndustryIcon;
} = {
  watermark: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
  title: {
    en: `Industries We <span ${GREEN}>Serve</span>`,
    ar: `القطاعات <span ${GREEN}>التي نخدمها</span>`,
  },
  description: {
    en: "Whatever your business sells or ships, the books, tax, and compliance behind it follow the same UAE rules. We work with B2B companies across every sector, and wherever you are in the journey, the engagement fits.",
    ar: "أيًّا كان ما تبيعه أعمالك أو تشحنه، فإن الدفاتر والضرائب والامتثال الكامن وراءه تخضع للقواعد نفسها في دولة الإمارات. نعمل مع شركات B2B في جميع القطاعات، وأينما كنت في رحلتك، فإن التعاقد معنا يناسبك.",
  },
  footerTitle: {
    en: `Ahmed Al Mazroei works across every licensed activity in <span ${GREEN}>the UAE, mainland and free zone.</span>`,
    ar: `يعمل أحمد المزروعي في جميع الأنشطة المرخّصة في <span ${GREEN}>دولة الإمارات، البر الرئيسي والمناطق الحرة.</span>`,
  },
  footerNote: {
    en: "If your industry is not listed above, it is still one we serve.",
    ar: "إذا لم يكن قطاعك مدرجًا أعلاه، فهو لا يزال من القطاعات التي نخدمها.",
  },
  footerIcon: "chart",
};

const DEFAULT_INDUSTRIES: {
  icon: IndustryIcon;
  title: ILocalizedString;
  desc: ILocalizedString;
}[] = [
  {
    icon: "government",
    title: {
      en: "Government & Semi-Government",
      ar: "الجهات الحكومية وشبه الحكومية",
    },
    desc: {
      en: "Audit, tax and advisory support tailored to government entities and semi-government organisations.",
      ar: "خدمات التدقيق والضرائب والاستشارات المصممة للجهات الحكومية والمؤسسات شبه الحكومية.",
    },
  },
  {
    icon: "building",
    title: { en: "Real Estate & Construction", ar: "العقارات والإنشاءات" },
    desc: {
      en: "Reliable assurance, accounting and compliance services for property developers and construction businesses.",
      ar: "خدمات تأكيد ومحاسبة وامتثال موثوقة لمطوري العقارات وشركات المقاولات.",
    },
  },
  {
    icon: "energy",
    title: { en: "Oil, Gas & Energy", ar: "النفط والغاز والطاقة" },
    desc: {
      en: "Strategic financial reporting, risk management and tax advisory for energy businesses.",
      ar: "تقارير مالية استراتيجية وإدارة للمخاطر واستشارات ضريبية لشركات الطاقة.",
    },
  },
  {
    icon: "truck",
    title: { en: "Trading & Distribution", ar: "التجارة والتوزيع" },
    desc: {
      en: "Practical audit, inventory and tax solutions that help trading businesses improve financial performance.",
      ar: "حلول عملية للتدقيق والمخزون والضرائب تساعد الشركات التجارية على تحسين أدائها المالي.",
    },
  },
  {
    icon: "heart",
    title: { en: "Healthcare", ar: "الرعاية الصحية" },
    desc: {
      en: "Financial clarity and compliance support for healthcare providers and medical organisations.",
      ar: "وضوح مالي ودعم للامتثال لمقدمي الرعاية الصحية والمؤسسات الطبية.",
    },
  },
  {
    icon: "globe",
    title: { en: "Hospitality & Tourism", ar: "الضيافة والسياحة" },
    desc: {
      en: "Accounting, assurance and advisory services for hotels, restaurants and tourism businesses.",
      ar: "خدمات المحاسبة والتأكيد والاستشارات للفنادق والمطاعم وشركات السياحة.",
    },
  },
  {
    icon: "gear",
    title: { en: "Manufacturing", ar: "التصنيع" },
    desc: {
      en: "Financial insights and risk management for manufacturers seeking operational efficiency.",
      ar: "رؤى مالية وإدارة للمخاطر للمصنّعين الساعين إلى الكفاءة التشغيلية.",
    },
  },
  {
    icon: "chip",
    title: { en: "Technology & Start-ups", ar: "التقنية والشركات الناشئة" },
    desc: {
      en: "Flexible financial and advisory services for growing technology companies and emerging businesses.",
      ar: "خدمات مالية واستشارية مرنة لشركات التقنية النامية والأعمال الناشئة.",
    },
  },
  {
    icon: "users",
    title: { en: "Family Businesses", ar: "الشركات العائلية" },
    desc: {
      en: "Trusted financial guidance to support sustainable growth, governance and long-term business continuity.",
      ar: "إرشاد مالي موثوق لدعم النمو المستدام والحوكمة واستمرارية الأعمال على المدى الطويل.",
    },
  },
  {
    icon: "hand",
    title: { en: "Non-Profit Organisations", ar: "المنظمات غير الربحية" },
    desc: {
      en: "Transparent reporting, audit and compliance services for non-profit and charitable organisations.",
      ar: "تقارير شفافة وخدمات تدقيق وامتثال للمنظمات غير الربحية والخيرية.",
    },
  },
];

const ensureDefaults = async (): Promise<void> => {
  if (!(await IndustriesSection.exists({}))) {
    await IndustriesSection.create({
      ...DEFAULT_SECTION,
      sectionBg: { en: [], ar: [] },
    });
  }
  if (!(await Industry.exists({}))) {
    await Industry.insertMany(
      DEFAULT_INDUSTRIES.map((x, i) => ({
        ...x,
        order: i,
        image: { en: [], ar: [] },
      })),
    );
  }
};

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

// Multipart sends nested objects as JSON strings. Parse them back.
const normalizeBody = (body: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
      try {
        out[key] = JSON.parse(value);
        continue;
      } catch {
        // not JSON, keep the raw value and let validation report it
      }
    }
    out[key] = value;
  }
  return out;
};

const toMedia = (items: IMedia[]) =>
  items.map((x) => ({ url: x.url, publicId: x.publicId }));

// GET /v1/api/industries (public)
// Returns the section and the industries sorted by order
export const getIndustries = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();

    const [section, items] = await Promise.all([
      IndustriesSection.findOne(),
      Industry.find().sort({ order: 1, createdAt: 1 }),
    ]);

    res.status(200).json({
      status: "success",
      data: { section, items },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/industries/section (admin, multipart/form-data)
// Uploading a background replaces the old one for that language
export const updateSection = async (req: Request, res: Response) => {
  try {
    const parsed = updateSectionSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    await ensureDefaults();
    const section = await IndustriesSection.findOne();
    if (!section) {
      res.status(404).json({ status: "error", message: "Section not found" });
      return;
    }

    section.set(parsed.data);

    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    for (const lang of LANGS) {
      const incoming = files?.[BG_FIELDS[lang]];
      if (!incoming?.length) continue;

      const current: IMedia[] = section.get(`sectionBg.${lang}`) ?? [];
      toDelete.push(...current.map((x) => x.publicId));

      const added = await uploadMany(incoming, SECTION_FOLDER, "image");
      section.set(`sectionBg.${lang}`, toMedia(added));
    }

    await section.save();
    await Promise.allSettled(
      toDelete.map((publicId) => deleteFromCloudinary(publicId, "image")),
    );

    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---- Industries ----

// POST /v1/api/industries/items (admin, multipart/form-data)
export const createIndustry = async (req: Request, res: Response) => {
  try {
    const parsed = createIndustrySchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const image = {
      en: await uploadMany(files?.[IMAGE_FIELDS.en], ITEM_FOLDER, "image"),
      ar: await uploadMany(files?.[IMAGE_FIELDS.ar], ITEM_FOLDER, "image"),
    };

    const item = await Industry.create({
      ...parsed.data,
      image: { en: toMedia(image.en), ar: toMedia(image.ar) },
    });

    res.status(201).json({ status: "success", data: item });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/industries/items/:id (admin, multipart/form-data)
// New images are added. removePublicIds deletes existing images.
export const updateIndustry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid industry id" });
      return;
    }

    const parsed = updateIndustrySchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const item = await Industry.findById(id);
    if (!item) {
      res.status(404).json({ status: "error", message: "Industry not found" });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    item.set(fields);

    for (const lang of LANGS) {
      const current: IMedia[] = item.get(`image.${lang}`) ?? [];

      toDelete.push(
        ...current
          .filter((x) => removePublicIds.includes(x.publicId))
          .map((x) => x.publicId),
      );
      const keep = current.filter((x) => !removePublicIds.includes(x.publicId));

      const added = await uploadMany(files?.[IMAGE_FIELDS[lang]], ITEM_FOLDER, "image");
      item.set(`image.${lang}`, toMedia([...keep, ...added]));
    }

    await item.save();
    await Promise.allSettled(
      toDelete.map((publicId) => deleteFromCloudinary(publicId, "image")),
    );

    res.status(200).json({ status: "success", data: item });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /v1/api/industries/items/:id (admin, also deletes images from Cloudinary)
export const deleteIndustry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid industry id" });
      return;
    }

    const item = await Industry.findByIdAndDelete(id);
    if (!item) {
      res.status(404).json({ status: "error", message: "Industry not found" });
      return;
    }

    const jobs = [...item.image.en, ...item.image.ar].map((x) =>
      deleteFromCloudinary(x.publicId, "image"),
    );
    await Promise.allSettled(jobs);

    res.status(200).json({ status: "success", message: "Industry deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
