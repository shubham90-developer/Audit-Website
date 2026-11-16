import { Request, Response } from "express";
import { MeetTheTeam } from "./meetTheTeam.model";
import { updateMeetTheTeamSchema } from "./meetTheTeam.validation";
import { IMedia, ILocalizedString } from "./meetTheTeam.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

type Lang = "en" | "ar";
const LANGS: Lang[] = ["en", "ar"];

const FOLDER = "audit-website/meet-the-team/image";
const IMAGE_FIELDS: Record<Lang, string> = { en: "imageEn", ar: "imageAr" };

// ---- Default content, inserted only when the collection is empty ----
// The Arabic text is a translation. Have a native speaker check it.
const DEFAULT_CONTENT: {
  leftTitle: ILocalizedString;
  scriptTitle: ILocalizedString;
  watermark: ILocalizedString;
} = {
  leftTitle: {
    en: "The team you'll actually work with",
    ar: "الفريق الذي ستعمل معه فعليًا",
  },
  scriptTitle: {
    en: "People Behind Your Progress",
    ar: "الأشخاص وراء تقدمك",
  },
  watermark: {
    en: "Auditing • Tax • Accounting",
    ar: "التدقيق • الضرائب • المحاسبة",
  },
};

const ensureDefaults = async (): Promise<void> => {
  if (!(await MeetTheTeam.exists({}))) {
    await MeetTheTeam.create({ ...DEFAULT_CONTENT, image: { en: [], ar: [] } });
  }
};

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

// Multipart sends nested objects as JSON strings. Parse them back.
const normalizeBody = (body: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && /^[\[{]/.test(value.trim())) {
      try {
        out[key] = JSON.parse(value);
        continue;
      } catch {
        // not JSON, keep the raw value and let validation report it
      }
    }
    out[key] = value;
  }
  return out;
};

const toMedia = (items: IMedia[]) =>
  items.map((x) => ({ url: x.url, publicId: x.publicId }));

// GET /v1/api/meet-the-team (public)
export const getMeetTheTeam = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();
    const section = await MeetTheTeam.findOne();
    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/meet-the-team (admin, multipart/form-data)
// Uploading an image replaces the old one for that language
export const updateMeetTheTeam = async (req: Request, res: Response) => {
  try {
    const parsed = updateMeetTheTeamSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    await ensureDefaults();
    const section = await MeetTheTeam.findOne();
    if (!section) {
      res.status(404).json({ status: "error", message: "Section not found" });
      return;
    }

    section.set(parsed.data);

    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    for (const lang of LANGS) {
      const incoming = files?.[IMAGE_FIELDS[lang]];
      if (!incoming?.length) continue;

      const current: IMedia[] = section.get(`image.${lang}`) ?? [];
      toDelete.push(...current.map((x) => x.publicId));

      const added = await uploadMany(incoming, FOLDER, "image");
      section.set(`image.${lang}`, toMedia(added));
    }

    await section.save();
    await Promise.allSettled(
      toDelete.map((publicId) => deleteFromCloudinary(publicId, "image")),
    );

    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
