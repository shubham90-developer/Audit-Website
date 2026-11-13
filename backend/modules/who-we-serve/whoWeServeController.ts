import { Request, Response } from "express";
import mongoose from "mongoose";
import { WhoWeServeSection, WhoWeServeCard } from "./whoWeServe.model";
import {
  updateSectionSchema,
  createCardSchema,
  updateCardSchema,
} from "./whoWeServe.validation";
import {
  IMedia,
  ILocalizedString,
  CardKind,
} from "./whoWeServe.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const LANGS = ["en", "ar"] as const;
const SECTION_FOLDER = "audit-website/who-we-serve/section";
const CARD_FOLDER = "audit-website/who-we-serve/cards";
const SECTION_BG_FIELDS = { en: "leftBgEn", ar: "leftBgAr" } as const;
const CARD_IMAGE_FIELDS = { en: "imageEn", ar: "imageAr" } as const;

// ---- Default content, inserted only when the collections are empty ----
// The Arabic text is a translation. Have a native speaker check it.
const DEFAULT_SECTION: {
  pillTitle: ILocalizedString;
  pillHighlight: ILocalizedString;
  whyTitle: ILocalizedString;
  brandName: ILocalizedString;
  whyIntroStart: ILocalizedString;
  whyIntroBold: ILocalizedString;
  whyIntroEnd: ILocalizedString;
} = {
  pillTitle: { en: "Who We", ar: "من" },
  pillHighlight: { en: "Serve", ar: "نخدم" },
  whyTitle: { en: "Why Businesses Choose", ar: "لماذا تختار الشركات" },
  brandName: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
  whyIntroStart: { en: "We are one of the", ar: "نحن إحدى" },
  whyIntroBold: {
    en: "chartered accountant firms in Dubai",
    ar: "مكاتب المحاسبة القانونية المعتمدة في دبي",
  },
  whyIntroEnd: {
    en: "that also holds FTA tax agency approval. The books, the tax filings and the audit file come from one team. Nothing is translated, re-entered, or lost between providers.",
    ar: "والتي تحمل أيضًا اعتماد وكالة ضريبية من الهيئة الاتحادية للضرائب. تأتي الدفاتر والإقرارات الضريبية وملف التدقيق من فريق واحد، ولا يُترجم شيء أو يُعاد إدخاله أو يُفقد بين المزودين.",
  },
};

const DEFAULT_CARDS: {
  kind: CardKind;
  title: ILocalizedString;
  text: ILocalizedString;
}[] = [
  {
    kind: "serve",
    title: { en: "Multinational Groups", ar: "المجموعات متعددة الجنسيات" },
    text: {
      en: "Transfer pricing documentation, consolidated group reporting and treaty positions. IFRS output your auditors accept without rework.",
      ar: "توثيق أسعار التحويل، والتقارير المجمّعة للمجموعة، ومواقف الاتفاقيات الضريبية. مخرجات IFRS يقبلها مدققو حساباتك دون إعادة عمل.",
    },
  },
  {
    kind: "serve",
    title: { en: "Business Setup & New Entrants", ar: "تأسيس الأعمال والوافدون الجدد" },
    text: {
      en: "Mainland or free zone, chosen on the tax outcome and not the licence price. Formation, visas, banking and your first filings.",
      ar: "البر الرئيسي أو المنطقة الحرة، يُختار وفق النتيجة الضريبية لا وفق سعر الرخصة. التأسيس والتأشيرات والخدمات البنكية وأولى الإقرارات.",
    },
  },
  {
    kind: "serve",
    title: { en: "Free Zone & QFZP", ar: "المنطقة الحرة وQFZP" },
    text: {
      en: "Whether you qualify for the 0% free zone rate, and what it takes to keep it. Income tested, substance documented and de minimis monitored.",
      ar: "ما إذا كنت مؤهلًا لمعدل 0% في المناطق الحرة، وما يلزم للحفاظ عليه. اختبار الدخل، وتوثيق الوجود الفعلي، ومراقبة الحد الأدنى غير الجوهري.",
    },
  },
  {
    kind: "serve",
    title: { en: "Individuals & Expats", ar: "الأفراد والمقيمون الأجانب" },
    text: {
      en: "Tax residency, TRC applications, wills registration and personal exposure across more than one jurisdiction. Filed with your company.",
      ar: "الإقامة الضريبية، وطلبات شهادة الإقامة الضريبية TRC، وتسجيل الوصايا، والتعرض الضريبي الشخصي عبر أكثر من دولة. يُقدَّم مع ملف شركتك.",
    },
  },
  {
    kind: "why",
    title: { en: "FTA Registered Tax Agency", ar: "وكالة ضريبية مسجلة لدى الهيئة الاتحادية للضرائب" },
    text: {
      en: "FTA Approved Tax Agency No. 30008692. If the authority raises a query or opens a tax audit, we represent you before them. You do not face the FTA alone.",
      ar: "وكالة ضريبية معتمدة من الهيئة الاتحادية للضرائب رقم 30008692. إذا طرحت الجهة استفسارًا أو فتحت تدقيقًا ضريبيًا، نمثلك أمامها. لن تواجه الهيئة وحدك.",
    },
  },
  {
    kind: "why",
    title: { en: "Approved Auditors", ar: "مدققون معتمدون" },
    text: {
      en: "Audit reports issued through our network of approved auditors, accepted by every UAE free zone authority, mainland licensing body and bank. We prepare the file, so the numbers already agree.",
      ar: "تُصدر تقارير التدقيق عبر شبكتنا من المدققين المعتمدين، والمقبولة لدى كل هيئات المناطق الحرة في الإمارات وجهات الترخيص في البر الرئيسي والبنوك. نُعد الملف بحيث تتطابق الأرقام منذ البداية.",
    },
  },
];

const ensureDefaults = async (): Promise<void> => {
  if (!(await WhoWeServeSection.exists({}))) {
    await WhoWeServeSection.create({
      ...DEFAULT_SECTION,
      leftBg: { en: [], ar: [] },
    });
  }
  if (!(await WhoWeServeCard.exists({}))) {
    await WhoWeServeCard.insertMany(
      DEFAULT_CARDS.map((c, i) => ({
        ...c,
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

// GET /v1/api/who-we-serve (public)
// Returns the section, the serve cards, and the why cards, each sorted by order
export const getWhoWeServe = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();

    const [section, cards] = await Promise.all([
      WhoWeServeSection.findOne(),
      WhoWeServeCard.find().sort({ order: 1, createdAt: 1 }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        section,
        serve: cards.filter((c) => c.kind === "serve"),
        why: cards.filter((c) => c.kind === "why"),
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/who-we-serve/section (admin, JSON or multipart)
// Uploading a new background replaces the old one for that language
export const updateSection = async (req: Request, res: Response) => {
  try {
    const parsed = updateSectionSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    await ensureDefaults();
    const section = await WhoWeServeSection.findOne();
    if (!section) {
      res.status(404).json({ status: "error", message: "Section not found" });
      return;
    }

    section.set(parsed.data);

    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    for (const lang of LANGS) {
      const incoming = files?.[SECTION_BG_FIELDS[lang]];
      if (!incoming?.length) continue;

      toDelete.push(...section.leftBg[lang].map((x) => x.publicId));
      const added = await uploadMany(incoming, SECTION_FOLDER, "image");
      section.set(`leftBg.${lang}`, toMedia(added));
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

// POST /v1/api/who-we-serve/cards (admin, multipart/form-data)
export const createCard = async (req: Request, res: Response) => {
  try {
    const parsed = createCardSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const image = {
      en: await uploadMany(files?.[CARD_IMAGE_FIELDS.en], CARD_FOLDER, "image"),
      ar: await uploadMany(files?.[CARD_IMAGE_FIELDS.ar], CARD_FOLDER, "image"),
    };

    const card = await WhoWeServeCard.create({
      ...parsed.data,
      image: { en: toMedia(image.en), ar: toMedia(image.ar) },
    });

    res.status(201).json({ status: "success", data: card });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/who-we-serve/cards/:id (admin, multipart/form-data)
// New images are added. removePublicIds deletes existing images.
export const updateCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid card id" });
      return;
    }

    const parsed = updateCardSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const card = await WhoWeServeCard.findById(id);
    if (!card) {
      res.status(404).json({ status: "error", message: "Card not found" });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    card.set(fields);

    for (const lang of LANGS) {
      const current: IMedia[] = card.get(`image.${lang}`) ?? [];

      toDelete.push(
        ...current
          .filter((x) => removePublicIds.includes(x.publicId))
          .map((x) => x.publicId),
      );
      const keep = current.filter((x) => !removePublicIds.includes(x.publicId));

      const added = await uploadMany(
        files?.[CARD_IMAGE_FIELDS[lang]],
        CARD_FOLDER,
        "image",
      );
      card.set(`image.${lang}`, toMedia([...keep, ...added]));
    }

    await card.save();
    await Promise.allSettled(
      toDelete.map((publicId) => deleteFromCloudinary(publicId, "image")),
    );

    res.status(200).json({ status: "success", data: card });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /v1/api/who-we-serve/cards/:id (admin, also deletes images from Cloudinary)
export const deleteCard = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid card id" });
      return;
    }

    const card = await WhoWeServeCard.findByIdAndDelete(id);
    if (!card) {
      res.status(404).json({ status: "error", message: "Card not found" });
      return;
    }

    const jobs = [...card.image.en, ...card.image.ar].map((x) =>
      deleteFromCloudinary(x.publicId, "image"),
    );
    await Promise.allSettled(jobs);

    res.status(200).json({ status: "success", message: "Card deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
