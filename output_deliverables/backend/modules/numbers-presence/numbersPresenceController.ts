import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  NumbersSection,
  NumbersStat,
  NumbersOffice,
} from "./numbersPresence.model";
import {
  updateSectionSchema,
  createStatSchema,
  updateStatSchema,
  createOfficeSchema,
  updateOfficeSchema,
} from "./numbersPresence.validation";
import { IMedia, ILocalizedString } from "./numbersPresence.interface";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

type Lang = "en" | "ar";
const LANGS: Lang[] = ["en", "ar"];

const SECTION_FOLDER = "audit-website/numbers-presence/section";
const OFFICE_FOLDER = "audit-website/numbers-presence/offices";
const SECTION_BG_FIELDS = {
  sectionBg: { en: "sectionBgEn", ar: "sectionBgAr" },
  panelBg: { en: "panelBgEn", ar: "panelBgAr" },
} as const;
const OFFICE_IMAGE_FIELDS = { en: "imageEn", ar: "imageAr" } as const;

const GREEN = `style="color:#00852B"`;

// ---- Default content, inserted only when the collections are empty ----
// Rich text fields contain HTML with the green highlight as an inline style.
// The Arabic text is a translation. Have a native speaker check it.
const DEFAULT_SECTION: {
  numbersTitle: ILocalizedString;
  securityTitle: ILocalizedString;
  securityText: ILocalizedString;
  insuranceText: ILocalizedString;
  globalLabel: ILocalizedString;
  globalTitle: ILocalizedString;
  globalText: ILocalizedString;
} = {
  numbersTitle: {
    en: `Our Strength <span ${GREEN}>in Numbers</span>`,
    ar: `قوتنا <span ${GREEN}>بالأرقام</span>`,
  },
  securityTitle: {
    en: `Your data is handled <span ${GREEN}>securely and confidentially.</span>`,
    ar: `تُدار بياناتك <span ${GREEN}>بأمان وسرية تامة.</span>`,
  },
  securityText: {
    en: "An NDA is included as standard with every engagement. Client records are stored in secure, access-controlled systems and can only be accessed by authorized team members assigned to your file. Records are retained only for as long as legally required, and your data is never shared outside the engagement team.",
    ar: "تُدرج اتفاقية عدم الإفصاح (NDA) تلقائيًا في كل تعاقد. تُحفظ سجلات العملاء في أنظمة آمنة ومحكومة بالصلاحيات، ولا يطّلع عليها إلا أعضاء الفريق المصرّح لهم والمكلفون بملفك. تُحفظ السجلات فقط للمدة التي يقتضيها القانون، ولا تُشارك بياناتك خارج فريق التعاقد أبدًا.",
  },
  insuranceText: {
    en: "Professional Indemnity Insurance is in place, and a certificate is available upon request.",
    ar: "تأمين المسؤولية المهنية ساري المفعول، وتتوفر الشهادة عند الطلب.",
  },
  globalLabel: { en: "Global Presence", ar: "الحضور العالمي" },
  globalTitle: {
    en: `Serving clients across the <span ${GREEN}>UAE, Canada, the USA and Panama</span>`,
    ar: `نخدم عملاءنا في <span ${GREEN}>الإمارات وكندا والولايات المتحدة وبنما</span>`,
  },
  globalText: {
    en: "Offices in Dubai and Canada (Mississauga), with an active presence in the USA and Panama. If you are entering the UAE from abroad, or running entities in more than one country, you deal with one firm, one engagement and one point of contact.",
    ar: "مكاتب في دبي وكندا (ميسيساغا)، مع حضور فعّال في الولايات المتحدة وبنما. إذا كنت تدخل الإمارات من الخارج، أو تدير كيانات في أكثر من دولة، فستتعامل مع شركة واحدة وتعاقد واحد ونقطة اتصال واحدة.",
  },
};

const DEFAULT_STATS: {
  icon: "users" | "globe" | "document" | "mappin";
  color: "violet" | "emerald" | "green" | "teal";
  value: number;
  suffix: string;
  label: ILocalizedString;
}[] = [
  {
    icon: "users",
    color: "violet",
    value: 25,
    suffix: "+",
    label: { en: "Years of Experience", ar: "سنوات من الخبرة" },
  },
  {
    icon: "globe",
    color: "emerald",
    value: 100,
    suffix: "%",
    label: { en: "UAE National Owned", ar: "مملوكة بالكامل لمواطنين إماراتيين" },
  },
  {
    icon: "document",
    color: "green",
    value: 5,
    suffix: "+",
    label: { en: "Service Areas", ar: "مجالات الخدمة" },
  },
  {
    icon: "mappin",
    color: "teal",
    value: 7,
    suffix: "+",
    label: { en: "Emirates Covered", ar: "إمارات تغطيها خدماتنا" },
  },
];

const DEFAULT_OFFICES: {
  city: ILocalizedString;
  country: ILocalizedString;
  flagCode: string;
}[] = [
  {
    city: { en: "Dubai", ar: "دبي" },
    country: { en: "UAE", ar: "الإمارات" },
    flagCode: "ae",
  },
  {
    city: { en: "Mississauga", ar: "ميسيساغا" },
    country: { en: "Canada", ar: "كندا" },
    flagCode: "ca",
  },
  {
    city: { en: "New York", ar: "نيويورك" },
    country: { en: "USA", ar: "الولايات المتحدة" },
    flagCode: "us",
  },
  {
    city: { en: "Panama City", ar: "مدينة بنما" },
    country: { en: "Panama", ar: "بنما" },
    flagCode: "pa",
  },
];

const ensureDefaults = async (): Promise<void> => {
  if (!(await NumbersSection.exists({}))) {
    await NumbersSection.create({
      ...DEFAULT_SECTION,
      sectionBg: { en: [], ar: [] },
      panelBg: { en: [], ar: [] },
    });
  }
  if (!(await NumbersStat.exists({}))) {
    await NumbersStat.insertMany(
      DEFAULT_STATS.map((s, i) => ({ ...s, order: i })),
    );
  }
  if (!(await NumbersOffice.exists({}))) {
    await NumbersOffice.insertMany(
      DEFAULT_OFFICES.map((o, i) => ({
        ...o,
        order: i,
        image: { en: [], ar: [] },
      })),
    );
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

// Replaces the media for each language that has a new upload.
// Old files are queued for deletion after the save succeeds.
const swapMedia = async (
  doc: any,
  key: string,
  files: Record<string, any[]> | undefined,
  fields: Record<Lang, string>,
  folder: string,
  toDelete: string[],
) => {
  for (const lang of LANGS) {
    const incoming = files?.[fields[lang]];
    if (!incoming?.length) continue;

    const current: IMedia[] = doc.get(`${key}.${lang}`) ?? [];
    toDelete.push(...current.map((x) => x.publicId));

    const added = await uploadMany(incoming, folder, "image");
    doc.set(`${key}.${lang}`, toMedia(added));
  }
};

// GET /v1/api/numbers-presence (public)
// Returns the section, the stats, and the offices, each sorted by order
export const getNumbersPresence = async (_req: Request, res: Response) => {
  try {
    await ensureDefaults();

    const [section, stats, offices] = await Promise.all([
      NumbersSection.findOne(),
      NumbersStat.find().sort({ order: 1, createdAt: 1 }),
      NumbersOffice.find().sort({ order: 1, createdAt: 1 }),
    ]);

    res.status(200).json({
      status: "success",
      data: { section, stats, offices },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/numbers-presence/section (admin, JSON or multipart)
// Uploading a background replaces the old one for that language
export const updateSection = async (req: Request, res: Response) => {
  try {
    const parsed = updateSectionSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    await ensureDefaults();
    const section = await NumbersSection.findOne();
    if (!section) {
      res.status(404).json({ status: "error", message: "Section not found" });
      return;
    }

    section.set(parsed.data);

    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    await swapMedia(section, "sectionBg", files, SECTION_BG_FIELDS.sectionBg, SECTION_FOLDER, toDelete);
    await swapMedia(section, "panelBg", files, SECTION_BG_FIELDS.panelBg, SECTION_FOLDER, toDelete);

    await section.save();
    await Promise.allSettled(
      toDelete.map((publicId) => deleteFromCloudinary(publicId, "image")),
    );

    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---- Stats ----

// POST /v1/api/numbers-presence/stats (admin)
export const createStat = async (req: Request, res: Response) => {
  try {
    const parsed = createStatSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const stat = await NumbersStat.create(parsed.data);
    res.status(201).json({ status: "success", data: stat });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/numbers-presence/stats/:id (admin)
export const updateStat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid stat id" });
      return;
    }

    const parsed = updateStatSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const stat = await NumbersStat.findByIdAndUpdate(id, parsed.data, {
      new: true,
      runValidators: true,
    });
    if (!stat) {
      res.status(404).json({ status: "error", message: "Stat not found" });
      return;
    }

    res.status(200).json({ status: "success", data: stat });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /v1/api/numbers-presence/stats/:id (admin)
export const deleteStat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid stat id" });
      return;
    }

    const stat = await NumbersStat.findByIdAndDelete(id);
    if (!stat) {
      res.status(404).json({ status: "error", message: "Stat not found" });
      return;
    }

    res.status(200).json({ status: "success", message: "Stat deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---- Offices ----

// POST /v1/api/numbers-presence/offices (admin, multipart/form-data)
export const createOffice = async (req: Request, res: Response) => {
  try {
    const parsed = createOfficeSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const image = {
      en: await uploadMany(files?.[OFFICE_IMAGE_FIELDS.en], OFFICE_FOLDER, "image"),
      ar: await uploadMany(files?.[OFFICE_IMAGE_FIELDS.ar], OFFICE_FOLDER, "image"),
    };

    const office = await NumbersOffice.create({
      ...parsed.data,
      image: { en: toMedia(image.en), ar: toMedia(image.ar) },
    });

    res.status(201).json({ status: "success", data: office });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /v1/api/numbers-presence/offices/:id (admin, multipart/form-data)
// New images are added. removePublicIds deletes existing images.
export const updateOffice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid office id" });
      return;
    }

    const parsed = updateOfficeSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: zodMessage(parsed.error) });
      return;
    }

    const office = await NumbersOffice.findById(id);
    if (!office) {
      res.status(404).json({ status: "error", message: "Office not found" });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    const files = req.files as Record<string, any[]> | undefined;
    const toDelete: string[] = [];

    office.set(fields);

    for (const lang of LANGS) {
      const current: IMedia[] = office.get(`image.${lang}`) ?? [];

      toDelete.push(
        ...current
          .filter((x) => removePublicIds.includes(x.publicId))
          .map((x) => x.publicId),
      );
      const keep = current.filter((x) => !removePublicIds.includes(x.publicId));

      const added = await uploadMany(files?.[OFFICE_IMAGE_FIELDS[lang]], OFFICE_FOLDER, "image");
      office.set(`image.${lang}`, toMedia([...keep, ...added]));
    }

    await office.save();
    await Promise.allSettled(
      toDelete.map((publicId) => deleteFromCloudinary(publicId, "image")),
    );

    res.status(200).json({ status: "success", data: office });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// DELETE /v1/api/numbers-presence/offices/:id (admin, also deletes images from Cloudinary)
export const deleteOffice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid office id" });
      return;
    }

    const office = await NumbersOffice.findByIdAndDelete(id);
    if (!office) {
      res.status(404).json({ status: "error", message: "Office not found" });
      return;
    }

    const jobs = [...office.image.en, ...office.image.ar].map((x) =>
      deleteFromCloudinary(x.publicId, "image"),
    );
    await Promise.allSettled(jobs);

    res.status(200).json({ status: "success", message: "Office deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
