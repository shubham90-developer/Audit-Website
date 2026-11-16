import { Request, Response } from "express";
import { TermsAndConditions } from "./terms.model";
import { updateTermsSchema } from "./terms.validation";

const DEFAULT_TERMS = {
  title: { en: "Terms and Conditions", ar: "الشروط والأحكام" },
  subTitle: { en: "Terms governing the use of our website and services", ar: "الشروط المنظمة لاستخدام موقعنا وخدماتنا" },
  shortDesc: {
    en: "Please review these terms and conditions carefully before engaging our professional services or using our website.",
    ar: "يرجى مراجعة هذه الشروط والأحكام بعناية قبل الاستفادة من خدماتنا المهنية أو استخدام موقعنا الإلكتروني.",
  },
  content: {
    en: `<h3>1. Introduction</h3><p>These terms govern the engagement of audit, tax, and accounting services provided by Ahmed Al Mazroei Auditing & Accounting in the United Arab Emirates.</p><h3>2. Professional Scope</h3><p>Specific scope, deliverables, and fees are defined in formal client engagement letters in accordance with UAE regulatory bodies and the Ministry of Economy.</p><h3>3. Governing Law</h3><p>These terms and any engagement agreements shall be governed by and construed in accordance with the laws of the United Arab Emirates and Abu Dhabi courts.</p>`,
    ar: `<h3>1. المقدمة</h3><p>تحكم هذه الشروط تقديم خدمات التدقيق والضرائب والمحاسبة من قبل مكتب أحمد المزروعي لتدقيق الحسابات والمحاسبة في دولة الإمارات العربية المتحدة.</p><h3>2. النطاق المهني</h3><p>يتم تحديد نطاق العمل والمخرجات والأتعاب بوضوح في خطابات ارتباط رسمية متوافقة مع متطلبات وزارة الاقتصاد والجهات التنظيمية في الإمارات.</p><h3>3. القانون المعمول به</h3><p>تخضع هذه الشروط وكافة اتفاقيات الارتباط لقوانين دولة الإمارات العربية المتحدة ومحاكم إمارة أبوظبي.</p>`,
  },
};

export const ensureDefaultTerms = async (): Promise<void> => {
  const exists = await TermsAndConditions.exists({});
  if (exists) return;
  await TermsAndConditions.create(DEFAULT_TERMS);
};

export const getTerms = async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultTerms();
    let terms = await TermsAndConditions.findOne();
    if (!terms) terms = await TermsAndConditions.create(DEFAULT_TERMS);
    res.status(200).json({ success: true, statusCode: 200, data: terms });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const updateTerms = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultTerms();
    let terms = await TermsAndConditions.findOne();
    if (!terms) terms = await TermsAndConditions.create(DEFAULT_TERMS);

    const parsed = updateTermsSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, statusCode: 400, message: "Validation error", errors: parsed.error.issues });
      return;
    }

    terms.set(parsed.data);
    await terms.save();
    res.status(200).json({ success: true, statusCode: 200, message: "Terms updated successfully", data: terms });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};
