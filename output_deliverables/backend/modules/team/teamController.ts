import { Request, Response } from "express";
import mongoose from "mongoose";
import { TeamSection, LeadershipMember, TeamMember } from "./team.model";
import {
  updateTeamSectionSchema,
  createLeadershipSchema,
  updateLeadershipSchema,
  createTeamMemberSchema,
  updateTeamMemberSchema,
} from "./team.validation";
import { uploadMany, deleteFromCloudinary } from "../../middlewares/upload";

const normalizeBody = (body: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === "string" && /^[\[\{]/.test(value.trim())) {
      try {
        out[key] = JSON.parse(value);
        continue;
      } catch {}
    }
    out[key] = value;
  }
  return out;
};

const DEFAULT_SECTION = {
  leadershipTitle: { en: "Meet Our", ar: "تعرف على" },
  leadershipColorTitle: { en: "Leadership Team", ar: "فريق القيادة" },
  leadershipSubtitle: {
    en: "Meet our experienced leadership team, dedicated to delivering excellence, building lasting relationships, and guiding our firm with integrity.",
    ar: "تعرف على فريق القيادة المتمرس لدينا، المكرس لتقديم التميز وبناء علاقات دائمة وقيادة شركتنا بنزاهة واحترافية عالية.",
  },
  leadershipWatermark: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },

  teamTitle: { en: "Meet the Team", ar: "تعرف على فريق العمل" },
  teamColorTitle: { en: "Behind Your Business", ar: "الداعم لأعمالك" },
  teamSubtitle: {
    en: "The accountants, tax agents and corporate advisers who handle your UAE compliance day to day.",
    ar: "المحاسبون والوكلاء الضريبيون ومستشارو الشركات الذين يديرون امتثال أعمالك في الإمارات يوماً بعد يوم.",
  },
  teamWatermark: { en: "Our Team", ar: "فريقنا" },
};

const DEFAULT_LEADERSHIP = [
  {
    name: { en: "Mr. Ahmed Al Mazroei, UAE-CA.", ar: "السيد أحمد المزروعي، محاسب قانوني إماراتي" },
    role: { en: "Director of Accounting and Taxation", ar: "مدير المحاسبة والضرائب" },
    bio: {
      en: "Mr. Ahmed Al Mazroei is a respected business professional associated with Ahmed Al Mazroei Auditing & Accounting, a UAE-based firm established in 2000. With a strong commitment to professionalism, integrity, and excellence, he represents a vision focused on delivering reliable financial, auditing, accounting, and business advisory services. Under his leadership and guidance, the firm aims to provide comprehensive financial solutions, maintain the highest standards of professional ethics, and build long-term relationships based on trust, transparency, and client satisfaction.",
      ar: "يعد السيد أحمد المزروعي من الكفاءات المهنية البارزة في دولة الإمارات، حيث أسس المكتب في عام 2000 برؤية تركز على تقديم خدمات مالية وتدقيقية واستشارية موثوقة وعالية الجودة. وتحت قيادته وتوجيهه، يسعى المكتب إلى تقديم حلول مالية متكاملة وفق أعلى معايير الأخلاق المهنية، وبناء علاقات استراتيجية طويلة الأمد تقوم على الثقة والشفافية التامة ورضا العملاء.",
    },
    image: {
      en: [{ url: "/img/about/5.jpg", publicId: "" }],
      ar: [{ url: "/img/about/5.jpg", publicId: "" }],
    },
    order: 0,
  },
];

const DEFAULT_MEMBERS = [
  {
    name: { en: "Siflan Mohammad", ar: "سفلان محمد" },
    role: { en: "Senior Accounting Associate", ar: "مساعد محاسب أول" },
    dept: { en: "Accounting & Tax", ar: "المحاسبة والضرائب" },
    image: { en: [{ url: "/img/about/5.jpg", publicId: "" }], ar: [{ url: "/img/about/5.jpg", publicId: "" }] },
    order: 0,
  },
  {
    name: { en: "Hamza Al Kaabi", ar: "حمزة الكعبي" },
    role: { en: "Senior Audit Supervisor", ar: "مشرف تدقيق أول" },
    dept: { en: "Audit & Assurance", ar: "التدقيق والتأكيد" },
    image: { en: [{ url: "/img/about/5.jpg", publicId: "" }], ar: [{ url: "/img/about/5.jpg", publicId: "" }] },
    order: 1,
  },
  {
    name: { en: "Fatima Al Suwaidi", ar: "فاطمة السويدي" },
    role: { en: "Corporate Tax Specialist", ar: "أخصائية ضرائب شركات" },
    dept: { en: "Tax Advisory", ar: "الاستشارات الضريبية" },
    image: { en: [{ url: "/img/about/5.jpg", publicId: "" }], ar: [{ url: "/img/about/5.jpg", publicId: "" }] },
    order: 2,
  },
  {
    name: { en: "Rashid Mansoor", ar: "راشد منصور" },
    role: { en: "VAT & Compliance Manager", ar: "مدير ضريبة القيمة المضافة والامتثال" },
    dept: { en: "Tax & Compliance", ar: "الضرائب والامتثال" },
    image: { en: [{ url: "/img/about/5.jpg", publicId: "" }], ar: [{ url: "/img/about/5.jpg", publicId: "" }] },
    order: 3,
  },
  {
    name: { en: "Zainab Al Hosani", ar: "زينب الحوسني" },
    role: { en: "Business Advisory Consultant", ar: "مستشارة أعمال وتطوير" },
    dept: { en: "Corporate Advisory", ar: "الاستشارات المؤسسية" },
    image: { en: [{ url: "/img/about/5.jpg", publicId: "" }], ar: [{ url: "/img/about/5.jpg", publicId: "" }] },
    order: 4,
  },
];

export const ensureDefaultTeam = async (): Promise<void> => {
  const sectionExists = await TeamSection.exists({});
  if (!sectionExists) await TeamSection.create(DEFAULT_SECTION);

  const leadCount = await LeadershipMember.countDocuments();
  if (leadCount === 0) await LeadershipMember.insertMany(DEFAULT_LEADERSHIP);

  const memberCount = await TeamMember.countDocuments();
  if (memberCount === 0) await TeamMember.insertMany(DEFAULT_MEMBERS);
};

export const getTeamData = async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultTeam();
    const section = await TeamSection.findOne();
    const leadership = await LeadershipMember.find().sort({ order: 1 });
    const members = await TeamMember.find().sort({ order: 1 });
    res.status(200).json({
      status: "success",
      data: {
        section,
        leadership,
        members,
      },
    });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateTeamSection = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultTeam();
    let section = await TeamSection.findOne();
    if (!section) section = await TeamSection.create(DEFAULT_SECTION);

    const parsed = updateTeamSectionSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    section.set(parsed.data);
    await section.save();
    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createLeadershipMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createLeadershipSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const image = { en: [], ar: [] } as any;
    for (const lang of ["en", "ar"] as const) {
      const fieldName = lang === "en" ? "imageEn" : "imageAr";
      image[lang] = await uploadMany(files?.[fieldName], "audit-website/team/leadership", "image");
    }

    const member = await LeadershipMember.create({ ...parsed.data, image });
    res.status(201).json({ status: "success", data: member });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateLeadershipMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid ID" });
      return;
    }
    const member = await LeadershipMember.findById(id);
    if (!member) {
      res.status(404).json({ status: "error", message: "Leader not found" });
      return;
    }

    const parsed = updateLeadershipSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    member.set(fields);

    const files = req.files as Record<string, any[]> | undefined;
    for (const lang of ["en", "ar"] as const) {
      const fieldName = lang === "en" ? "imageEn" : "imageAr";
      const currentList = (member.get("image." + lang) || []) as any[];
      const keep = currentList.filter((x: any) => !removePublicIds?.includes(x.publicId));

      const uploaded = await uploadMany(files?.[fieldName], "audit-website/team/leadership", "image");
      if (uploaded.length > 0) {
        member.set("image." + lang, [...keep, ...uploaded]);
      } else if (removePublicIds && removePublicIds.length > 0) {
        member.set("image." + lang, keep);
      }
    }

    await member.save();
    res.status(200).json({ status: "success", data: member });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteLeadershipMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid ID" });
      return;
    }
    await LeadershipMember.findByIdAndDelete(id);
    res.status(200).json({ status: "success", message: "Leadership member deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createTeamMemberSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const files = req.files as Record<string, any[]> | undefined;
    const image = { en: [], ar: [] } as any;
    for (const lang of ["en", "ar"] as const) {
      const fieldName = lang === "en" ? "imageEn" : "imageAr";
      image[lang] = await uploadMany(files?.[fieldName], "audit-website/team/members", "image");
    }

    const member = await TeamMember.create({ ...parsed.data, image });
    res.status(201).json({ status: "success", data: member });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid ID" });
      return;
    }
    const member = await TeamMember.findById(id);
    if (!member) {
      res.status(404).json({ status: "error", message: "Member not found" });
      return;
    }

    const parsed = updateTeamMemberSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    member.set(fields);

    const files = req.files as Record<string, any[]> | undefined;
    for (const lang of ["en", "ar"] as const) {
      const fieldName = lang === "en" ? "imageEn" : "imageAr";
      const currentList = (member.get("image." + lang) || []) as any[];
      const keep = currentList.filter((x: any) => !removePublicIds?.includes(x.publicId));

      const uploaded = await uploadMany(files?.[fieldName], "audit-website/team/members", "image");
      if (uploaded.length > 0) {
        member.set("image." + lang, [...keep, ...uploaded]);
      } else if (removePublicIds && removePublicIds.length > 0) {
        member.set("image." + lang, keep);
      }
    }

    await member.save();
    res.status(200).json({ status: "success", data: member });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid ID" });
      return;
    }
    await TeamMember.findByIdAndDelete(id);
    res.status(200).json({ status: "success", message: "Team member deleted" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
