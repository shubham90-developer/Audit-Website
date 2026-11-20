import type { Request, Response } from "express";
import { FaqSection } from "./model";
import { faqSectionSchema } from "./validation";
import { uploadBuffer, deleteFromCloudinary } from "../../middlewares/upload";

const t = (en: string, ar: string) => ({ en, ar });
const defaultData = {
  singleton: "faq-page",
  title: t("Frequently Asked Questions", "الأسئلة الشائعة"),
  description: t(
    "Clear answers on company setup, corporate tax, VAT, accounting, audit and visas in Dubai and the UAE, from an FTA registered tax agency.",
    "إجابات واضحة حول تأسيس الشركات والضرائب والمحاسبة والتدقيق والتأشيرات في دبي والإمارات.",
  ),
  breadcrumbHome: t("Home", "الرئيسية"),
  exploreLabel: t("EXPLORE ANSWERS", "استكشف الإجابات"),
  questionsLabel: t("Questions", "أسئلة"),
  emptyLabel: t("Questions coming soon", "الأسئلة ستتوفر قريباً"),
  ctaTitle: t("Still have questions?", "هل لديك المزيد من الأسئلة؟"),
  ctaDescription: t(
    "Our team is ready to help with your business and financial needs.",
    "فريقنا مستعد لمساعدتك في احتياجاتك التجارية والمالية.",
  ),
  ctaButton: t("Contact Our Team", "تواصل مع فريقنا"),
  backgroundImage: {
    en: { url: "/img/banner/bg2.avif", publicId: "" },
    ar: { url: "/img/banner/bg2.avif", publicId: "" },
  },
  categories: [
    {
      name: t("About Ahmed Al Mazroei", "عن أحمد المزروعي"),
      order: 0,
      active: true,
      questions: [
        {
          question: t(
            "What services do you provide?",
            "ما الخدمات التي تقدمونها؟",
          ),
          answer: t(
            "We offer accounting, tax, audit and business advisory services. This is sample content.",
            "نقدم خدمات المحاسبة والضرائب والتدقيق والاستشارات التجارية. هذا محتوى تجريبي.",
          ),
          order: 0,
          active: true,
        },
        {
          question: t("How can I get started?", "كيف يمكنني البدء؟"),
          answer: t(
            "Contact our team to discuss your requirements. This is sample content.",
            "تواصل مع فريقنا لمناقشة متطلباتك. هذا محتوى تجريبي.",
          ),
          order: 1,
          active: true,
        },
      ],
    },
    ...[
      ["Business Setup", "تأسيس الأعمال"],
      ["Tax", "الضرائب"],
      ["Accounting", "المحاسبة"],
      ["Audit & Compliance", "التدقيق والامتثال"],
      ["Corporate Services", "خدمات الشركات"],
      ["Visa & Other", "التأشيرات وغيرها"],
    ].map(([en, ar], i) => ({
      name: t(en, ar),
      order: i + 1,
      active: true,
      questions: [],
    })),
  ],
};

export const getFaqSection = async (_req: Request, res: Response) => {
  try {
    const data = await FaqSection.findOneAndUpdate(
      { singleton: "faq-page" },
      { $setOnInsert: defaultData },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
    );
    res.json({ success: true, data });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const updateFaqSection = async (req: Request, res: Response) => {
  try {
    const parsedBody =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
    const validated = faqSectionSchema.safeParse(parsedBody);
    if (!validated.success) {
      res.status(400).json({
        success: false,
        message: validated.error.issues
          .map((x) => `${x.path.join(".")}: ${x.message}`)
          .join("; "),
      });
      return;
    }
    const existing = await FaqSection.findOne({ singleton: "faq-page" });
    const { backgroundImage: _ignored, ...incoming } = validated.data;
    const files: Express.Multer.File[] = Array.isArray(req.files)
      ? req.files
      : req.files
        ? Object.values(req.files).flat()
        : [];
    const uploaded: { publicId: string }[] = [];
    const oldMedia: { publicId: string }[] = [];
    const backgroundImage = {
      en: {
        url:
          existing?.backgroundImage?.en?.url ??
          defaultData.backgroundImage.en.url,
        publicId: existing?.backgroundImage?.en?.publicId ?? "",
      },
      ar: {
        url:
          existing?.backgroundImage?.ar?.url ??
          defaultData.backgroundImage.ar.url,
        publicId: existing?.backgroundImage?.ar?.publicId ?? "",
      },
    };
    try {
      for (const lang of ["en", "ar"] as const) {
        const file = files.find(
          (f) =>
            f.fieldname === `backgroundImage${lang === "en" ? "En" : "Ar"}`,
        );
        if (file) {
          const next = await uploadBuffer(
            file.buffer,
            "audit-website/faq",
            "image",
          );
          uploaded.push(next);
          if (backgroundImage[lang].publicId)
            oldMedia.push({ publicId: backgroundImage[lang].publicId });
          backgroundImage[lang] = next;
        }
      }
      const data = await FaqSection.findOneAndUpdate(
        { singleton: "faq-page" },
        { $set: { ...incoming, backgroundImage } },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      );
      await Promise.allSettled(
        oldMedia.map((m) => deleteFromCloudinary(m.publicId, "image")),
      );
      res.json({ success: true, data });
    } catch (e) {
      await Promise.allSettled(
        uploaded.map((m) => deleteFromCloudinary(m.publicId, "image")),
      );
      throw e;
    }
  } catch (e: any) {
    res.status(500).json({ success: false, message: e.message });
  }
};
