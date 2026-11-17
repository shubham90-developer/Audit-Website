import { Request, Response } from "express";
import mongoose from "mongoose";

import { GlobalMarketsSection, GlobalMarket } from "./model";

import {
  updateSectionSchema,
  createMarketSchema,
  updateMarketSchema,
} from "./validation";

import { IMedia, Lang } from "./interface";

import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const LANGS: Lang[] = ["en", "ar"];

const SECTION_FOLDER = "audit-website/global-markets/section";
const MARKET_FOLDER = "audit-website/global-markets/countries";

const BG_FIELDS: Record<Lang, string> = {
  en: "bgImageEn",
  ar: "bgImageAr",
};

const MARKET_FIELDS: Record<Lang, string> = {
  en: "marketImageEn",
  ar: "marketImageAr",
};

// Default content
const DEFAULT_SECTION = {
  badge: {
    en: "THE NEXT CHAPTER",
    ar: "الفصل التالي",
  },
  title: {
    en: "And the Story Expanded Across",
    ar: "وتوسعت قصتنا عبر",
  },
  highlightedTitle: {
    en: "Four Global Markets",
    ar: "أربعة أسواق عالمية",
  },
  description: {
    en: "What started in Business Bay grew into offices and an active presence across Dubai, Mississauga, the USA and Panama, helping businesses go further, wherever they are.",
    ar: "ما بدأ في منطقة الخليج التجاري توسع ليصبح حضوراً فعالاً ومكاتب في دبي وميسيساغا والولايات المتحدة وبنما، لمساعدة الشركات على التوسع والنمو أينما كانت.",
  },
  sideTitle: {
    en: "From Business Bay to the World",
    ar: "من الخليج التجاري إلى العالم",
  },
  bgImage: {
    en: [],
    ar: [],
  },
};

const DEFAULT_MARKETS = [
  {
    title: { en: "UAE", ar: "الإمارات العربية المتحدة" },
    image: { en: [], ar: [] },
    order: 0,
    isActive: true,
  },
  {
    title: { en: "Canada", ar: "كندا" },
    image: { en: [], ar: [] },
    order: 1,
    isActive: true,
  },
  {
    title: { en: "USA", ar: "الولايات المتحدة الأمريكية" },
    image: { en: [], ar: [] },
    order: 2,
    isActive: true,
  },
  {
    title: { en: "Panama", ar: "بنما" },
    image: { en: [], ar: [] },
    order: 3,
    isActive: true,
  },
];

// Initialize default content
const ensureDefaults = async (): Promise<void> => {
  if (!(await GlobalMarketsSection.exists({}))) {
    await GlobalMarketsSection.create(DEFAULT_SECTION);
  }

  if (!(await GlobalMarket.exists({}))) {
    await GlobalMarket.insertMany(DEFAULT_MARKETS);
  }
};

// Parse multipart JSON fields
const normalizeBody = (body: Record<string, any>) => {
  const out: Record<string, any> = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
      try {
        out[key] = JSON.parse(value);
        continue;
      } catch {
        // Keep original value
      }
    }

    out[key] = value;
  }

  return out;
};

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

const toMedia = (items: { url: string; publicId?: string }[]): IMedia[] =>
  items.map((item) => ({
    url: item.url,
    publicId: item.publicId ?? "",
  }));

const mediaIds = (list: { publicId?: string }[] | undefined): string[] =>
  (list ?? []).map((item) => item.publicId ?? "").filter((id) => id !== "");

const deleteAll = (ids: string[]) =>
  Promise.allSettled(ids.map((id) => deleteFromCloudinary(id, "image")));

// =====================================================
// GET GLOBAL MARKETS
// GET /v1/api/global-markets
// =====================================================

export const getGlobalMarkets = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();

    const [section, markets] = await Promise.all([
      GlobalMarketsSection.findOne(),
      GlobalMarket.find().sort({ order: 1, createdAt: 1 }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        section,
        markets,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE MAIN SECTION
// PATCH /v1/api/global-markets/section
// =====================================================

export const updateSection = async (req: Request, res: Response) => {
  try {
    const parsed = updateSectionSchema.safeParse(normalizeBody(req.body));

    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        message: zodMessage(parsed.error),
      });
      return;
    }

    await ensureDefaults();

    const section = await GlobalMarketsSection.findOne();

    if (!section) {
      res.status(404).json({
        status: "error",
        message: "Section not found",
      });
      return;
    }

    section.set(parsed.data);

    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    const toDelete: string[] = [];

    for (const lang of LANGS) {
      const incoming = files?.[BG_FIELDS[lang]];

      if (!incoming?.length) continue;

      const path = `bgImage.${lang}`;

      toDelete.push(...mediaIds(section.get(path)));

      const uploaded = await uploadMany(incoming, SECTION_FOLDER, "image");

      section.set(path, toMedia(uploaded));
    }

    await section.save();

    await deleteAll(toDelete);

    res.status(200).json({
      status: "success",
      data: section,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// =====================================================
// CREATE COUNTRY CARD
// POST /v1/api/global-markets/countries
// =====================================================

export const createMarket = async (req: Request, res: Response) => {
  try {
    const parsed = createMarketSchema.safeParse(normalizeBody(req.body));

    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        message: zodMessage(parsed.error),
      });
      return;
    }

    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    const images = {
      en: await uploadMany(files?.[MARKET_FIELDS.en], MARKET_FOLDER, "image"),
      ar: await uploadMany(files?.[MARKET_FIELDS.ar], MARKET_FOLDER, "image"),
    };

    const market = await GlobalMarket.create({
      ...parsed.data,
      image: {
        en: toMedia(images.en),
        ar: toMedia(images.ar),
      },
    });

    res.status(201).json({
      status: "success",
      data: market,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE COUNTRY CARD
// PATCH /v1/api/global-markets/countries/:id
// =====================================================

export const updateMarket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid market id",
      });
      return;
    }

    const parsed = updateMarketSchema.safeParse(normalizeBody(req.body));

    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        message: zodMessage(parsed.error),
      });
      return;
    }

    const market = await GlobalMarket.findById(id);

    if (!market) {
      res.status(404).json({
        status: "error",
        message: "Market not found",
      });
      return;
    }

    market.set(parsed.data);

    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    const toDelete: string[] = [];

    for (const lang of LANGS) {
      const incoming = files?.[MARKET_FIELDS[lang]];

      if (!incoming?.length) continue;

      const path = `image.${lang}`;

      toDelete.push(...mediaIds(market.get(path)));

      const uploaded = await uploadMany(incoming, MARKET_FOLDER, "image");

      market.set(path, toMedia(uploaded));
    }

    await market.save();

    await deleteAll(toDelete);

    res.status(200).json({
      status: "success",
      data: market,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// =====================================================
// DELETE COUNTRY CARD
// DELETE /v1/api/global-markets/countries/:id
// =====================================================

export const deleteMarket = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid market id",
      });
      return;
    }

    const market = await GlobalMarket.findByIdAndDelete(id);

    if (!market) {
      res.status(404).json({
        status: "error",
        message: "Market not found",
      });
      return;
    }

    await deleteAll([
      ...mediaIds(market.image.en),
      ...mediaIds(market.image.ar),
    ]);

    res.status(200).json({
      status: "success",
      message: "Market deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
