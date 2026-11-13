import { Request, Response } from "express";
import mongoose from "mongoose";
import { Partner } from "./partnership.model";
import {
  createPartnerSchema,
  updatePartnerSchema,
} from "./partnership.validation";
import { IMedia, ILocalizedString } from "./partnership.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const LANGS = ["en", "ar"] as const;
const FOLDER = "audit-website/partners/logos";
const LOGO_FIELDS = { en: "logoEn", ar: "logoAr" } as const;

// Default partners, inserted only when the collection is empty
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
  if (exists) return;

  await Partner.insertMany(
    DEFAULT_PARTNERS.map((p, i) => ({
      ...p,
      order: i,
      logo: { en: [], ar: [] },
    })),
  );
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

// GET /v1/api/partners (public)
// Creates the default partners first if the collection is empty
export const getPartnershipData = async (_req: Request, res: Response) => {
  try {
    await ensureDefaultPartners();

    const partners = await Partner.find().sort({ order: 1, createdAt: 1 });
    res
      .status(200)
      .json({ status: "success", results: partners.length, data: partners });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// POST /v1/api/partners (admin, multipart/form-data)
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

// PATCH /v1/api/partners/:id (admin, multipart/form-data)
// New logos are added. removePublicIds deletes existing logos.
export const updatePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid partner id" });
      return;
    }

    const parsed = updatePartnerSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const partner = await Partner.findById(id);
    if (!partner) {
      res.status(404).json({ status: "error", message: "Partner not found" });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    partner.set(fields);

    for (const lang of LANGS) {
      const current: IMedia[] = partner.get(`logo.${lang}`) ?? [];

      toDelete.push(
        ...current
          .filter((x) => removePublicIds.includes(x.publicId))
          .map((x) => x.publicId),
      );
      const keep = current.filter((x) => !removePublicIds.includes(x.publicId));

      const added = await uploadMany(files?.[LOGO_FIELDS[lang]], FOLDER, "image");
      partner.set(`logo.${lang}`, toMedia([...keep, ...added]));
    }

    await partner.save();
    await Promise.allSettled(
      toDelete.map((publicId) => deleteFromCloudinary(publicId, "image")),
    );

    res.status(200).json({ status: "success", data: partner });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /v1/api/partners/:id (admin, also deletes logos from Cloudinary)
export const deletePartner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid partner id" });
      return;
    }

    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
      res.status(404).json({ status: "error", message: "Partner not found" });
      return;
    }

    const jobs = [...partner.logo.en, ...partner.logo.ar].map((x) =>
      deleteFromCloudinary(x.publicId, "image"),
    );
    await Promise.allSettled(jobs);

    res.status(200).json({ status: "success", message: "Partner deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
