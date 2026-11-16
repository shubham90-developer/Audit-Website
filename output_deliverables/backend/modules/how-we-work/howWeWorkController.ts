import { Request, Response } from "express";
import mongoose from "mongoose";
import { HowWeWorkSection, HowWeWorkStep } from "./howWeWork.model";
import {
  updateSectionSchema,
  createStepSchema,
  updateStepSchema,
} from "./howWeWork.validation";
import { IMedia, ILocalizedString } from "./howWeWork.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

type Lang = "en" | "ar";
const LANGS: Lang[] = ["en", "ar"];

const FOLDER = "audit-website/how-we-work/image";
const IMAGE_FIELDS: Record<Lang, string> = { en: "imageEn", ar: "imageAr" };

// ---- Default content, inserted only when the collections are empty ----
// The Arabic text is a translation. Have a native speaker check it.
const DEFAULT_SECTION: {
  title: ILocalizedString;
  colorTitle: ILocalizedString;
  subtitle: ILocalizedString;
  watermark: ILocalizedString;
} = {
  title: { en: "How We", ar: "كيف" },
  colorTitle: { en: "Work", ar: "نعمل" },
  subtitle: {
    en: "Simple, Clear and On Time",
    ar: "بسيط وواضح وفي الوقت المحدد",
  },
  watermark: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
};

const DEFAULT_STEPS = [
  {
    icon: "headset" as const,
    title: { en: "Talk to Us", ar: "تحدّث إلينا" },
    desc: {
      en: "A free first meeting to understand your needs.",
      ar: "اجتماع أول مجاني لفهم احتياجاتك.",
    },
  },
  {
    icon: "document" as const,
    title: { en: "Clear Proposal", ar: "عرض واضح" },
    desc: {
      en: "Scope, timeline and fixed fee agreed in writing.",
      ar: "يُتفق كتابةً على النطاق والجدول الزمني والأتعاب الثابتة.",
    },
  },
  {
    icon: "settings" as const,
    title: { en: "We Do the Work", ar: "ننفّذ العمل" },
    desc: {
      en: "Our team works with yours, on-site or online.",
      ar: "يعمل فريقنا مع فريقك، في موقعك أو عبر الإنترنت.",
    },
  },
  {
    icon: "shield" as const,
    title: { en: "Results & Support", ar: "النتائج والدعم" },
    desc: {
      en: "Clear report, practical advice and ongoing help.",
      ar: "تقرير واضح ونصائح عملية ودعم مستمر.",
    },
  },
];

const ensureDefaults = async (): Promise<void> => {
  if (!(await HowWeWorkSection.exists({}))) {
    await HowWeWorkSection.create({
      ...DEFAULT_SECTION,
      image: { en: [], ar: [] },
    });
  }
  if (!(await HowWeWorkStep.exists({}))) {
    await HowWeWorkStep.insertMany(
      DEFAULT_STEPS.map((s, i) => ({ ...s, order: i })),
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

// GET /v1/api/how-we-work (public)
// Returns the section and the steps sorted by order
export const getHowWeWork = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();

    const [section, steps] = await Promise.all([
      HowWeWorkSection.findOne(),
      HowWeWorkStep.find().sort({ order: 1, createdAt: 1 }),
    ]);

    res.status(200).json({
      status: "success",
      data: { section, steps },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/how-we-work/section (admin, multipart/form-data)
// Uploading a photo replaces the old one for that language
export const updateSection = async (req: Request, res: Response) => {
  try {
    const parsed = updateSectionSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    await ensureDefaults();
    const section = await HowWeWorkSection.findOne();
    if (!section) {
      res.status(404).json({ status: "error", message: "Section not found" });
      return;
    }

    section.set(parsed.data);

    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    for (const lang of LANGS) {
      const incoming = files?.[IMAGE_FIELDS[lang]];
      if (!incoming?.length) continue;

      const current: IMedia[] = section.get(`image.${lang}`) ?? [];
      toDelete.push(...current.map((x) => x.publicId));

      const added = await uploadMany(incoming, FOLDER, "image");
      section.set(`image.${lang}`, toMedia(added));
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

// ---- Steps ----

// POST /v1/api/how-we-work/steps (admin)
export const createStep = async (req: Request, res: Response) => {
  try {
    const parsed = createStepSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const step = await HowWeWorkStep.create(parsed.data);
    res.status(201).json({ status: "success", data: step });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/how-we-work/steps/:id (admin)
export const updateStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid step id" });
      return;
    }

    const parsed = updateStepSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const step = await HowWeWorkStep.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });
    if (!step) {
      res.status(404).json({ status: "error", message: "Step not found" });
      return;
    }

    res.status(200).json({ status: "success", data: step });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /v1/api/how-we-work/steps/:id (admin)
export const deleteStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid step id" });
      return;
    }

    const step = await HowWeWorkStep.findByIdAndDelete(id);
    if (!step) {
      res.status(404).json({ status: "error", message: "Step not found" });
      return;
    }

    res.status(200).json({ status: "success", message: "Step deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
