import { Request, Response } from "express";
import mongoose from "mongoose";
import { FaqCategory, FaqItem } from "./faq.model";
import { createFaqCategorySchema, createFaqItemSchema, updateFaqItemSchema } from "./faq.validation";

const DEFAULT_CATEGORIES = [
  { name: { en: "About Ahmed Al Mazroei", ar: "عن أحمد المزروعي" }, order: 0 },
  { name: { en: "Business Setup", ar: "تأسيس الأعمال" }, order: 1 },
  { name: { en: "Tax", ar: "الضرائب" }, order: 2 },
  { name: { en: "Accounting", ar: "المحاسبة" }, order: 3 },
  { name: { en: "Audit & Compliance", ar: "التدقيق والامتثال" }, order: 4 },
  { name: { en: "Corporate Services", ar: "خدمات الشركات" }, order: 5 },
  { name: { en: "Visa & Other", ar: "التأشيرات والخدمات الأخرى" }, order: 6 },
];

const DEFAULT_FAQS = [
  {
    categoryName: { en: "About Ahmed Al Mazroei", ar: "عن أحمد المزروعي" },
    question: {
      en: "What makes Ahmed Al Mazroei different from other chartered accountant firms in Dubai?",
      ar: "ما الذي يميز مكتب أحمد المزروعي عن غيره من مكاتب تدقيق الحسابات في دبي؟",
    },
    answer: {
      en: "We combine professional expertise, personalized support and practical financial solutions to help businesses operate with confidence.",
      ar: "نحن نجمع بين الخبرة المهنية والدعم الشخصي والحلول المالية العملية لمساعدة الشركات على إدارة أعمالها بكل ثقة.",
    },
    order: 0,
  },
  {
    categoryName: { en: "About Ahmed Al Mazroei", ar: "عن أحمد المزروعي" },
    question: {
      en: "Are your accountants qualified, and who signs off my work?",
      ar: "هل المحاسبون لديكم مؤهلون ومن يعتمد التقارير المالية؟",
    },
    answer: {
      en: "Our services are handled by experienced accounting and tax professionals, with appropriate review and approval procedures by licensed partners.",
      ar: "يقوم على تقديم خدماتنا متخصصون متمرسون في المحاسبة والضرائب، مع إجراءات مراجعة واعتماد دقيقة من قبل شركاء مرخصين.",
    },
    order: 1,
  },
  {
    categoryName: { en: "About Ahmed Al Mazroei", ar: "عن أحمد المزروعي" },
    question: {
      en: "How do I switch to Ahmed Al Mazroei from my current accountant?",
      ar: "كيف يمكنني الانتقال إلى مكتب أحمد المزروعي من المحاسب الحالي؟",
    },
    answer: {
      en: "We make the transition simple by reviewing your existing records, coordinating the handover and organizing your accounting documents smoothly.",
      ar: "نجعل عملية الانتقال سلسة للغاية من خلال مراجعة سجلاتك الحالية وتنسيق التسليم وتنظيم مستنداتك المحاسبية دون انقطاع لأعمالك.",
    },
    order: 2,
  },
  {
    categoryName: { en: "About Ahmed Al Mazroei", ar: "عن أحمد المزروعي" },
    question: {
      en: "How do your fees work?",
      ar: "كيف يتم تحديد الأتعاب والأسعار؟",
    },
    answer: {
      en: "Our fees depend on your business requirements, transaction volume and the scope of services. We provide clear upfront pricing before starting.",
      ar: "تعتمد أتعابنا على متطلبات عملك وحجم العمليات ونطاق الخدمات، ونقدم تسعيرًا واضحًا وثابتًا مقدماً قبل البدء في أي عمل.",
    },
    order: 3,
  },
  {
    categoryName: { en: "About Ahmed Al Mazroei", ar: "عن أحمد المزروعي" },
    question: {
      en: "What happens if the FTA raises a query or opens a tax audit?",
      ar: "ماذا يحدث إذا طرحت الهيئة الاتحادية للضرائب استفساراً أو فتحت تدقيقاً ضريبياً؟",
    },
    answer: {
      en: "As an FTA-approved tax agency, we represent you directly before the authority, prepare all files, and respond to queries on your behalf.",
      ar: "بصفتنا وكالة ضريبية معتمدة من الهيئة، نمثلك مباشرة أمام الهيئة الاتحادية للضرائب ونجهز كافة الملفات ونرد على الاستفسارات نيابة عنك.",
    },
    order: 4,
  },
  {
    categoryName: { en: "About Ahmed Al Mazroei", ar: "عن أحمد المزروعي" },
    question: {
      en: "My books are behind and in poor shape. Will you still take me on?",
      ar: "سجلاتي المالية متأخرة وغير منظمة، هل يمكنكم مساعدتي؟",
    },
    answer: {
      en: "Yes. We regularly review backlogged records, reconcile transactions, correct errors, and bring accounts fully up to date and compliant.",
      ar: "نعم بالتأكيد. نقوم بانتظام بتسوية السجلات المتأخرة وتصحيح الأخطاء وتحديث الحسابات لتكون متوافقة بالكامل مع المتطلبات القانونية.",
    },
    order: 5,
  },
];

export const ensureDefaultFaq = async (): Promise<void> => {
  const catCount = await FaqCategory.countDocuments();
  if (catCount === 0) {
    await FaqCategory.insertMany(DEFAULT_CATEGORIES);
  }

  const faqCount = await FaqItem.countDocuments();
  if (faqCount === 0) {
    await FaqItem.insertMany(DEFAULT_FAQS);
  }
};

export const getFaqs = async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultFaq();
    const categories = await FaqCategory.find().sort({ order: 1 });
    const faqs = await FaqItem.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: faqs,
      categories,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const createFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createFaqItemSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, statusCode: 400, message: "Validation error", errors: parsed.error.issues });
      return;
    }
    const faq = await FaqItem.create(parsed.data);
    res.status(201).json({ success: true, statusCode: 201, data: faq });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const updateFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ success: false, statusCode: 400, message: "Invalid ID" });
      return;
    }
    const parsed = updateFaqItemSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, statusCode: 400, message: "Validation error", errors: parsed.error.issues });
      return;
    }
    const faq = await FaqItem.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!faq) {
      res.status(404).json({ success: false, statusCode: 404, message: "FAQ not found" });
      return;
    }
    res.status(200).json({ success: true, statusCode: 200, data: faq });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const deleteFaq = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ success: false, statusCode: 400, message: "Invalid ID" });
      return;
    }
    await FaqItem.findByIdAndDelete(id);
    res.status(200).json({ success: true, statusCode: 200, message: "FAQ deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};
