import type { Request, Response } from "express";
import { LegalPage } from "./legal.model";
import { defaultLegalPage } from "./legal.defaults";
import { uploadToCloudinary } from "./legal.upload";

const kinds = ["privacy-policy", "terms-and-conditions"] as const;

type LegalPageKind = (typeof kinds)[number];

const valid = (value: unknown): value is LegalPageKind =>
  typeof value === "string" && kinds.includes(value as LegalPageKind);

const localized = (value: any) =>
  value && typeof value.en === "string" && typeof value.ar === "string";

// GET LEGAL PAGE
export const getLegalPage = async (req: Request, res: Response) => {
  try {
    const kind = req.params.kind;

    if (!valid(kind)) {
      return res.status(400).json({
        success: false,
        message: "Invalid legal page",
      });
    }

    const data = await LegalPage.findOneAndUpdate(
      { kind },
      {
        $setOnInsert: defaultLegalPage(kind),
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch legal page",
    });
  }
};

// UPDATE LEGAL PAGE
export const updateLegalPage = async (req: Request, res: Response) => {
  try {
    const kind = req.params.kind;

    if (!valid(kind)) {
      return res.status(400).json({
        success: false,
        message: "Invalid legal page",
      });
    }

    const payload =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;

    // Validate localized fields
    for (const key of [
      "heroTitle",
      "heroDescription",
      "intro",
      "sidebarTitle",
    ]) {
      if (!localized(payload[key])) {
        return res.status(400).json({
          success: false,
          message: `Invalid ${key}`,
        });
      }
    }

    // Validate sections
    if (
      !Array.isArray(payload.sections) ||
      payload.sections.some(
        (s: any) =>
          !localized(s.title) ||
          !localized(s.body) ||
          !Array.isArray(s.bullets) ||
          s.bullets.some((b: any) => !localized(b)),
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid sections",
      });
    }

    // Get existing page
    const existing = await LegalPage.findOne({
      kind,
    });

    const heroImage =
      existing?.heroImage?.toObject?.() || defaultLegalPage(kind).heroImage;

    // Handle Cloudinary image uploads
    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    for (const lang of ["en", "ar"] as const) {
      const file = files?.[`heroImage${lang === "en" ? "En" : "Ar"}`]?.[0];

      if (file) {
        heroImage[lang] = await uploadToCloudinary(file);
      }
    }

    // Update legal page
    const data = await LegalPage.findOneAndUpdate(
      { kind },
      {
        $set: {
          heroTitle: payload.heroTitle,
          heroDescription: payload.heroDescription,
          intro: payload.intro,
          sidebarTitle: payload.sidebarTitle,
          sections: payload.sections,
          heroImage,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );

    return res.json({
      success: true,
      message: "Page updated",
      data,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to update legal page",
    });
  }
};
