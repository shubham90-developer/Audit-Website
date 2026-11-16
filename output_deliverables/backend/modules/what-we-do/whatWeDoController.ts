import { Request, Response } from "express";
import mongoose from "mongoose";
import { WhatWeDoSection, WhatWeDoService } from "./whatWeDo.model";
import {
  updateSectionSchema,
  createServiceSchema,
  updateServiceSchema,
} from "./whatWeDo.validation";
import { IMedia, ILocalizedString } from "./whatWeDo.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const LANGS = ["en", "ar"] as const;
const FOLDER = "audit-website/what-we-do/images";
const IMAGE_FIELDS = { en: "imageEn", ar: "imageAr" } as const;

// ---- Default content, inserted only when the collection is empty ----
// Service names and descriptions are placeholders. Replace them in the admin.
const DEFAULT_SECTION: {
  title: ILocalizedString;
  colorTitle: ILocalizedString;
  subtitle: ILocalizedString;
  watermark: ILocalizedString;
} = {
  title: { en: "What We", ar: "ما" },
  colorTitle: { en: "Do", ar: "نقدّمه" },
  subtitle: {
    en: "Comprehensive financial and tax solutions tailored for your business growth.",
    ar: "حلول مالية وضريبية شاملة مصممة لدعم نمو أعمالك.",
  },
  watermark: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
};

const DEFAULT_SERVICES = [
  {
    icon: "shield" as const,
    name: { en: "Audit & Assurance", ar: "التدقيق والتأكيد" },
    desc: { en: "Placeholder description.", ar: "وصف مؤقت." },
    items: [
      { en: "Statutory audit", ar: "التدقيق القانوني" },
      { en: "Internal audit", ar: "التدقيق الداخلي" },
    ],
  },
  {
    icon: "percent" as const,
    name: { en: "VAT Services", ar: "خدمات ضريبة القيمة المضافة" },
    desc: { en: "Placeholder description.", ar: "وصف مؤقت." },
    items: [
      { en: "VAT registration", ar: "التسجيل في ضريبة القيمة المضافة" },
      { en: "VAT return filing", ar: "تقديم الإقرارات الضريبية" },
    ],
  },
  {
    icon: "briefcase" as const,
    name: { en: "Business Setup", ar: "تأسيس الأعمال" },
    desc: { en: "Placeholder description.", ar: "وصف مؤقت." },
    items: [
      { en: "Company formation", ar: "تأسيس الشركات" },
      { en: "Free zone licensing", ar: "ترخيص المناطق الحرة" },
    ],
  },
  {
    icon: "trending" as const,
    name: { en: "Accounting & Bookkeeping", ar: "المحاسبة ومسك الدفاتر" },
    desc: { en: "Placeholder description.", ar: "وصف مؤقت." },
    items: [
      { en: "Monthly bookkeeping", ar: "مسك الدفاتر شهريًا" },
      { en: "Financial statements", ar: "القوائم المالية" },
    ],
  },
  {
    icon: "book" as const,
    name: { en: "Corporate Tax", ar: "ضريبة الشركات" },
    desc: { en: "Placeholder description.", ar: "وصف مؤقت." },
    items: [
      { en: "Corporate tax registration", ar: "التسجيل في ضريبة الشركات" },
      { en: "Corporate tax filing", ar: "تقديم إقرار ضريبة الشركات" },
    ],
  },
];

const ensureDefaults = async (): Promise<void> => {
  if (!(await WhatWeDoSection.exists({}))) {
    await WhatWeDoSection.create(DEFAULT_SECTION);
  }
  if (!(await WhatWeDoService.exists({}))) {
    await WhatWeDoService.insertMany(
      DEFAULT_SERVICES.map((s, i) => ({
        ...s,
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

// GET /v1/api/what-we-do (public)
// Returns the section and the services sorted by order
export const getWhatWeDo = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();

    const [section, services] = await Promise.all([
      WhatWeDoSection.findOne(),
      WhatWeDoService.find().sort({ order: 1, createdAt: 1 }),
    ]);

    res.status(200).json({
      status: "success",
      data: { section, services },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/what-we-do/section (admin, JSON or multipart)
export const updateSection = async (req: Request, res: Response) => {
  try {
    const parsed = updateSectionSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    await ensureDefaults();
    const section = await WhatWeDoSection.findOne();
    if (!section) {
      res.status(404).json({ status: "error", message: "Section not found" });
      return;
    }

    section.set(parsed.data);
    await section.save();

    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// POST /v1/api/what-we-do/services (admin, multipart/form-data)
export const createService = async (req: Request, res: Response) => {
  try {
    const parsed = createServiceSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const image = {
      en: await uploadMany(files?.[IMAGE_FIELDS.en], FOLDER, "image"),
      ar: await uploadMany(files?.[IMAGE_FIELDS.ar], FOLDER, "image"),
    };

    const service = await WhatWeDoService.create({
      ...parsed.data,
      image: { en: toMedia(image.en), ar: toMedia(image.ar) },
    });

    res.status(201).json({ status: "success", data: service });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/what-we-do/services/:id (admin, multipart/form-data)
// New images are added. removePublicIds deletes existing images.
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid service id" });
      return;
    }

    const parsed = updateServiceSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const service = await WhatWeDoService.findById(id);
    if (!service) {
      res.status(404).json({ status: "error", message: "Service not found" });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    service.set(fields);

    for (const lang of LANGS) {
      const current: IMedia[] = service.get(`image.${lang}`) ?? [];

      toDelete.push(
        ...current
          .filter((x) => removePublicIds.includes(x.publicId))
          .map((x) => x.publicId),
      );
      const keep = current.filter((x) => !removePublicIds.includes(x.publicId));

      const added = await uploadMany(files?.[IMAGE_FIELDS[lang]], FOLDER, "image");
      service.set(`image.${lang}`, toMedia([...keep, ...added]));
    }

    await service.save();
    await Promise.allSettled(
      toDelete.map((publicId) => deleteFromCloudinary(publicId, "image")),
    );

    res.status(200).json({ status: "success", data: service });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /v1/api/what-we-do/services/:id (admin, also deletes images from Cloudinary)
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid service id" });
      return;
    }

    const service = await WhatWeDoService.findByIdAndDelete(id);
    if (!service) {
      res.status(404).json({ status: "error", message: "Service not found" });
      return;
    }

    const jobs = [...service.image.en, ...service.image.ar].map((x) =>
      deleteFromCloudinary(x.publicId, "image"),
    );
    await Promise.allSettled(jobs);

    res.status(200).json({ status: "success", message: "Service deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
