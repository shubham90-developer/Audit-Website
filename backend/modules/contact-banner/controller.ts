import { Request, Response } from "express";
import { ContactBanner } from "./model";
import { updateContactBannerSchema } from "./validation";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const FOLDER = "audit-website/contact-banner";

const IMAGE_KEYS = ["image1", "image2", "image3"] as const;
const LANGS = ["en", "ar"] as const;

// Used when there is no contact banner in the database yet
const DEFAULT_CONTACT_BANNER = {
  header: {
    en: "Need an Audit or Tax Advice?",
    ar: "هل تحتاج إلى خدمات تدقيق أو استشارة ضريبية؟",
  },
  title: {
    en: "Believe us when it comes to investment",
    ar: "ثق بنا عندما يتعلق الأمر بالاستثمار",
  },
  description: {
    en: "Speak to our team today. Your first consultation is free and confidential.",
    ar: "تحدث إلى فريقنا اليوم. استشارتك الأولى مجانية وسرية.",
  },
};

// returns the contact banner, creating the default one if none exists
const getOrCreate = async () => {
  const existing = await ContactBanner.findOne();
  if (existing) return existing;
  return ContactBanner.create(DEFAULT_CONTACT_BANNER);
};

// GET /api/contact-banner
export const getContactBanner = async (_req: Request, res: Response) => {
  try {
    const banner = await getOrCreate();
    res.status(200).json({ status: "success", data: banner });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /api/contact-banner  (multipart/form-data)
// text: header / title / description (each needs en + ar)
// files: image1En, image1Ar, image2En, image2Ar, image3En, image3Ar
// a new file replaces the old image (old one is deleted from Cloudinary)
export const updateContactBanner = async (req: Request, res: Response) => {
  try {
    const parsed = updateContactBannerSchema.safeParse({ ...req.body });
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((i: any) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");
      res.status(400).json({ status: "error", message });
      return;
    }

    const banner = await getOrCreate();
    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    banner.set(parsed.data);

    for (const key of IMAGE_KEYS) {
      for (const lang of LANGS) {
        const field = `${key}${lang === "en" ? "En" : "Ar"}`; // e.g. image1En
        const file = files?.[field]?.[0];
        if (!file) continue;

        const [uploaded] = await uploadMany([file], FOLDER, "image");

        const oldPublicId: string = banner.get(`${key}.${lang}.publicId`);
        if (oldPublicId) toDelete.push(oldPublicId);

        banner.set(`${key}.${lang}`, {
          url: uploaded.url,
          publicId: uploaded.publicId,
        });
      }
    }

    await banner.save();
    await Promise.allSettled(
      toDelete.map((p) => deleteFromCloudinary(p, "image")),
    );

    res.status(200).json({ status: "success", data: banner });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
