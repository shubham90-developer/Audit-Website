import { Request, Response } from "express";
import mongoose from "mongoose";
import { Banner } from "./banner.mode";
import { createBannerSchema, updateBannerSchema } from "./banner.validation";
import { IMedia, BannerTextData } from "./banner.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const LANGS = ["en", "ar"] as const;

// which multer field / Cloudinary folder / resource type belongs to each media key
const MEDIA = [
  {
    key: "bgImages",
    type: "image",
    folder: "audit-website/banner/images",
    fields: { en: "bgImagesEn", ar: "bgImagesAr" },
  },
  {
    key: "posterImage",
    type: "image",
    folder: "audit-website/banner/images",
    fields: { en: "posterImageEn", ar: "posterImageAr" },
  },
  {
    key: "bgVideos",
    type: "video",
    folder: "audit-website/banner/videos",
    fields: { en: "bgVideosEn", ar: "bgVideosAr" },
  },
] as const;

// Default content used when the collection is empty.
// Values come from the original hardcoded component. Media starts empty,
// so upload real images and videos through PATCH.
const DEFAULT_BANNER: BannerTextData = {
  establishmentYear: { en: "Established 1999", ar: "تأسست عام 1999" },

  titleHighlight: { en: "Expert Advice", ar: "نصائح الخبراء" },
  titleRest: { en: "to Help You Grow", ar: "لمساعدتك على النمو" },
  intro: {
    en: "Independent audit, accounting and tax services for businesses across the UAE, from an Emirati firm with more than 25 years of experience.",
    ar: "خدمات تدقيق ومحاسبة وضرائب مستقلة للشركات في جميع أنحاء الإمارات، من شركة إماراتية تتمتع بخبرة تزيد عن 25 عامًا.",
  },
  speakLabel: {
    en: "— Speak Directly with an Expert —",
    ar: "— تحدّث مباشرة مع خبير —",
  },

  primaryCta: {
    label: {
      en: "Book Free 20-Min Call",
      ar: "احجز مكالمة مجانية لمدة 20 دقيقة",
    },
    href: { en: "/contact", ar: "/ar/contact" },
    variant: "primary",
  },
  secondaryCta: {
    label: { en: "Explore Tax Services", ar: "استكشف الخدمات الضريبية" },
    href: { en: "/tax-services", ar: "/ar/tax-services" },
    variant: "secondary",
  },

  ftaCard: {
    line1: { en: "FTA Approved", ar: "وكالة ضريبية" },
    line2: { en: "Tax Agency", ar: "معتمدة من الهيئة الاتحادية للضرائب" },
    licenseNumber: { en: "No. 30008692", ar: "رقم 30008692" },
  },
  partnerCard: {
    title: { en: "Business Setup Partner", ar: "شريك تأسيس الأعمال" },
    subtitle: { en: "for Dubai Free Zones", ar: "للمناطق الحرة في دبي" },
  },
  experienceCard: {
    value: { en: "25+ YEARS", ar: "+25 عامًا" },
    label: { en: "of Experience", ar: "من الخبرة" },
    tagline: { en: "You Can Count On", ar: "يمكنك الاعتماد عليها" },
  },
  reviewRatings: [
    {
      platform: "google",
      score: 4.8,
      label: {
        en: "from 200+ Google Reviews",
        ar: "من أكثر من 200 تقييم على Google",
      },
    },
    {
      platform: "trustpilot",
      score: 4.8,
      label: {
        en: "from 75+ Trustpilot Reviews",
        ar: "من أكثر من 75 تقييمًا على Trustpilot",
      },
    },
  ],

  trustedNote: {
    en: "Trusted by 1,000+ Businesses in the UAE and worldwide to stay compliant and find the best opportunities.",
    ar: "يثق بنا أكثر من 1,000 شركة في الإمارات وحول العالم للحفاظ على الامتثال واغتنام أفضل الفرص.",
  },
};

const emptyMedia = (): { en: IMedia[]; ar: IMedia[] } => ({ en: [], ar: [] });

// Inserts the default banner only when the collection is empty
const ensureDefaultBanner = async () => {
  const exists = await Banner.exists({});
  if (exists) return;

  await Banner.create({
    ...DEFAULT_BANNER,
    bgImages: emptyMedia(),
    bgVideos: emptyMedia(),
    posterImage: emptyMedia(),
  });
};

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

// Multipart bodies send nested objects as JSON strings. Parse them back
// so the Zod schemas receive the structure they expect.
const normalizeBody = (body: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
      try {
        out[key] = JSON.parse(value);
        continue;
      } catch {
        // not valid JSON, keep the raw string and let validation report it
      }
    }
    out[key] = value;
  }
  return out;
};

// POST /api/banners  (multipart/form-data)
export const createBanner = async (req: Request, res: Response) => {
  try {
    const parsed = createBannerSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res
        .status(400)
        .json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const media: any = {};

    for (const m of MEDIA) {
      media[m.key] = { en: [], ar: [] };
      for (const lang of LANGS) {
        media[m.key][lang] = await uploadMany(
          files?.[m.fields[lang]],
          m.folder,
          m.type,
        );
      }
    }

    const banner = await Banner.create({ ...parsed.data, ...media });
    res.status(201).json({ status: "success", data: banner });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/banners
// Creates the default banner first if none exists yet
export const getAllBanners = async (_req: Request, res: Response) => {
  try {
    await ensureDefaultBanner();

    const banners = await Banner.find().sort({ createdAt: 1 });
    res
      .status(200)
      .json({ status: "success", results: banners.length, data: banners });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /api/banners/:id  (multipart/form-data)
// new files are added to existing media, removePublicIds deletes old ones
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid banner id" });
      return;
    }

    const parsed = updateBannerSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res
        .status(400)
        .json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const banner = await Banner.findById(id);
    if (!banner) {
      res.status(404).json({ status: "error", message: "Banner not found" });
      return;
    }

    const { removePublicIds, ...textFields } = parsed.data;
    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: { publicId: string; type: "image" | "video" }[] = [];

    banner.set(textFields);

    for (const m of MEDIA) {
      for (const lang of LANGS) {
        const current: IMedia[] = banner.get(`${m.key}.${lang}`) ?? [];

        const keep = current.filter(
          (x) => !removePublicIds.includes(x.publicId),
        );
        current
          .filter((x) => removePublicIds.includes(x.publicId))
          .forEach((x) =>
            toDelete.push({ publicId: x.publicId, type: m.type }),
          );

        const added = await uploadMany(
          files?.[m.fields[lang]],
          m.folder,
          m.type,
        );

        banner.set(
          `${m.key}.${lang}`,
          [...keep, ...added].map((x) => ({
            url: x.url,
            publicId: x.publicId,
          })),
        );
      }
    }

    await banner.save();
    await Promise.allSettled(
      toDelete.map((x) => deleteFromCloudinary(x.publicId, x.type)),
    );

    res.status(200).json({ status: "success", data: banner });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /api/banners/:id  (also deletes its media from Cloudinary)
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid banner id" });
      return;
    }

    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) {
      res.status(404).json({ status: "error", message: "Banner not found" });
      return;
    }

    const jobs: Promise<unknown>[] = [];
    for (const m of MEDIA) {
      for (const lang of LANGS) {
        const items: IMedia[] = banner.get(`${m.key}.${lang}`) ?? [];
        items.forEach((x) =>
          jobs.push(deleteFromCloudinary(x.publicId, m.type)),
        );
      }
    }
    await Promise.allSettled(jobs);

    res.status(200).json({ status: "success", message: "Banner deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
