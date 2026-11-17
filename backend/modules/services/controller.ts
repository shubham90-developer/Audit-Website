import { Request, Response } from "express";
import mongoose from "mongoose";
import { Service } from "./model";
import { createServiceSchema, updateServiceSchema } from "./validation";

import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

import { IMedia, Lang } from "./interface";

const LANGS: Lang[] = ["en", "ar"];

const FOLDERS = {
  image: "audit-website/services/images",
  video: "audit-website/services/videos",
};

const MEDIA_FIELDS = [
  "iconImg",
  "cardImg",
  "mainImg",
  "bgImage",
  "bgVideo",
] as const;

const normalizeBody = (body: Record<string, any>) => {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      try {
        if (/^[\[{]/.test(value.trim())) {
          result[key] = JSON.parse(value);
          continue;
        }
      } catch {
        // Keep original value
      }
    }

    result[key] = value;
  }

  return result;
};

const toMedia = (items: any[]): IMedia[] =>
  items.map((item) => ({
    url: item.url,
    publicId: item.publicId ?? "",
  }));

const mediaIds = (items: IMedia[] = []) =>
  items.map((item) => item.publicId).filter(Boolean);

const deleteMedia = async (ids: string[], type: "image" | "video") => {
  await Promise.allSettled(ids.map((id) => deleteFromCloudinary(id, type)));
};

const getFiles = (req: Request) =>
  req.files as Express.Multer.File[] | undefined;

const uploadField = async (
  files: Express.Multer.File[],
  fieldName: string,
  folder: string,
  type: "image" | "video",
): Promise<IMedia[]> => {
  const selected = files.filter((file: any) => file.fieldname === fieldName);

  if (!selected.length) return [];

  const uploaded = await uploadMany(selected, folder, type);

  return toMedia(uploaded);
};

const getMediaType = (field: string): "image" | "video" =>
  field === "bgVideo" ? "video" : "image";

const getFolder = (field: string) =>
  field === "bgVideo" ? FOLDERS.video : FOLDERS.image;

// GET /services
export const getServices = async (_req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      data: services,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// GET /services/:id
export const getServiceById = async (req: Request, res: Response) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid service ID",
      });
      return;
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      res.status(404).json({
        status: "error",
        message: "Service not found",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: service,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// POST /services
export const createService = async (req: Request, res: Response) => {
  try {
    const parsed = createServiceSchema.safeParse(normalizeBody(req.body));

    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        message: parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(", "),
      });
      return;
    }

    const files = getFiles(req) ?? [];

    const media: Record<string, any> = {};

    for (const field of MEDIA_FIELDS) {
      const type = getMediaType(field);

      media[field] = {};

      for (const lang of LANGS) {
        media[field][lang] = await uploadField(
          files,
          `${field}${lang === "en" ? "En" : "Ar"}`,
          getFolder(field),
          type,
        );
      }
    }

    const details = await Promise.all(
      parsed.data.details.map(async (detail, index) => {
        const img: any = {};

        for (const lang of LANGS) {
          img[lang] = await uploadField(
            files,
            `detailImage${lang === "en" ? "En" : "Ar"}_${index}`,
            FOLDERS.image,
            "image",
          );
        }

        return {
          ...detail,
          img,
        };
      }),
    );

    const service = await Service.create({
      ...parsed.data,
      ...media,
      details,
    });

    res.status(201).json({
      status: "success",
      data: service,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// PATCH /services/:id
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid service ID",
      });
      return;
    }

    const parsed = updateServiceSchema.safeParse(normalizeBody(req.body));

    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        message: parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join(", "),
      });
      return;
    }

    const service = await Service.findById(id);

    if (!service) {
      res.status(404).json({
        status: "error",
        message: "Service not found",
      });
      return;
    }

    const files = getFiles(req) ?? [];
    const toDelete: { id: string; type: "image" | "video" }[] = [];

    // Update text fields
    if (parsed.data.title) service.title = parsed.data.title;
    if (parsed.data.desc) service.desc = parsed.data.desc;

    // Update media fields
    for (const field of MEDIA_FIELDS) {
      const type = getMediaType(field);

      for (const lang of LANGS) {
        const uploadName = `${field}${lang === "en" ? "En" : "Ar"}`;

        const selected = files.filter(
          (file: any) => file.fieldname === uploadName,
        );

        if (!selected.length) continue;

        const current = service.get(`${field}.${lang}`) ?? [];

        toDelete.push(...mediaIds(current).map((id) => ({ id, type })));

        const uploaded = await uploadField(
          files,
          uploadName,
          getFolder(field),
          type,
        );

        service.set(`${field}.${lang}`, uploaded);
      }
    }

    // Update details while preserving existing detail images
    if (parsed.data.details) {
      const oldDetails = service.details;
      const newDetails = [];

      for (let i = 0; i < parsed.data.details.length; i++) {
        const detail = parsed.data.details[i];
        const oldDetail =
          oldDetails.find(
            (item: any) => detail._id && item._id.toString() === detail._id,
          ) ?? oldDetails[i];

        const img: any = {
          en: oldDetail?.img?.en ?? [],
          ar: oldDetail?.img?.ar ?? [],
        };

        for (const lang of LANGS) {
          const uploadName = `detailImage${lang === "en" ? "En" : "Ar"}_${i}`;

          const selected = files.filter(
            (file: any) => file.fieldname === uploadName,
          );

          if (!selected.length) continue;

          toDelete.push(
            ...mediaIds(img[lang]).map((id) => ({
              id,
              type: "image" as const,
            })),
          );

          img[lang] = await uploadField(
            files,
            uploadName,
            FOLDERS.image,
            "image",
          );
        }

        newDetails.push({
          ...detail,
          img,
        });
      }

      // Delete images belonging to removed details
      const retainedIds = new Set(
        newDetails.flatMap((detail) => [
          ...mediaIds(detail.img.en),
          ...mediaIds(detail.img.ar),
        ]),
      );

      for (const oldDetail of oldDetails) {
        for (const lang of LANGS) {
          for (const id of mediaIds(oldDetail.img[lang])) {
            if (!retainedIds.has(id)) {
              toDelete.push({ id, type: "image" });
            }
          }
        }
      }

      service.details = newDetails as any;
    }

    await service.save();

    await Promise.allSettled(
      toDelete.map(({ id, type }) => deleteFromCloudinary(id, type)),
    );

    res.status(200).json({
      status: "success",
      data: service,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// DELETE /services/:id
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid service ID",
      });
      return;
    }

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      res.status(404).json({
        status: "error",
        message: "Service not found",
      });
      return;
    }

    for (const field of MEDIA_FIELDS) {
      const type = getMediaType(field);

      for (const lang of LANGS) {
        await deleteMedia(mediaIds(service.get(`${field}.${lang}`)), type);
      }
    }

    for (const detail of service.details) {
      for (const lang of LANGS) {
        await deleteMedia(mediaIds(detail.img[lang]), "image");
      }
    }

    res.status(200).json({
      status: "success",
      message: "Service deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
