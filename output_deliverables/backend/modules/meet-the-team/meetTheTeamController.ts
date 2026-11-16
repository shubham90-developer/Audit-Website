import { Request, Response } from "express";
import { MeetTheTeam } from "./meetTheTeam.model";
import { updateMeetTheTeamSchema } from "./meetTheTeam.validation";
import { IMedia, ILocalizedString } from "./meetTheTeam.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";
import { uploadBuffer, deleteMedia } from "../../utils/cloudinary";

type Lang = "en" | "ar";
const LANGS: Lang[] = ["en", "ar"];
const FOLDER = "audit-website/meet-the-team";
const IMAGE_FIELDS: Record<Lang, string> = { en: "imageEn", ar: "imageAr" };

const DEFAULT_CONTENT = {
  leftTitle: {
    en: "The team you'll actually work with",
    ar: "?????? ???? ????? ??? ??????",
  },
  scriptTitle: {
    en: "People Behind Your Progress",
    ar: "??????? ???? ?????",
  },
  watermark: {
    en: "Auditing • Tax • Accounting",
    ar: "??????? • ??????? • ????????",
  },
  marqueeText: {
    en: "ACCOUNTING • TAX • AUDIT • ",
    ar: "?????? • ????? • ????? • ",
  },
  marqueeSeconds: 60,
  video: { url: "/img/banner/1.mp4", publicId: "default" },
  videoPoster: { url: "/img/banner/11.avif", publicId: "default" },
  bgImage: { url: "/img/banner/bg1.avif", publicId: "default" },
  image: { en: [], ar: [] },
};

const ensureDefaults = async (): Promise<void> => {
  if (!(await MeetTheTeam.exists({}))) {
    await MeetTheTeam.create(DEFAULT_CONTENT);
  }
};

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

const normalizeBody = (body: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
      try {
        out[key] = JSON.parse(value);
        continue;
      } catch {
        // not JSON
      }
    }
    out[key] = value;
  }
  return out;
};

const toMedia = (items: IMedia[]) =>
  items.map((x: any) => ({ url: x.url, publicId: x.publicId }));

export const getMeetTheTeamData = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();
    const data = await MeetTheTeam.findOne();
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateMeetTheTeamData = async (req: Request, res: Response) => {
  try {
    await ensureDefaults();
    const section = await MeetTheTeam.findOne();
    if (!section) {
      res.status(404).json({ status: "error", message: "Section not found" });
      return;
    }

    const body = normalizeBody(req.body);
    const files = req.files as Record<string, any[]> | undefined;

    // Handle language images if provided
    for (const lang of LANGS) {
      const field = IMAGE_FIELDS[lang];
      if (files?.[field]?.length) {
        if (section.image[lang]?.length) {
          await deleteFromCloudinary(section.image[lang].map((x: any) => x.publicId).filter((p: any) => p !== "default"));
        }
        const uploaded = await uploadMany(files[field], FOLDER, "image");
        section.image[lang] = toMedia(uploaded);
      }
    }

    // Handle video upload if provided
    if (files?.["video"]?.length) {
      if (section.video?.publicId && section.video.publicId !== "default") {
        await deleteMedia(section.video.publicId);
      }
      const up = await uploadBuffer(files["video"][0].buffer, "meet-the-team", "video");
      section.video = { url: up.secure_url, publicId: up.public_id };
    }

    // Handle poster upload if provided
    if (files?.["videoPoster"]?.length) {
      if (section.videoPoster?.publicId && section.videoPoster.publicId !== "default") {
        await deleteMedia(section.videoPoster.publicId);
      }
      const up = await uploadBuffer(files["videoPoster"][0].buffer, "meet-the-team");
      section.videoPoster = { url: up.secure_url, publicId: up.public_id };
    }

    // Handle bgImage upload if provided
    if (files?.["bgImage"]?.length) {
      if (section.bgImage?.publicId && section.bgImage.publicId !== "default") {
        await deleteMedia(section.bgImage.publicId);
      }
      const up = await uploadBuffer(files["bgImage"][0].buffer, "meet-the-team");
      section.bgImage = { url: up.secure_url, publicId: up.public_id };
    }

    if (body.leftTitle) section.leftTitle = body.leftTitle;
    if (body.scriptTitle) section.scriptTitle = body.scriptTitle;
    if (body.watermark) section.watermark = body.watermark;
    if (body.marqueeText) section.marqueeText = body.marqueeText;
    if (body.marqueeSeconds !== undefined) section.marqueeSeconds = Number(body.marqueeSeconds);

    await section.save();
    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
