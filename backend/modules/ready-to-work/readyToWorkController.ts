import { Request, Response } from "express";
import mongoose from "mongoose";
import { ReadyToWorkSection, ReadyToWorkFeature } from "./readyToWork.model";
import {
  updateSectionSchema,
  createFeatureSchema,
  updateFeatureSchema,
} from "./readyToWork.validation";
import { IMedia, ILocalizedString } from "./readyToWork.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

type Lang = "en" | "ar";
const LANGS: Lang[] = ["en", "ar"];

const FOLDER = "audit-website/ready-to-work/background";
const BG_FIELDS: Record<Lang, string> = { en: "bgImageEn", ar: "bgImageAr" };

// ---- Default content, inserted only when the collections are empty ----
// The Arabic text is a translation. Have a native speaker check it.
// buttonHref is a placeholder. Set the real link in the admin.
const DEFAULT_SECTION: {
  title: ILocalizedString;
  highlight: ILocalizedString;
  description: ILocalizedString;
  buttonLabel: ILocalizedString;
  buttonHref: string;
  tagOne: ILocalizedString;
  tagTwo: ILocalizedString;
} = {
  title: { en: "Ready to Work", ar: "جاهز للعمل مع" },
  highlight: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
  description: {
    en: "Tell us about your business, your accounting needs, and where you need support. Our team will help you identify the right services for your business.",
    ar: "أخبرنا عن عملك واحتياجاتك المحاسبية والمجالات التي تحتاج فيها إلى الدعم. سيساعدك فريقنا على تحديد الخدمات المناسبة لعملك.",
  },
  buttonLabel: { en: "Book a Consultation", ar: "احجز استشارة" },
  buttonHref: "/contact",
  tagOne: { en: "Private Consultation", ar: "استشارة خاصة" },
  tagTwo: { en: "Tailored Advice", ar: "نصائح مخصصة" },
};

const DEFAULT_FEATURES = [
  {
    icon: "users" as const,
    label: { en: "Trusted by Businesses", ar: "موثوق من الشركات" },
  },
  {
    icon: "shield" as const,
    label: { en: "Expert Guidance", ar: "إرشاد الخبراء" },
  },
  {
    icon: "chart" as const,
    label: { en: "Tailored Solutions", ar: "حلول مخصصة" },
  },
  {
    icon: "clock" as const,
    label: { en: "Responsive Support", ar: "دعم سريع الاستجابة" },
  },
];

const ensureDefaults = async (): Promise<void> => {
  if (!(await ReadyToWorkSection.exists({}))) {
    await ReadyToWorkSection.create({
      ...DEFAULT_SECTION,
      bgImage: { en: [], ar: [] },
    });
  }
  if (!(await ReadyToWorkFeature.exists({}))) {
    await ReadyToWorkFeature.insertMany(
      DEFAULT_FEATURES.map((f, i) => ({ ...f, order: i })),
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

// GET /v1/api/ready-to-work (public)
// Returns the section and the feature cards sorted by order
export const getReadyToWork = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();

    const [section, features] = await Promise.all([
      ReadyToWorkSection.findOne(),
      ReadyToWorkFeature.find().sort({ order: 1, createdAt: 1 }),
    ]);

    res.status(200).json({
      status: "success",
      data: { section, features },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/ready-to-work/section (admin, multipart/form-data)
// Uploading a background replaces the old one for that language
export const updateSection = async (req: Request, res: Response) => {
  try {
    const parsed = updateSectionSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    await ensureDefaults();
    const section = await ReadyToWorkSection.findOne();
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

      const current: IMedia[] = section.get(`bgImage.${lang}`) ?? [];
      toDelete.push(...current.map((x) => x.publicId));

      const added = await uploadMany(incoming, FOLDER, "image");
      section.set(`bgImage.${lang}`, toMedia(added));
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

// ---- Features ----

// POST /v1/api/ready-to-work/features (admin)
export const createFeature = async (req: Request, res: Response) => {
  try {
    const parsed = createFeatureSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const feature = await ReadyToWorkFeature.create(parsed.data);
    res.status(201).json({ status: "success", data: feature });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/ready-to-work/features/:id (admin)
export const updateFeature = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid feature id" });
      return;
    }

    const parsed = updateFeatureSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const feature = await ReadyToWorkFeature.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });
    if (!feature) {
      res.status(404).json({ status: "error", message: "Feature not found" });
      return;
    }

    res.status(200).json({ status: "success", data: feature });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /v1/api/ready-to-work/features/:id (admin)
export const deleteFeature = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid feature id" });
      return;
    }

    const feature = await ReadyToWorkFeature.findByIdAndDelete(id);
    if (!feature) {
      res.status(404).json({ status: "error", message: "Feature not found" });
      return;
    }

    res.status(200).json({ status: "success", message: "Feature deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
