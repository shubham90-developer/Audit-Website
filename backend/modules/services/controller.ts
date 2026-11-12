import { Request, Response } from "express";
import { WhatWeDo } from "./model";
import { updateWhatWeDoSchema, itemsInputSchema } from "./validation";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const FOLDER = "audit-website/what-we-do";
const LANGS = ["en", "ar"] as const;

const emptyImage = {
  en: { url: "", publicId: "" },
  ar: { url: "", publicId: "" },
};

// Used when there is no "What We Do" data in the database yet
const DEFAULT_WHAT_WE_DO = {
  label: { en: "What We Do", ar: "ماذا نقدم" },
  heading: {
    en: "Complete Financial Services Under One Roof",
    ar: "خدمات مالية متكاملة تحت سقف واحد",
  },
  items: [
    {
      title: { en: "Audit & Assurance", ar: "التدقيق والتأكيد" },
      description: {
        en: "Independent audits that confirm your financial statements are accurate, complete and compliant.",
        ar: "عمليات تدقيق مستقلة تؤكد أن بياناتك المالية دقيقة وكاملة ومتوافقة مع المتطلبات.",
      },
      image: emptyImage,
    },
    {
      title: { en: "Tax Services", ar: "الخدمات الضريبية" },
      description: {
        en: "Corporate Tax, VAT and transfer pricing support to keep you compliant and tax-efficient.",
        ar: "دعم ضريبة الشركات وضريبة القيمة المضافة والتسعير التحويلي لتبقى ملتزماً وكفؤاً ضريبياً.",
      },
      image: emptyImage,
    },
    {
      title: { en: "Advisory Services", ar: "الخدمات الاستشارية" },
      description: {
        en: "Stronger controls, better governance and smarter risk management for your business.",
        ar: "ضوابط أقوى وحوكمة أفضل وإدارة أذكى للمخاطر لأعمالك.",
      },
      image: emptyImage,
    },
    {
      title: { en: "Consulting Services", ar: "خدمات الاستشارات" },
      description: {
        en: "Valuation, mergers and acquisitions, financial models and IT audit to support major decisions.",
        ar: "التقييم والاندماج والاستحواذ والنماذج المالية وتدقيق تقنية المعلومات لدعم القرارات الكبرى.",
      },
      image: emptyImage,
    },
    {
      title: { en: "Accounting & Other Services", ar: "المحاسبة وخدمات أخرى" },
      description: {
        en: "Bookkeeping, outsourced CFO, litigation support and specialised audits.",
        ar: "مسك الدفاتر ومدير مالي خارجي ودعم التقاضي وعمليات تدقيق متخصصة.",
      },
      image: emptyImage,
    },
  ],
};

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

// returns the data, creating the default one if none exists
const getOrCreate = async () => {
  const existing = await WhatWeDo.findOne();
  if (existing) return existing;
  return WhatWeDo.create(DEFAULT_WHAT_WE_DO);
};

// GET /api/what-we-do
export const getWhatWeDo = async (_req: Request, res: Response) => {
  try {
    const data = await getOrCreate();
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /api/what-we-do  (multipart/form-data)
// text:  label[en], label[ar], heading[en], heading[ar]
//        items[0][title][en], items[0][title][ar], items[0][description][en] ...
//        (the number in items[N] = position of the card, starting at 0)
// files: item1ImageEn, item1ImageAr ... item5ImageEn, item5ImageAr
//        (item1 = first card). A new file replaces the old image.
export const updateWhatWeDo = async (req: Request, res: Response) => {
  try {
    const top = updateWhatWeDoSchema.safeParse({ ...req.body });
    if (!top.success) {
      res.status(400).json({ status: "error", message: zodMessage(top.error) });
      return;
    }

    // Object.entries skips empty slots if the body parser built a sparse array
    const rawItems = Object.fromEntries(Object.entries(req.body.items ?? {}));
    const itemsParsed = itemsInputSchema.safeParse(rawItems);
    if (!itemsParsed.success) {
      res
        .status(400)
        .json({ status: "error", message: zodMessage(itemsParsed.error) });
      return;
    }

    const doc = await getOrCreate();
    const total = doc.items.length;

    // text changes
    doc.set(top.data);
    for (const [key, text] of Object.entries(itemsParsed.data)) {
      const index = Number(key);
      if (index >= total) {
        res
          .status(400)
          .json({ status: "error", message: `items[${index}] does not exist` });
        return;
      }
      if (text.title) doc.set(`items.${index}.title`, text.title);
      if (text.description)
        doc.set(`items.${index}.description`, text.description);
    }

    // image changes
    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    for (let i = 0; i < total; i++) {
      for (const lang of LANGS) {
        const field = `item${i + 1}Image${lang === "en" ? "En" : "Ar"}`; // e.g. item1ImageEn
        const file = files?.[field]?.[0];
        if (!file) continue;

        const [uploaded] = await uploadMany([file], FOLDER, "image");

        const oldPublicId: string = doc.get(
          `items.${i}.image.${lang}.publicId`,
        );
        if (oldPublicId) toDelete.push(oldPublicId);

        doc.set(`items.${i}.image.${lang}`, {
          url: uploaded.url,
          publicId: uploaded.publicId,
        });
      }
    }

    await doc.save();
    await Promise.allSettled(
      toDelete.map((p) => deleteFromCloudinary(p, "image")),
    );

    res.status(200).json({ status: "success", data: doc });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
