import { Request, Response } from "express";
import { Industries } from "./model";
import {
  createIndustriesSchema,
  updateIndustriesSchema,
  updateItemsSchema,
} from "./validation";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const FOLDER = "audit-website/industries";
const LANGS = ["en", "ar"] as const;
type Lang = (typeof LANGS)[number];

type Files = Record<string, Express.Multer.File[]> | undefined;

// item index 0 -> "item1ImageEn", "item1ImageAr", ...
const fileField = (index: number, lang: Lang) =>
  `item${index + 1}Image${lang === "en" ? "En" : "Ar"}`;

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

// ---------- GET /api/industries ----------
export const getIndustries = async (_req: Request, res: Response) => {
  try {
    const data = await Industries.findOne().lean();
    if (!data) {
      return sendError(res, 404, "Industries section has not been created yet");
    }
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

// ---------- POST /api/industries  (multipart/form-data) ----------
// text:  label[en], label[ar], heading[...], subtitle[...]
//        items[0][title][en], items[0][description][ar], items[0][points][0][en] ...
// files: item1ImageEn, item1ImageAr ... item10ImageEn, item10ImageAr
export const createIndustries = async (req: Request, res: Response) => {
  const uploadedPublicIds: string[] = [];
  try {
    if (await Industries.exists({})) {
      return sendError(
        res,
        409,
        "Industries section already exists. Use PATCH to update it.",
      );
    }

    const parsed = createIndustriesSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, zodMessage(parsed.error));

    const files = req.files as Files;
    const items = [];

    for (let i = 0; i < parsed.data.items.length; i++) {
      const image = { en: emptyMedia(), ar: emptyMedia() };

      for (const lang of LANGS) {
        const file = files?.[fileField(i, lang)]?.[0];
        if (!file) continue;

        const uploaded = await uploadImage(file);
        uploadedPublicIds.push(uploaded.publicId);
        image[lang] = uploaded;
      }

      items.push({ ...parsed.data.items[i], image });
    }

    const doc = await Industries.create({ ...parsed.data, items });
    res.status(201).json({ status: "success", data: doc });
  } catch (error: any) {
    // The document was not saved, so remove any images uploaded for it
    await deleteImages(uploadedPublicIds);
    sendError(res, 500, error.message);
  }
};

// ---------- PATCH /api/industries  (multipart/form-data) ----------
// text:  label[en], heading[ar], subtitle[...]
//        items[N][title][en], items[N][points][0][en] ...  (N = position, starts at 0)
// files: item1ImageEn ... item10ImageAr  (a new file replaces the old image)
export const updateIndustries = async (req: Request, res: Response) => {
  const uploadedPublicIds: string[] = [];
  try {
    const top = updateIndustriesSchema.safeParse(req.body);
    if (!top.success) return sendError(res, 400, zodMessage(top.error));

    const itemsParsed = updateItemsSchema.safeParse(req.body.items ?? {});
    if (!itemsParsed.success)
      return sendError(res, 400, zodMessage(itemsParsed.error));

    const doc = await Industries.findOne();
    if (!doc) {
      return sendError(res, 404, "Industries section has not been created yet");
    }

    // Validate every target index before changing anything
    for (const key of Object.keys(itemsParsed.data)) {
      const index = Number(key);
      if (index >= doc.items.length) {
        return sendError(res, 400, `items[${index}] does not exist`);
      }
    }

    // Text changes
    doc.set(top.data);
    for (const [key, changes] of Object.entries(itemsParsed.data)) {
      const index = Number(key);
      if (changes.title) doc.set(`items.${index}.title`, changes.title);
      if (changes.description)
        doc.set(`items.${index}.description`, changes.description);
      if (changes.points) doc.set(`items.${index}.points`, changes.points);
    }

    // Image changes
    const files = req.files as Files;
    const oldPublicIds: string[] = [];

    for (let i = 0; i < doc.items.length; i++) {
      for (const lang of LANGS) {
        const file = files?.[fileField(i, lang)]?.[0];
        if (!file) continue;

        const uploaded = await uploadImage(file);
        uploadedPublicIds.push(uploaded.publicId);

        const oldPublicId: string = doc.get(
          `items.${i}.image.${lang}.publicId`,
        );
        if (oldPublicId) oldPublicIds.push(oldPublicId);

        doc.set(`items.${i}.image.${lang}`, uploaded);
      }
    }

    await doc.save();
    await deleteImages(oldPublicIds); // only after the save succeeds

    res.status(200).json({ status: "success", data: doc });
  } catch (error: any) {
    await deleteImages(uploadedPublicIds);
    sendError(res, 500, error.message);
  }
};

// ---------- DELETE /api/industries ----------
// Deletes the whole section and its Cloudinary images.
export const deleteIndustries = async (_req: Request, res: Response) => {
  try {
    const doc = await Industries.findOne();
    if (!doc) {
      return sendError(res, 404, "Industries section has not been created yet");
    }

    const publicIds = doc.items.flatMap((item) =>
      LANGS.map((lang) => item.image[lang].publicId).filter(Boolean),
    );

    await Industries.deleteOne({ _id: doc._id });
    await deleteImages(publicIds);

    res
      .status(200)
      .json({ status: "success", message: "Industries section deleted" });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
