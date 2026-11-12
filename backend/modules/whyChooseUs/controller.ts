import { Request, Response } from "express";
import { WhyChooseUs } from "./model";
import {
  createWhyChooseUsSchema,
  updateWhyChooseUsSchema,
  updateItemsSchema,
} from "./validation";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const FOLDER = "audit-website/why-choose-us";
const LANGS = ["en", "ar"] as const;
type Lang = (typeof LANGS)[number];
type Files = Record<string, Express.Multer.File[]> | undefined;

const NOT_FOUND = "Why Choose Us section has not been created yet";
const ALREADY_EXISTS =
  "Why Choose Us section already exists. Use PATCH to update it.";

const centerField = (lang: Lang) => `centerImage${lang === "en" ? "En" : "Ar"}`;

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

// ---------- GET /api/why-choose-us ----------
export const getWhyChooseUs = async (_req: Request, res: Response) => {
  try {
    const data = await WhyChooseUs.findOne().lean();
    if (!data) return sendError(res, 404, NOT_FOUND);
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const createWhyChooseUs = async (req: Request, res: Response) => {
  const uploadedIds: string[] = [];
  try {
    if (await WhyChooseUs.exists({}))
      return sendError(res, 409, ALREADY_EXISTS);

    const parsed = createWhyChooseUsSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, zodMessage(parsed.error));

    const files = req.files as Files;
    const centerImage = { en: emptyMedia(), ar: emptyMedia() };

    for (const lang of LANGS) {
      const file = files?.[centerField(lang)]?.[0];
      if (!file) continue;
      const media = await uploadImage(file);
      uploadedIds.push(media.publicId);
      centerImage[lang] = media;
    }

    const doc = await WhyChooseUs.create({ ...parsed.data, centerImage });
    res.status(201).json({ status: "success", data: doc });
  } catch (error: any) {
    await deleteImages(uploadedIds);
    if (error.code === 11000) return sendError(res, 409, ALREADY_EXISTS); // singleton index
    sendError(res, 500, error.message);
  }
};

export const updateWhyChooseUs = async (req: Request, res: Response) => {
  const uploadedIds: string[] = [];
  try {
    const top = updateWhyChooseUsSchema.safeParse(req.body);
    if (!top.success) return sendError(res, 400, zodMessage(top.error));

    const itemsParsed = updateItemsSchema.safeParse(req.body.items ?? {});
    if (!itemsParsed.success)
      return sendError(res, 400, zodMessage(itemsParsed.error));

    const doc = await WhyChooseUs.findOne();
    if (!doc) return sendError(res, 404, NOT_FOUND);

    const changes = itemsParsed.data;

    // Validate everything before writing anything
    for (const key of Object.keys(changes)) {
      if (Number(key) >= doc.items.length) {
        return sendError(res, 400, `items[${key}] does not exist`);
      }
    }

    const nextIcons = doc.items.map((item, i) => changes[i]?.icon ?? item.icon);
    if (new Set(nextIcons).size !== nextIcons.length) {
      return sendError(res, 400, "Each icon can only be used once");
    }

    // Text changes
    doc.set(top.data);
    for (const [key, item] of Object.entries(changes)) {
      const i = Number(key);
      if (item.title) doc.set(`items.${i}.title`, item.title);
      if (item.description) doc.set(`items.${i}.description`, item.description);
      if (item.icon) doc.set(`items.${i}.icon`, item.icon);
    }

    // Image changes
    const files = req.files as Files;
    const oldIds: string[] = [];

    for (const lang of LANGS) {
      const file = files?.[centerField(lang)]?.[0];
      if (!file) continue;

      const media = await uploadImage(file);
      uploadedIds.push(media.publicId);

      const oldId: string = doc.get(`centerImage.${lang}.publicId`);
      if (oldId) oldIds.push(oldId);

      doc.set(`centerImage.${lang}`, media);
    }

    await doc.save();
    await deleteImages(oldIds); // only after the save succeeds

    res.status(200).json({ status: "success", data: doc });
  } catch (error: any) {
    await deleteImages(uploadedIds);
    sendError(res, 500, error.message);
  }
};

export const deleteWhyChooseUs = async (_req: Request, res: Response) => {
  try {
    const doc = await WhyChooseUs.findOne();
    if (!doc) return sendError(res, 404, NOT_FOUND);

    const publicIds = LANGS.map(
      (lang) => doc.centerImage[lang].publicId,
    ).filter(Boolean);

    await WhyChooseUs.deleteOne({ _id: doc._id });
    await deleteImages(publicIds);

    res
      .status(200)
      .json({ status: "success", message: "Why Choose Us section deleted" });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
