import { Request, Response } from "express";
import mongoose from "mongoose";
import { MissionVision } from "./about.model";
import {
  createMissionVisionSchema,
  updateMissionVisionSchema,
} from "./about.validation";
import { IMedia } from "./about.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const FOLDER = "audit-website/mission-vision";

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

// POST /api/mission-vision  (multipart/form-data)
// adds ONE object (e.g. Our Mission) to the sections array
export const createMissionVision = async (req: Request, res: Response) => {
  try {
    const parsed = createMissionVisionSchema.safeParse({ ...req.body });
    if (!parsed.success) {
      res
        .status(400)
        .json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const image = {
      en: await uploadMany(files?.imageEn, FOLDER, "image"),
      ar: await uploadMany(files?.imageAr, FOLDER, "image"),
    };

    // one document holds the whole array; create it on first use
    const doc = await MissionVision.findOneAndUpdate(
      {},
      { $push: { sections: { ...parsed.data, image } } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(201).json({ status: "success", data: doc.sections });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// GET /api/mission-vision  -> array of objects
export const getAllMissionVision = async (_req: Request, res: Response) => {
  try {
    const doc = await MissionVision.findOne();
    const sections = doc?.sections ?? [];

    res
      .status(200)
      .json({ status: "success", results: sections.length, data: sections });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /api/mission-vision/:id   (:id = _id of the object inside the array)
// new images are added, removePublicIds deletes old ones
export const updateMissionVision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid id" });
      return;
    }

    const parsed = updateMissionVisionSchema.safeParse({ ...req.body });
    if (!parsed.success) {
      res
        .status(400)
        .json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const doc = await MissionVision.findOne({ "sections._id": id });
    const section: any = (doc?.sections as any)?.id(id);
    if (!doc || !section) {
      res.status(404).json({ status: "error", message: "Not found" });
      return;
    }

    const { removePublicIds, ...textFields } = parsed.data;
    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    section.set(textFields);

    for (const lang of ["en", "ar"] as const) {
      const current: IMedia[] = section.get(`image.${lang}`) ?? [];

      const keep = current.filter((x) => !removePublicIds.includes(x.publicId));
      current
        .filter((x) => removePublicIds.includes(x.publicId))
        .forEach((x) => toDelete.push(x.publicId));

      const field = lang === "en" ? "imageEn" : "imageAr";
      const added = await uploadMany(files?.[field], FOLDER, "image");

      section.set(
        `image.${lang}`,
        [...keep, ...added].map((x) => ({ url: x.url, publicId: x.publicId })),
      );
    }

    await doc.save();
    await Promise.allSettled(
      toDelete.map((p) => deleteFromCloudinary(p, "image")),
    );

    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /api/mission-vision/:id  (removes the object + its Cloudinary images)
export const deleteMissionVision = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid id" });
      return;
    }

    const doc = await MissionVision.findOne({ "sections._id": id });
    const section: any = (doc?.sections as any)?.id(id);
    if (!doc || !section) {
      res.status(404).json({ status: "error", message: "Not found" });
      return;
    }

    const images: IMedia[] = [
      ...(section.get("image.en") ?? []),
      ...(section.get("image.ar") ?? []),
    ];

    (doc.sections as any).pull(id);
    await doc.save();
    await Promise.allSettled(
      images.map((x) => deleteFromCloudinary(x.publicId, "image")),
    );

    res
      .status(200)
      .json({ status: "success", message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
