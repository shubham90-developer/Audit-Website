import { Request, Response } from "express";
import { Insight } from "./insights.model";
import { uploadBuffer, deleteMedia } from "../../utils/cloudinary";

const SEED_INSIGHTS = [
  {
    type: "blog",
    title: {
      en: "Permanent Establishment in UAE: When a Foreign Company Pays Corporate Tax",
      ar: "المنشأة الدائمة في دولة الإمارات: متى تدفع الشركة الأجنبية ضريبة الشركات",
    },
    excerpt: {
      en: "A foreign company has a permanent establishment in the UAE when it runs a fixed place of business or an agent habitually concludes contracts here.",
      ar: "تمتلك الشركة الأجنبية منشأة دائمة في الإمارات عندما تدير مكان عمل ثابت أو يبرم وكيل العقود بانتظام هنا.",
    },
    content: {
      en: "<p>Understanding corporate tax implications for foreign entities operating in the UAE is essential to avoid non-compliance and heavy penalties.</p>",
      ar: "<p>يعد فهم آثار ضريبة الشركات على الكيانات الأجنبية العاملة في دولة الإمارات أمرًا ضروريًا لتجنب عدم الامتثال والغرامات الباهظة.</p>",
    },
    category: { en: "Corporate Tax", ar: "ضريبة الشركات" },
    tag: { en: "Corporate Tax", ar: "ضريبة الشركات" },
    author: { en: "Mr. Ahmed Al Mazroei", ar: "السيد أحمد المزروعي" },
    reviewedBy: {
      en: "Mr. Ahmed Al Mazroei, Sr. Accountant & Tax Consultant",
      ar: "السيد أحمد المزروعي، محاسب أول ومستشار ضريبي",
    },
    readTime: { en: "5 minutes", ar: "5 دقائق" },
    date: "31 Oct 2026",
    slug: "permanent-establishment-uae",
    media: { url: "/img/banner/1.jpg", publicId: "default" },
    featured: true,
    order: 1,
  },
  {
    type: "blog",
    title: {
      en: "Do Freelancers and Sole Establishments Pay Corporate Tax in UAE?",
      ar: "هل يدفع أصحاب المهن الحرة والمؤسسات الفردية ضريبة الشركات في الإمارات؟",
    },
    excerpt: {
      en: "Freelancers and sole establishment owners pay UAE corporate tax once business turnover crosses the AED 1 million threshold.",
      ar: "يدفع المستقلون وأصحاب المؤسسات الفردية ضريبة الشركات بمجرد تجاوز إيرادات الأعمال حد مليون درهم.",
    },
    content: {
      en: "<p>Freelance permits and sole establishments are increasingly common in the UAE, but owners must remain vigilant about tax turnover thresholds.</p>",
      ar: "<p>أصبحت تصاريح العمل الحر والمؤسسات الفردية شائعة بشكل متزايد في الإمارات، ولكن يجب على الملاك توخي الحذر بشأن حدود الإيرادات الخاضعة للضريبة.</p>",
    },
    category: { en: "Corporate Tax", ar: "ضريبة الشركات" },
    tag: { en: "Freelancers", ar: "العمل الحر" },
    author: { en: "Mr. Ahmed Al Mazroei", ar: "السيد أحمد المزروعي" },
    reviewedBy: {
      en: "Mr. Ahmed Al Mazroei, Sr. Accountant & Tax Consultant",
      ar: "السيد أحمد المزروعي، محاسب أول ومستشار ضريبي",
    },
    readTime: { en: "4 minutes", ar: "4 دقائق" },
    date: "28 Oct 2026",
    slug: "freelancers-corporate-tax-uae",
    media: { url: "/img/banner/1.jpg", publicId: "default" },
    featured: false,
    order: 2,
  },
  {
    type: "blog",
    title: {
      en: "Cloud Accounting for Small Businesses in the UAE: 2026 Guide",
      ar: "المحاسبة السحابية للشركات الصغيرة في الإمارات: دليل 2026",
    },
    excerpt: {
      en: "Cloud accounting keeps your books in online software you can open from anywhere, with real-time VAT-ready reports.",
      ar: "تحافظ المحاسبة السحابية على دفاترك في برامج عبر الإنترنت يمكنك فتحها من أي مكان مع تقارير فورية جاهزة لضريبة القيمة المضافة.",
    },
    content: {
      en: "<p>Transitioning to cloud-based accounting platforms improves real-time financial tracking and simplifies FTA audit filings.</p>",
      ar: "<p>يؤدي الانتقال إلى منصات المحاسبة السحابية إلى تحسين التتبع المالي الفوري وتبسيط ملفات التدقيق لدى الهيئة الاتحادية للضرائب.</p>",
    },
    category: { en: "Accounting", ar: "المحاسبة" },
    tag: { en: "Cloud Accounting", ar: "المحاسبة السحابية" },
    author: { en: "Mr. Ahmed Al Mazroei", ar: "السيد أحمد المزروعي" },
    reviewedBy: {
      en: "Mr. Ahmed Al Mazroei, Sr. Accountant & Tax Consultant",
      ar: "السيد أحمد المزروعي، محاسب أول ومستشار ضريبي",
    },
    readTime: { en: "6 minutes", ar: "6 دقائق" },
    date: "24 Oct 2026",
    slug: "cloud-accounting-uae",
    media: { url: "/img/banner/1.jpg", publicId: "default" },
    featured: false,
    order: 3,
  },
  {
    type: "blog",
    title: {
      en: "Is Audit Mandatory in the UAE? CT & Free Zone Rules 2026",
      ar: "هل التدقيق إلزامي في الإمارات؟ قواعد ضريبة الشركات والمناطق الحرة 2026",
    },
    excerpt: {
      en: "Check your revenue, your free zone status and your licence conditions to see if an audit is required for your company.",
      ar: "تحقق من إيراداتك ووضع منطقتك الحرة وشروط ترخيصك لمعرفة ما إذا كان التدقيق مطلوبًا لشركتك.",
    },
    content: {
      en: "<p>Both mainland and free zone entities must satisfy statutory audit requirements based on local corporate laws and qualifying free zone person criteria.</p>",
      ar: "<p>يجب على كل من الشركات في البر الرئيسي والمناطق الحرة استيفاء متطلبات التدقيق القانوني بناءً على قوانين الشركات المحلية ومعايير الشخص المؤهل في المنطقة الحرة.</p>",
    },
    category: { en: "Audit & Assurance", ar: "التدقيق والتأكيد" },
    tag: { en: "Audit & Assurance", ar: "التدقيق والتأكيد" },
    author: { en: "Mr. Ahmed Al Mazroei", ar: "السيد أحمد المزروعي" },
    reviewedBy: {
      en: "Mr. Ahmed Al Mazroei, Sr. Accountant & Tax Consultant",
      ar: "السيد أحمد المزروعي، محاسب أول ومستشار ضريبي",
    },
    readTime: { en: "5 minutes", ar: "5 دقائق" },
    date: "17 Oct 2026",
    slug: "is-audit-mandatory-uae",
    media: { url: "/img/banner/1.jpg", publicId: "default" },
    featured: false,
    order: 4,
  },
  {
    type: "press",
    title: {
      en: "Permanent Establishment in UAE: When a Foreign Company Pays Corporate Tax",
      ar: "المنشأة الدائمة في دولة الإمارات: متى تدفع الشركة الأجنبية ضريبة الشركات",
    },
    excerpt: {
      en: "A foreign company has a permanent establishment in the UAE when it runs a fixed place of business or an agent habitually concludes contracts here.",
      ar: "تمتلك الشركة الأجنبية منشأة دائمة في الإمارات عندما تدير مكان عمل ثابت أو يبرم وكيل العقود بانتظام هنا.",
    },
    content: {
      en: "<p>Press release regarding international tax developments and bilateral treaties.</p>",
      ar: "<p>بيان صحفي بخصوص التطورات الضريبية الدولية والمعاهدات الثنائية.</p>",
    },
    category: { en: "Corporate Tax", ar: "ضريبة الشركات" },
    tag: { en: "Press Release", ar: "بيان صحفي" },
    author: { en: "Mr. Ahmed Al Mazroei", ar: "السيد أحمد المزروعي" },
    date: "31 Oct 2026",
    slug: "permanent-establishment-uae-press",
    media: { url: "/img/banner/1.mp4", publicId: "default" },
    featured: true,
    order: 1,
  },
  {
    type: "video",
    title: {
      en: "Is Audit Mandatory in the UAE? CT & Free Zone Rules 2026",
      ar: "هل التدقيق إلزامي في الإمارات؟ قواعد ضريبة الشركات والمناطق الحرة 2026",
    },
    excerpt: {
      en: "Check your revenue, your free zone status and your licence conditions to see if an audit is required for your company.",
      ar: "تحقق من إيراداتك ووضع منطقتك الحرة وشروط ترخيصك لمعرفة ما إذا كان التدقيق مطلوبًا لشركتك.",
    },
    content: {
      en: "<p>Video presentation explaining audit mandatory thresholds in the UAE.</p>",
      ar: "<p>فيديو توضيحي يشرح الحدود الإلزامية للتدقيق في دولة الإمارات.</p>",
    },
    category: { en: "Audit & Assurance", ar: "التدقيق والتأكيد" },
    tag: { en: "Video Guide", ar: "فيديو إرشادي" },
    author: { en: "Mr. Ahmed Al Mazroei", ar: "السيد أحمد المزروعي" },
    date: "17 Oct 2026",
    slug: "is-audit-mandatory-uae-video",
    media: { url: "/img/banner/1.mp4", publicId: "default" },
    featured: true,
    order: 1,
  },
];

const ensureSeeded = async () => {
  const count = await Insight.countDocuments();
  if (count === 0) {
    await Insight.insertMany(SEED_INSIGHTS);
  }
};

export const getInsights = async (req: Request, res: Response) => {
  try {
    await ensureSeeded();
    const { type, featured } = req.query;
    const filter: any = {};
    if (type) filter.type = type;
    if (featured !== undefined) filter.featured = featured === "true";

    const items = await Insight.find(filter).sort({ order: 1, createdAt: -1 });

    const blogs = items.filter((i) => i.type === "blog");
    const press = items.filter((i) => i.type === "press");
    const videos = items.filter((i) => i.type === "video");

    res.status(200).json({
      success: true,
      data: {
        all: items,
        blogs,
        press,
        videos,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInsightBySlug = async (req: Request, res: Response) => {
  try {
    await ensureSeeded();
    const { slug } = req.params;
    const item = await Insight.findOne({ slug });
    if (!item) {
      return res.status(404).json({ success: false, message: "Insight not found" });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createInsight = async (req: Request, res: Response) => {
  try {
    let payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
    if (req.file) {
      const up = await uploadBuffer(req.file.buffer, "insights");
      payload.media = { url: up.secure_url, publicId: up.public_id };
    }
    const created = await Insight.create(payload);
    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateInsight = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
    const existing = await Insight.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Insight not found" });
    }

    if (req.file) {
      if (existing.media?.publicId && existing.media.publicId !== "default") {
        await deleteMedia(existing.media.publicId);
      }
      const up = await uploadBuffer(req.file.buffer, "insights");
      payload.media = { url: up.secure_url, publicId: up.public_id };
    }

    const updated = await Insight.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteInsight = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Insight.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Insight not found" });
    }
    if (item.media?.publicId && item.media.publicId !== "default") {
      await deleteMedia(item.media.publicId);
    }
    res.status(200).json({ success: true, message: "Insight deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
