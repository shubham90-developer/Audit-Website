import { Request, Response } from "express";
import mongoose from "mongoose";
import { OurStorySection, OurStoryStep } from "./model";
import {
  updateSectionSchema,
  createStepSchema,
  updateStepSchema,
} from "./validation";
import { IMedia } from "./interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

type Lang = "en" | "ar";
const LANGS: Lang[] = ["en", "ar"];

const SECTION_FOLDER = "audit-website/our-story/section";
const STEP_FOLDER = "audit-website/our-story/steps";

// Upload field names, one per language
const BG_FIELDS: Record<Lang, string> = { en: "bgImageEn", ar: "bgImageAr" };
const AUTHOR_FIELDS: Record<Lang, string> = {
  en: "authorImageEn",
  ar: "authorImageAr",
};
const STEP_FIELDS: Record<Lang, string> = { en: "imageEn", ar: "imageAr" };

// ---- Default content, inserted only when the collections are empty ----
// Images with an empty publicId live in the frontend /public folder.
const DEFAULT_SECTION = {
  badge: { en: "OUR STORY", ar: "قصتنا ومسيرتنا" },
  narrative: {
    en: "The firm was founded in 2000 by Mr. Ahmed Al Mazroei with one goal: to give UAE businesses honest, high-quality audit services from a local firm they can trust. What started as an audit practice has grown into a full-service firm covering audit, tax, advisory and consulting. After more than 25 years, our values remain the same: integrity, quality and personal service.",
    ar: "تأسس المكتب في عام 2000 على يد السيد أحمد المزروعي بهدف واضح: تزويد مجتمع الأعمال في الإمارات بخدمات تدقيق ومحاسبة عالية الجودة تتسم بالأمانة والاحترافية من شركة محلية تحظى بثقتهم الكاملة. واليوم، وبعد أكثر من 25 عاماً من الريادة، لا تزال قيمنا الأساسية ثابتة: النزاهة التامة، والجودة الفائقة، والاهتمام الشخصي المباشر بكل عميل.",
  },
  bgImage: {
    en: [{ url: "/img/banner/bg9.avif", publicId: "" }],
    ar: [{ url: "/img/banner/bg9.avif", publicId: "" }],
  },
  quote: {
    en: "Our growth has never been about adding services for the sake of looking bigger. We add expertise when it solves a real problem for our clients.",
    ar: "لم يكن نمونا يوماً مجرد إضافة خدمات لزيادة الحجم، بل نضيف الخبرات التخصصية دائماً عندما تقدم حلاً حقيقياً وملموساً لتحديات عملائنا.",
  },
  authorName: {
    en: "Mr. Ahmed Al Mazroei, UAE-CA.",
    ar: "السيد أحمد المزروعي، محاسب قانوني إماراتي",
  },
  authorRole: {
    en: "Director of Accounting and Taxation",
    ar: "مدير المحاسبة والضرائب",
  },
  authorImage: {
    en: [{ url: "/img/banner/1.jpg", publicId: "" }],
    ar: [{ url: "/img/banner/1.jpg", publicId: "" }],
  },
};

const DEFAULT_STEPS = [
  {
    title: { en: "It Started With the Numbers", ar: "البداية كانت مع الأرقام" },
    text: {
      en: "Ahmed Al Mazroei began as an accounting and tax firm, helping businesses manage bookkeeping, financial reporting, tax filings and regulatory compliance.",
      ar: "بدأ المكتب بتقديم خدمات المحاسبة ومسك الدفاتر والتقارير المالية والامتثال الضريبي للشركات والمؤسسات المحلية.",
    },
    image: {
      en: [{ url: "/img/banner/1.jpg", publicId: "" }],
      ar: [{ url: "/img/banner/1.jpg", publicId: "" }],
    },
  },
  {
    title: {
      en: "Then the Questions Got Bigger",
      ar: "ثم توسعت طموحات عملائنا",
    },
    text: {
      en: "As our clients' businesses grew, their questions expanded beyond the numbers to company formation, business structuring, new regulations and entering new markets.",
      ar: "مع نمو أعمال عملائنا، امتدت استفساراتهم لتشمل هيكلة الشركات، التأسيس في المناطق الحرة، واستيفاء اللوائح المنظمة الجديدة.",
    },
    image: {
      en: [{ url: "/img/banner/2.jpg", publicId: "" }],
      ar: [{ url: "/img/banner/2.jpg", publicId: "" }],
    },
  },
  {
    title: {
      en: "Clients Needed More Than Accounting",
      ar: "الحاجة إلى حلول متكاملة",
    },
    text: {
      en: "Operating across different jurisdictions required support in accounting, tax, audit, corporate advisory and business setup through one integrated provider.",
      ar: "تطلب التوسع في أسواق متعددة الحصول على خدمات التدقيق والضرائب والاستشارات وتأسيس الشركات من شريك واحد متكامل وموثوق.",
    },
    image: {
      en: [{ url: "/img/banner/3.jpg", publicId: "" }],
      ar: [{ url: "/img/banner/3.jpg", publicId: "" }],
    },
  },
  {
    title: {
      en: "So We Built One Integrated Team",
      ar: "بناء فريق عمل متكامل عالمي",
    },
    text: {
      en: "To meet these growing needs, we expanded our team, our expertise and our presence across different countries, offering seamless cross-border financial advisory.",
      ar: "لمواكبة هذا التوسع، قمنا بتعزيز فريقنا بخبرات دولية رفيعة المستوى وحضور إقليمي وعالمي يقدم استشارات مالية عابرة للحدود.",
    },
    image: {
      en: [{ url: "/img/banner/4.jpg", publicId: "" }],
      ar: [{ url: "/img/banner/4.jpg", publicId: "" }],
    },
  },
];

const ensureDefaults = async (): Promise<void> => {
  if (!(await OurStorySection.exists({}))) {
    await OurStorySection.create(DEFAULT_SECTION);
  }
  if (!(await OurStoryStep.exists({}))) {
    await OurStoryStep.insertMany(
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

const toMedia = (items: { url: string; publicId?: string }[]): IMedia[] =>
  items.map((x) => ({ url: x.url, publicId: x.publicId ?? "" }));

// Default images have an empty publicId, so they are skipped
const mediaIds = (list: { publicId?: string }[] | undefined): string[] =>
  (list ?? []).map((x) => x.publicId ?? "").filter((id) => id !== "");

const deleteAll = (ids: string[]) =>
  Promise.allSettled(ids.map((id) => deleteFromCloudinary(id, "image")));

// GET /v1/api/our-story (public)
// Returns the section and the steps sorted by order
export const getOurStory = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();

    const [section, steps] = await Promise.all([
      OurStorySection.findOne(),
      OurStoryStep.find().sort({ order: 1, createdAt: 1 }),
    ]);

    res.status(200).json({
      status: "success",
      data: { section, steps },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/our-story/section (admin, multipart/form-data)
// A new image replaces the old one for that language
export const updateSection = async (req: Request, res: Response) => {
  try {
    const parsed = updateSectionSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res
        .status(400)
        .json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    await ensureDefaults();
    const section = await OurStorySection.findOne();
    if (!section) {
      res.status(404).json({ status: "error", message: "Section not found" });
      return;
    }

    section.set(parsed.data);

    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    const slots = [
      { field: "bgImage", names: BG_FIELDS },
      { field: "authorImage", names: AUTHOR_FIELDS },
    ];

    for (const slot of slots) {
      for (const lang of LANGS) {
        const incoming = files?.[slot.names[lang]];
        if (!incoming?.length) continue;

        const path = `${slot.field}.${lang}`;
        toDelete.push(...mediaIds(section.get(path)));

        const added = await uploadMany(incoming, SECTION_FOLDER, "image");
        section.set(path, toMedia(added));
      }
    }

    await section.save();
    await deleteAll(toDelete);

    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---- Steps ----

// POST /v1/api/our-story/steps (admin, multipart/form-data)
export const createStep = async (req: Request, res: Response) => {
  try {
    const parsed = createStepSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res
        .status(400)
        .json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const image = {
      en: await uploadMany(files?.[STEP_FIELDS.en], STEP_FOLDER, "image"),
      ar: await uploadMany(files?.[STEP_FIELDS.ar], STEP_FOLDER, "image"),
    };

    const step = await OurStoryStep.create({
      ...parsed.data,
      image: { en: toMedia(image.en), ar: toMedia(image.ar) },
    });

    res.status(201).json({ status: "success", data: step });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/our-story/steps/:id (admin, multipart/form-data)
// A new image replaces the old one for that language
export const updateStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid step id" });
      return;
    }

    const parsed = updateStepSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res
        .status(400)
        .json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const step = await OurStoryStep.findById(id);
    if (!step) {
      res.status(404).json({ status: "error", message: "Step not found" });
      return;
    }

    step.set(parsed.data);

    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    for (const lang of LANGS) {
      const incoming = files?.[STEP_FIELDS[lang]];
      if (!incoming?.length) continue;

      const path = `image.${lang}`;
      toDelete.push(...mediaIds(step.get(path)));

      const added = await uploadMany(incoming, STEP_FOLDER, "image");
      step.set(path, toMedia(added));
    }

    await step.save();
    await deleteAll(toDelete);

    res.status(200).json({ status: "success", data: step });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /v1/api/our-story/steps/:id (admin, also deletes its images from Cloudinary)
export const deleteStep = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid step id" });
      return;
    }

    const step = await OurStoryStep.findByIdAndDelete(id);
    if (!step) {
      res.status(404).json({ status: "error", message: "Step not found" });
      return;
    }

    await deleteAll([...mediaIds(step.image.en), ...mediaIds(step.image.ar)]);

    res.status(200).json({ status: "success", message: "Step deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
