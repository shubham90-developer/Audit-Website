import { Request, Response } from "express";
import mongoose from "mongoose";
import { Partner, PartnerSection } from "./partnership.model";
import {
  createPartnerSchema,
  updatePartnerSchema,
} from "./partnership.validation";
import { IMedia, ILocalizedString } from "./partnership.interface";
import { uploadMany } from "../../middlewares/upload";
import { uploadBuffer, deleteMedia } from "../../utils/cloudinary";

const LANGS = ["en", "ar"] as const;
const FOLDER = "audit-website/partners/logos";
const LOGO_FIELDS = { en: "logoEn", ar: "logoAr" } as const;

const DEFAULT_SECTION = {
  title: { en: "Recognition, Accreditations &", ar: "الاعتراف والاعتمادات و" },
  colorTitle: { en: "Partnership", ar: "الشراكة" },
  subtitle: { en: "The approvals and registrations behind the work.", ar: "الموافقات والتسجيلات وراء العمل المنجز." },
  watermark: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
  bgImage: { url: "/img/banner/bg1.avif", publicId: "default" },
};

const DEFAULT_PARTNERS: { title: ILocalizedString; text: ILocalizedString }[] = [
  {
    title: { en: "FTA Approved Tax Agency", ar: "وكالة ضريبية معتمدة من الهيئة الاتحادية للضرائب" },
    text: { en: "Registered Tax Agency · No. 30008692", ar: "وكالة ضريبية مسجلة · رقم 30008692" },
  },
  {
    title: { en: "RAKEZ Appreciation Certificate", ar: "شهادة تقدير من RAKEZ" },
    text: { en: "Recognised for Excellence in Partner Performance", ar: "معترف بها للتميز في أداء الشركاء" },
  },
  {
    title: { en: "IFZA Gold Tier Partner Recognition", ar: "تقدير شريك IFZA من الفئة الذهبية" },
    text: { en: "Gold Tier Recognition · Elite Loyalty Programme", ar: "تقدير الفئة الذهبية · برنامج الولاء النخبوي" },
  },
  {
    title: { en: "Accounting Software Experience", ar: "خبرة في برامج المحاسبة" },
    text: { en: "Hands-on Experience Across Leading Accounting Platforms", ar: "خبرة عملية في أبرز منصات المحاسبة" },
  },
  {
    title: { en: "ACCA Approved Employer", ar: "جهة توظيف معتمدة من ACCA" },
    text: { en: "Trainee & Professional Development · ID 29477922", ar: "تدريب وتطوير مهني · المعرّف 29477922" },
  },
  {
    title: { en: "ICAEW Approved Employer", ar: "جهة توظيف معتمدة من ICAEW" },
    text: { en: "Supporting Professional Training and Development", ar: "دعم التدريب والتطوير المهني" },
  },
  {
    title: { en: "KIZAD", ar: "KIZAD" },
    text: { en: "Business Setup Partner in Abu Dhabi", ar: "شريك تأسيس الأعمال في أبوظبي" },
  },
  {
    title: { en: "Meydan Free Zone", ar: "المنطقة الحرة في ميدان" },
    text: { en: "Company Formation Partner in Dubai", ar: "شريك تأسيس الشركات في دبي" },
  },
];

const ensureDefaultPartners = async (): Promise<void> => {
  const exists = await Partner.exists({});
  if (!exists) {
    await Partner.insertMany(
      DEFAULT_PARTNERS.map((p, i) => ({
        ...p,
        order: i,
        logo: {
          en: [{ url: `/img/partners/${i + 1}.${i === 3 ? "svg" : i === 0 || i === 6 || i === 7 ? "webp" : "avif"}`, publicId: "default" }],
          ar: [{ url: `/img/partners/${i + 1}.${i === 3 ? "svg" : i === 0 || i === 6 || i === 7 ? "webp" : "avif"}`, publicId: "default" }],
        },
      })),
    );
  }

  const sectionExists = await PartnerSection.exists({});
  if (!sectionExists) {
    await PartnerSection.create(DEFAULT_SECTION);
  }
};

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

const normalizeBody = (body: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
      try {
        out[key] = JSON.parse(value);
        continue;
      } catch {
        // not JSON
      }
    }
    out[key] = value;
  }
  return out;
};

const toMedia = (items: IMedia[]) =>
  items.map((x) => ({ url: x.url, publicId: x.publicId }));

export const getPartnershipSection = async (_req: Request, res: Response) => {
  try {
    await ensureDefaultPartners();
    const section = await PartnerSection.findOne();
    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updatePartnershipSection = async (req: Request, res: Response) => {
  try {
    let payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
    const existing = await PartnerSection.findOne();

    if (req.file) {
      if (existing?.bgImage?.publicId && existing.bgImage.publicId !== "default") {
        await deleteMedia(existing.bgImage.publicId);
      }
      const up = await uploadBuffer(req.file.buffer, "partners");
      payload.bgImage = { url: up.secure_url, publicId: up.public_id };
    }

    const updated = await PartnerSection.findOneAndUpdate({}, payload, { new: true, upsert: true });
    res.status(200).json({ status: "success", data: updated });
  } catch (error: any) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const getPartnershipData = async (_req: Request, res: Response) => {
  try {
    await ensureDefaultPartners();
    const partners = await Partner.find().sort({ order: 1, createdAt: 1 });
    const section = await PartnerSection.findOne();
    res.status(200).json({
      status: "success",
      results: partners.length,
      section,
      data: partners,
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createPartner = async (req: Request, res: Response) => {
  try {
    const parsed = createPartnerSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const logo = {
      en: await uploadMany(files?.[LOGO_FIELDS.en], FOLDER, "image"),
      ar: await uploadMany(files?.[LOGO_FIELDS.ar], FOLDER, "image"),
    };

    const partner = await Partner.create({
      ...parsed.data,
      logo: { en: toMedia(logo.en), ar: toMedia(logo.ar) },
    });

    res.status(201).json({ status: "success", data: partner });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid id" });
      return;
    }

    const partner = await Partner.findById(id);
    if (!partner) {
      res.status(404).json({ status: "error", message: "Partner not found" });
      return;
    }

    const parsed = updatePartnerSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    for (const lang of LANGS) {
      const field = LOGO_FIELDS[lang];
      if (files?.[field]?.length) {
        for (const x of partner.logo[lang]) {
          if (x.publicId && x.publicId !== "default") {
            await deleteMedia(x.publicId, "image");
          }
        }
        const uploaded = await uploadMany(files[field], FOLDER, "image");
        partner.logo[lang] = toMedia(uploaded);
      }
    }

    if (parsed.data.title) partner.title = parsed.data.title;
    if (parsed.data.text) partner.text = parsed.data.text;
    if (parsed.data.order !== undefined) partner.order = parsed.data.order;

    await partner.save();
    res.status(200).json({ status: "success", data: partner });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deletePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid id" });
      return;
    }

    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
      res.status(404).json({ status: "error", message: "Partner not found" });
      return;
    }

    const ids = [...partner.logo.en, ...partner.logo.ar].map((x) => x.publicId).filter((p) => p !== "default");
    for (const idToDel of ids) {
      await deleteMedia(idToDel, "image");
    }

    res.status(200).json({ status: "success", message: "Partner deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
