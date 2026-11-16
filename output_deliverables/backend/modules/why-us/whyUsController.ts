import { Request, Response } from "express";
import mongoose from "mongoose";
import { WhyUsSection, WhyUsCard } from "./whyUs.model";
import { updateWhyUsSectionSchema, createWhyUsCardSchema, updateWhyUsCardSchema } from "./whyUs.validation";
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
  label: { en: "Why Choose Us", ar: "لماذا تختارنا" },
  title: { en: "What Makes Us Different", ar: "ما الذي يميزنا" },
  watermark: { en: "Why Choose Us", ar: "لماذا تختارنا" },
  centerImage: {
    en: [{ url: "/img/banner/10.jpg", publicId: "" }],
    ar: [{ url: "/img/banner/10.jpg", publicId: "" }],
  },
};

const DEFAULT_CARDS = [
  {
    title: { en: "Experience Since 2000", ar: "خبرة منذ عام 2000" },
    text: { en: "More than 25 years serving UAE businesses of every size.", ar: "أكثر من 25 عامًا في خدمة الشركات في الإمارات بمختلف أحجامها." },
    icon: "book",
    side: "left" as const,
    order: 0,
  },
  {
    title: { en: "Emirati-Owned", ar: "ملكية إماراتية 100%" },
    text: { en: "A local firm that understands UAE laws, authorities and business culture.", ar: "شركة محلية تفهم القوانين والجهات الرسمية وثقافة الأعمال في الإمارات." },
    icon: "users",
    side: "left" as const,
    order: 1,
  },
  {
    title: { en: "Senior-Level Attention", ar: "اهتمام على مستوى القيادة" },
    text: { en: "Experienced professionals lead every assignment from start to finish.", ar: "خبراء متمرسون يقودون كل مهمة من البداية وحتى الإنجاز." },
    icon: "clock",
    side: "left" as const,
    order: 2,
  },
  {
    title: { en: "Independent & Objective", ar: "استقلالية وموضوعية" },
    text: { en: "Honest opinions you can rely on, with no conflict of interest.", ar: "آراء نزيهة يمكنك الاعتماد عليها دون أي تعارض في المصالح." },
    icon: "shield",
    side: "right" as const,
    order: 3,
  },
  {
    title: { en: "Clear, Fixed Fees", ar: "أتعاب واضحة وثابتة" },
    text: { en: "Agreed upfront in writing. No surprises.", ar: "يتم الاتفاق عليها مسبقًا وبشكل خطي دون أي مفاجآت." },
    icon: "monitor",
    side: "right" as const,
    order: 4,
  },
  {
    title: { en: "Customized Advice", ar: "استشارات مخصصة" },
    text: { en: "Tailored solutions addressing the specific challenges of your industry.", ar: "حلول مخصصة تلبي التحديات الخاصة بقطاع أعمالك." },
    icon: "message",
    side: "right" as const,
    order: 5,
  },
];

export const ensureDefaultWhyUs = async (): Promise<void> => {
  const sectionExists = await WhyUsSection.exists({});
  if (!sectionExists) {
    await WhyUsSection.create(DEFAULT_SECTION);
  }

  const cardsCount = await WhyUsCard.countDocuments();
  if (cardsCount === 0) {
    await WhyUsCard.insertMany(DEFAULT_CARDS);
  }
};

export const getWhyUsData = async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultWhyUs();
    const section = await WhyUsSection.findOne();
    const cards = await WhyUsCard.find().sort({ order: 1 });
    res.status(200).json({
      status: "success",
      data: {
        section,
        cards,
        features: cards,
        title: section?.title,
        subTitle: section?.label,
        desc: section?.watermark,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateWhyUsSection = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultWhyUs();
    let section = await WhyUsSection.findOne();
    if (!section) section = await WhyUsSection.create(DEFAULT_SECTION);

    const parsed = updateWhyUsSectionSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    section.set(fields);

    const files = req.files as Record<string, any[]> | undefined;
    for (const lang of ["en", "ar"] as const) {
      const fieldName = lang === "en" ? "centerImageEn" : "centerImageAr";
      const currentList = (section.get("centerImage." + lang) || []) as any[];
      const keep = currentList.filter((item: any) => !removePublicIds.includes(item.publicId));

      const uploaded = await uploadMany(files?.[fieldName], "audit-website/why-us", "image");
      if (uploaded.length > 0) {
        section.set("centerImage." + lang, [...keep, ...uploaded]);
      } else if (removePublicIds.length > 0) {
        section.set("centerImage." + lang, keep);
      }
    }

    await section.save();
    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createWhyUsCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createWhyUsCardSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }
    const card = await WhyUsCard.create(parsed.data);
    res.status(201).json({ status: "success", data: card });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateWhyUsCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid ID" });
      return;
    }
    const parsed = updateWhyUsCardSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }
    const card = await WhyUsCard.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!card) {
      res.status(404).json({ status: "error", message: "Card not found" });
      return;
    }
    res.status(200).json({ status: "success", data: card });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteWhyUsCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid ID" });
      return;
    }
    await WhyUsCard.findByIdAndDelete(id);
    res.status(200).json({ status: "success", message: "Card deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
