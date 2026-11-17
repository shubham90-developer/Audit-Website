import { Request, Response } from "express";
import mongoose from "mongoose";

import { LeadershipSection, LeadershipMember } from "./model";

import {
  updateLeadershipSectionSchema,
  createLeadershipMemberSchema,
  updateLeadershipMemberSchema,
} from "./validation";

import { IMedia, Lang } from "./interface";

import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const LANGS: Lang[] = ["en", "ar"];

const SECTION_FOLDER = "audit-website/leadership/section";
const MEMBER_FOLDER = "audit-website/leadership/members";

const SECTION_FIELDS = {
  en: "bgImageEn",
  ar: "bgImageAr",
};

const MEMBER_FIELDS = {
  en: "imageEn",
  ar: "imageAr",
};

const DEFAULT_SECTION = {
  leadershipTitle: {
    en: "Meet Our Leadership Team",
    ar: "تعرف على فريق القيادة لدينا",
  },

  leadershipDescription: {
    en: "Meet our experienced leadership team, dedicated to delivering excellence, building lasting relationships, and guiding our firm with integrity, expertise, and professionalism.",
    ar: "تعرف على فريق القيادة ذو الخبرة لدينا، الملتزم بتقديم التميز وبناء علاقات طويلة الأمد وقيادة شركتنا بالنزاهة والخبرة والاحترافية.",
  },

  teamTitle: {
    en: "Meet the Team Behind Your Business",
    ar: "تعرف على الفريق الذي يدعم أعمالك",
  },

  teamDescription: {
    en: "The accountants, tax agents and corporate advisers who handle your UAE compliance day to day.",
    ar: "فريق المحاسبين والوكلاء الضريبيين ومستشاري الشركات الذين يدعمون أعمالك ويديرون متطلبات الامتثال اليومية.",
  },

  backgroundImage: {
    en: [],
    ar: [],
  },
};

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

const normalizeBody = (body: Record<string, any>) => {
  const out: Record<string, any> = {};

  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string") {
      const trimmed = value.trim();

      if (/^[\[{]/.test(trimmed)) {
        try {
          out[key] = JSON.parse(trimmed);
          continue;
        } catch {}
      }

      if (trimmed === "true") {
        out[key] = true;
        continue;
      }

      if (trimmed === "false") {
        out[key] = false;
        continue;
      }
    }

    out[key] = value;
  }

  return out;
};

const toMedia = (items: { url: string; publicId?: string }[]): IMedia[] =>
  items.map((item) => ({
    url: item.url,
    publicId: item.publicId ?? "",
  }));

const mediaIds = (list?: { publicId?: string }[]): string[] =>
  (list ?? []).map((item) => item.publicId ?? "").filter(Boolean);

const deleteAll = (ids: string[]) =>
  Promise.allSettled(ids.map((id) => deleteFromCloudinary(id, "image")));

// ================= DEFAULT SECTION =================

const ensureDefaults = async () => {
  if (!(await LeadershipSection.exists({}))) {
    await LeadershipSection.create(DEFAULT_SECTION);
  }
};

// ================= GET PUBLIC CONTENT =================

// GET /v1/api/leadership

export const getLeadership = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();

    const [section, members] = await Promise.all([
      LeadershipSection.findOne(),

      LeadershipMember.find({
        isActive: true,
      }).sort({
        order: 1,
        createdAt: 1,
      }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        section,
        featuredLeader: members.find((m) => m.isFeatured) ?? null,
        members: members.filter((m) => !m.isFeatured),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ================= GET ADMIN CONTENT =================

// GET /v1/api/leadership/admin

export const getLeadershipAdmin = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();

    const [section, members] = await Promise.all([
      LeadershipSection.findOne(),

      LeadershipMember.find().sort({
        order: 1,
        createdAt: 1,
      }),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        section,
        members,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ================= UPDATE SECTION =================

// PATCH /v1/api/leadership/section

export const updateLeadershipSection = async (req: Request, res: Response) => {
  try {
    const parsed = updateLeadershipSectionSchema.safeParse(
      normalizeBody(req.body),
    );

    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        message: zodMessage(parsed.error),
      });
      return;
    }

    await ensureDefaults();

    const section = await LeadershipSection.findOne();

    if (!section) {
      res.status(404).json({
        status: "error",
        message: "Leadership section not found",
      });
      return;
    }

    section.set(parsed.data);

    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    const toDelete: string[] = [];

    for (const lang of LANGS) {
      const incoming = files?.[SECTION_FIELDS[lang]];

      if (!incoming?.length) continue;

      const path = `backgroundImage.${lang}`;

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

// ================= CREATE MEMBER =================

// POST /v1/api/leadership/members

export const createLeadershipMember = async (req: Request, res: Response) => {
  try {
    const parsed = createLeadershipMemberSchema.safeParse(
      normalizeBody(req.body),
    );

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

    const image = {
      en: await uploadMany(files?.[MEMBER_FIELDS.en], MEMBER_FOLDER, "image"),

      ar: await uploadMany(files?.[MEMBER_FIELDS.ar], MEMBER_FOLDER, "image"),
    };

    // Only one featured leader is allowed.
    if (parsed.data.isFeatured) {
      await LeadershipMember.updateMany(
        { isFeatured: true },
        { $set: { isFeatured: false } },
      );
    }

    const member = await LeadershipMember.create({
      ...parsed.data,

      image: {
        en: toMedia(image.en),
        ar: toMedia(image.ar),
      },
    });

    res.status(201).json({
      status: "success",
      data: member,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ================= UPDATE MEMBER =================

// PATCH /v1/api/leadership/members/:id

export const updateLeadershipMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid member id",
      });
      return;
    }

    const parsed = updateLeadershipMemberSchema.safeParse(
      normalizeBody(req.body),
    );

    if (!parsed.success) {
      res.status(400).json({
        status: "error",
        message: zodMessage(parsed.error),
      });
      return;
    }

    const member = await LeadershipMember.findById(id);

    if (!member) {
      res.status(404).json({
        status: "error",
        message: "Member not found",
      });
      return;
    }

    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    const toDelete: string[] = [];

    for (const lang of LANGS) {
      const incoming = files?.[MEMBER_FIELDS[lang]];

      if (!incoming?.length) continue;

      const path = `image.${lang}`;

      toDelete.push(...mediaIds(member.get(path)));

      const uploaded = await uploadMany(incoming, MEMBER_FOLDER, "image");

      member.set(path, toMedia(uploaded));
    }

    // Remove featured status from other members.
    if (parsed.data.isFeatured === true) {
      await LeadershipMember.updateMany(
        {
          _id: { $ne: id },
          isFeatured: true,
        },
        {
          $set: { isFeatured: false },
        },
      );
    }

    member.set(parsed.data);

    await member.save();

    await deleteAll(toDelete);

    res.status(200).json({
      status: "success",
      data: member,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// ================= DELETE MEMBER =================

// DELETE /v1/api/leadership/members/:id

export const deleteLeadershipMember = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({
        status: "error",
        message: "Invalid member id",
      });
      return;
    }

    const member = await LeadershipMember.findByIdAndDelete(id);

    if (!member) {
      res.status(404).json({
        status: "error",
        message: "Member not found",
      });
      return;
    }

    await deleteAll([
      ...mediaIds(member.image.en),
      ...mediaIds(member.image.ar),
    ]);

    res.status(200).json({
      status: "success",
      message: "Team member deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
