import { Request, Response } from "express";
import mongoose from "mongoose";
import { ConsultationSection, ConsultationEnquiry } from "./consultation.model";
import {
  updateConsultationSectionSchema,
  createConsultationEnquirySchema,
  updateEnquiryStatusSchema,
} from "./consultation.validation";
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
  title: { en: "Need an Audit or", ar: "هل تحتاج إلى تدقيق أو" },
  colorTitle: { en: "Tax Advice?", ar: "استشارة ضريبية؟" },
  subtitle: {
    en: "Speak to our team today. Your first consultation is free and confidential.",
    ar: "تواصل مع فريقنا اليوم. استشارتك الأولى مجانية وسرية بالكامل.",
  },
  watermark: { en: "Ahmed Al Mazroei", ar: "أحمد المزروعي" },
  bgImage: {
    en: [{ url: "/img/banner/bg5.avif", publicId: "" }],
    ar: [{ url: "/img/banner/bg5.avif", publicId: "" }],
  },
  cardImage: {
    en: [{ url: "/img/banner/1.jpg", publicId: "" }],
    ar: [{ url: "/img/banner/1.jpg", publicId: "" }],
  },
  formTitle: { en: "Send us an enquiry", ar: "أرسل لنا استفسارك" },
  formSubtitle: { en: "Fill in your details and we'll get back to you promptly.", ar: "املأ بياناتك وسنعاود الاتصال بك في أسرع وقت." },
  buttonLabel: { en: "Send Request", ar: "إرسال الطلب" },
  confidentialNote: {
    en: "Your information will be handled confidentially.",
    ar: "سيتم التعامل مع معلوماتك بسرية تامة ومطلقة.",
  },
  contactBoxTitle: { en: "Get in touch", ar: "تواصل معنا" },
  contactBoxSubtitle: { en: "We're here to help.", ar: "نحن هنا لمساعدتك." },
  contactBoxDesc: {
    en: "Have a question or need expert advice? Reach out to our team directly.",
    ar: "هل لديك سؤال أو تحتاج إلى مشورة خبير؟ تواصل مع فريقنا مباشرة.",
  },
  officeHours: { en: "Mon – Sat: 09am to 06pm", ar: "الإثنين – السبت: 09:00 ص إلى 06:00 م" },
  phone: "+971 52 178 6209",
  email: "info@almazroeiaudit.com",
};

export const ensureDefaultConsultation = async (): Promise<void> => {
  const exists = await ConsultationSection.exists({});
  if (exists) return;
  await ConsultationSection.create(DEFAULT_SECTION);
};

export const getConsultationData = async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultConsultation();
    let section = await ConsultationSection.findOne();
    if (!section) section = await ConsultationSection.create(DEFAULT_SECTION);
    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateConsultationSection = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultConsultation();
    let section = await ConsultationSection.findOne();
    if (!section) section = await ConsultationSection.create(DEFAULT_SECTION);

    const parsed = updateConsultationSectionSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    section.set(fields);

    const files = req.files as Record<string, any[]> | undefined;
    const mediaConfigs = [
      { key: "bgImage", folder: "audit-website/consultation/bg", fields: { en: "bgImageEn", ar: "bgImageAr" } },
      { key: "cardImage", folder: "audit-website/consultation/card", fields: { en: "cardImageEn", ar: "cardImageAr" } },
    ];

    for (const m of mediaConfigs) {
      for (const lang of ["en", "ar"] as const) {
        const fieldName = m.fields[lang];
        const currentList = (section.get(m.key + "." + lang) || []) as any[];
        const keep = currentList.filter((item: any) => !removePublicIds?.includes(item.publicId));

        const uploaded = await uploadMany(files?.[fieldName], m.folder, "image");
        if (uploaded.length > 0) {
          section.set(m.key + "." + lang, [...keep, ...uploaded]);
        } else if (removePublicIds && removePublicIds.length > 0) {
          section.set(m.key + "." + lang, keep);
        }
      }
    }

    await section.save();
    res.status(200).json({ status: "success", data: section });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createConsultationEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createConsultationEnquirySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const enquiry = await ConsultationEnquiry.create(parsed.data);
    res.status(201).json({ status: "success", message: "Consultation enquiry received", data: enquiry });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getConsultationEnquiries = async (_req: Request, res: Response): Promise<void> => {
  try {
    const enquiries = await ConsultationEnquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", results: enquiries.length, data: enquiries });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateConsultationEnquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid ID" });
      return;
    }

    const parsed = updateEnquiryStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Invalid status" });
      return;
    }

    const enquiry = await ConsultationEnquiry.findByIdAndUpdate(id, { status: parsed.data.status }, { new: true });
    if (!enquiry) {
      res.status(404).json({ status: "error", message: "Enquiry not found" });
      return;
    }
    res.status(200).json({ status: "success", data: enquiry });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const deleteConsultationEnquiry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ status: "error", message: "Invalid ID" });
      return;
    }
    await ConsultationEnquiry.findByIdAndDelete(id);
    res.status(200).json({ status: "success", message: "Enquiry deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
