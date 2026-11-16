import { Request, Response } from "express";
import { PrivacyPolicy } from "./privacy.model";
import { updatePrivacySchema } from "./privacy.validation";

const DEFAULT_PRIVACY = {
  title: { en: "Privacy Policy", ar: "سياسة الخصوصية" },
  subTitle: { en: "How we collect, use and protect your personal information", ar: "كيف نقوم بجمع واستخدام وحماية معلوماتك الشخصية" },
  shortDesc: {
    en: "At Ahmed Al Mazroei Auditing & Accounting, we are committed to protecting your privacy and confidential financial data.",
    ar: "في مكتب أحمد المزروعي لتدقيق الحسابات والمحاسبة، نلتزم بحماية خصوصيتك وبياناتك المالية السرية.",
  },
  content: {
    en: `<h3>1. Information We Collect</h3><p>We collect only the information needed to respond to you and deliver our services, including contact details, engagement documents, and technical web data.</p><h3>2. How We Use Your Information</h3><p>We use information to provide professional audit, tax, and accounting services, meet legal obligations, and communicate with you. We do not sell your personal data.</p><h3>3. Confidentiality & Security</h3><p>Client information is strictly confidential under UAE professional standards and protected by modern cybersecurity practices.</p>`,
    ar: `<h3>1. المعلومات التي نجمعها</h3><p>نقوم بجمع المعلومات الضرورية فقط للرد على استفساراتك وتقديم خدماتنا، بما في ذلك بيانات الاتصال ومستندات التعاقد والبيانات التقنية للموقع.</p><h3>2. كيفية استخدام المعلومات</h3><p>نستخدم المعلومات لتقديم خدمات التدقيق والضرائب والمحاسبة وتلبية الالتزامات القانونية. نحن لا نبيع بياناتك الشخصية أبداً.</p><h3>3. السرية والأمان</h3><p>تخضع كافة معلومات العملاء للسرية التامة وفق المعايير المهنية في دولة الإمارات وتتم حمايتها بأحدث تدابير الأمن السيبراني.</p>`,
  },
};

export const ensureDefaultPrivacy = async (): Promise<void> => {
  const exists = await PrivacyPolicy.exists({});
  if (exists) return;
  await PrivacyPolicy.create(DEFAULT_PRIVACY);
};

export const getPrivacy = async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultPrivacy();
    let privacy = await PrivacyPolicy.findOne();
    if (!privacy) privacy = await PrivacyPolicy.create(DEFAULT_PRIVACY);
    res.status(200).json({ success: true, statusCode: 200, data: privacy });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const updatePrivacy = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultPrivacy();
    let privacy = await PrivacyPolicy.findOne();
    if (!privacy) privacy = await PrivacyPolicy.create(DEFAULT_PRIVACY);

    const parsed = updatePrivacySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ success: false, statusCode: 400, message: "Validation error", errors: parsed.error.issues });
      return;
    }

    privacy.set(parsed.data);
    await privacy.save();
    res.status(200).json({ success: true, statusCode: 200, message: "Privacy Policy updated", data: privacy });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};
