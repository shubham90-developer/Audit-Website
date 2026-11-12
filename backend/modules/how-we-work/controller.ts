import { Request, Response } from "express";
import { HowWeWork } from "./model";
import {
  createHowWeWorkSchema,
  updateHowWeWorkSchema,
  updateStepsSchema,
} from "./validation";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const FOLDER = "audit-website/how-we-work";
const LANGS = ["en", "ar"] as const;
type Lang = (typeof LANGS)[number];
type Files = Record<string, Express.Multer.File[]> | undefined;

const NOT_FOUND = "How We Work section has not been created yet";
const ALREADY_EXISTS =
  "How We Work section already exists. Use PATCH to update it.";

const imageField = (lang: Lang) => `image${lang === "en" ? "En" : "Ar"}`;
const emptyMedia = () => ({ url: "", publicId: "" });

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

const sendError = (res: Response, status: number, message: string) =>
  res.status(status).json({ status: "error", message });

const uploadImage = async (file: Express.Multer.File) => {
  const [uploaded] = await uploadMany([file], FOLDER, "image");
  return { url: uploaded.url, publicId: uploaded.publicId };
};

const deleteImages = (publicIds: string[]) =>
  Promise.allSettled(publicIds.map((id) => deleteFromCloudinary(id, "image")));

// ---------- GET /api/how-we-work ----------
export const getHowWeWork = async (_req: Request, res: Response) => {
  try {
    const data = await HowWeWork.findOne().lean();
    if (!data) return sendError(res, 404, NOT_FOUND);
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

// ---------- POST /api/how-we-work  (multipart/form-data) ----------
// text:  label[en], label[ar], heading[en], heading[ar], videoUrl
//        steps[0][title][en], steps[0][description][ar], steps[0][icon]=chat ...
// files: imageEn, imageAr (optional)
export const createHowWeWork = async (req: Request, res: Response) => {
  const uploadedIds: string[] = [];
  try {
    if (await HowWeWork.exists({})) return sendError(res, 409, ALREADY_EXISTS);

    const parsed = createHowWeWorkSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, zodMessage(parsed.error));

    const files = req.files as Files;
    const image = { en: emptyMedia(), ar: emptyMedia() };

    for (const lang of LANGS) {
      const file = files?.[imageField(lang)]?.[0];
      if (!file) continue;
      const media = await uploadImage(file);
      uploadedIds.push(media.publicId);
      image[lang] = media;
    }

    const doc = await HowWeWork.create({ ...parsed.data, image });
    res.status(201).json({ status: "success", data: doc });
  } catch (error: any) {
    await deleteImages(uploadedIds);
    if (error.code === 11000) return sendError(res, 409, ALREADY_EXISTS);
    sendError(res, 500, error.message);
  }
};

// ---------- PATCH /api/how-we-work  (multipart/form-data) ----------
// text:  label[en], heading[ar], videoUrl
//        steps[N][title][en], steps[N][icon]=team  (N = position, starts at 0)
// files: imageEn, imageAr (a new file replaces the old one)
export const updateHowWeWork = async (req: Request, res: Response) => {
  const uploadedIds: string[] = [];
  try {
    const top = updateHowWeWorkSchema.safeParse(req.body);
    if (!top.success) return sendError(res, 400, zodMessage(top.error));

    const stepsParsed = updateStepsSchema.safeParse(req.body.steps ?? {});
    if (!stepsParsed.success)
      return sendError(res, 400, zodMessage(stepsParsed.error));

    const doc = await HowWeWork.findOne();
    if (!doc) return sendError(res, 404, NOT_FOUND);

    const changes = stepsParsed.data;

    // Validate everything before writing anything
    for (const key of Object.keys(changes)) {
      if (Number(key) >= doc.steps.length) {
        return sendError(res, 400, `steps[${key}] does not exist`);
      }
    }

    const nextIcons = doc.steps.map((step, i) => changes[i]?.icon ?? step.icon);
    if (new Set(nextIcons).size !== nextIcons.length) {
      return sendError(res, 400, "Each icon can only be used once");
    }

    // Text changes
    doc.set(top.data);
    for (const [key, step] of Object.entries(changes)) {
      const i = Number(key);
      if (step.title) doc.set(`steps.${i}.title`, step.title);
      if (step.description) doc.set(`steps.${i}.description`, step.description);
      if (step.icon) doc.set(`steps.${i}.icon`, step.icon);
    }

    // Image changes
    const files = req.files as Files;
    const oldIds: string[] = [];

    for (const lang of LANGS) {
      const file = files?.[imageField(lang)]?.[0];
      if (!file) continue;

      const media = await uploadImage(file);
      uploadedIds.push(media.publicId);

      const oldId: string = doc.get(`image.${lang}.publicId`);
      if (oldId) oldIds.push(oldId);

      doc.set(`image.${lang}`, media);
    }

    await doc.save();
    await deleteImages(oldIds); // only after the save succeeds

    res.status(200).json({ status: "success", data: doc });
  } catch (error: any) {
    await deleteImages(uploadedIds);
    sendError(res, 500, error.message);
  }
};

// ---------- DELETE /api/how-we-work ----------
export const deleteHowWeWork = async (_req: Request, res: Response) => {
  try {
    const doc = await HowWeWork.findOne();
    if (!doc) return sendError(res, 404, NOT_FOUND);

    const publicIds = LANGS.map((lang) => doc.image[lang].publicId).filter(
      Boolean,
    );

    await HowWeWork.deleteOne({ _id: doc._id });
    await deleteImages(publicIds);

    res
      .status(200)
      .json({ status: "success", message: "How We Work section deleted" });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
