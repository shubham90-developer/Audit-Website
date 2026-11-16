import { Request, Response } from "express";
import { AboutUs } from "./aboutUs.model";
import { updateAboutUsSchema } from "./aboutUs.validation";
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

const DEFAULT_ABOUT_US = {
  hero: {
    title: { en: "Trusted Auditors", ar: "مدققو حسابات موثوقون" },
    subtitle: { en: "and Business Advisors in the UAE", ar: "ومستشارو أعمال معتمدون في دولة الإمارات" },
    intro1: {
      en: "Ahmed Al Mazroei Auditing & Accounting is an Emirati-owned firm in Abu Dhabi. We handle audit, accounting and tax for businesses across the UAE.",
      ar: "مكتب أحمد المزروعي لتدقيق الحسابات والمحاسبة هي شركة وطنية إماراتية مقرها أبوظبي، نقدم خدمات التدقيق والمحاسبة والضرائب للشركات في كافة إمارات الدولة.",
    },
    intro2: {
      en: "We are an FTA-approved tax agency, which means we deal with the Federal Tax Authority on your behalf rather than leaving you paperwork to file yourself.",
      ar: "نحن وكالة ضريبية معتمدة من الهيئة الاتحادية للضرائب، مما يتيح لنا تمثيلك رسمياً ومتابعة كافة الإجراءات والملفات نيابة عنك.",
    },
    cta1Label: { en: "Book Free 20-Min Call", ar: "احجز استشارة مجانية (20 دقيقة)" },
    cta1Href: "/contact",
    cta2Label: { en: "Meet the Team", ar: "تعرف على الفريق" },
    cta2Href: "/about",
    speakLabel: { en: "Speak Directly with an Expert", ar: "تحدث مباشرة مع خبير معتمد" },
    heroImage: { en: [{ url: "/img/about/2.jpg", publicId: "" }], ar: [{ url: "/img/about/2.jpg", publicId: "" }] },
    bgImage: { en: [{ url: "/img/banner/3.jpg", publicId: "" }], ar: [{ url: "/img/banner/3.jpg", publicId: "" }] },
    stats: [
      { value: "25+", label: { en: "Years of Experience", ar: "عاماً من الخبرة المهنية" }, icon: "building" },
      { value: "1,000+", label: { en: "Clients Served", ar: "عميل تمت خدمتهم بنجاح" }, icon: "chart" },
      { value: "4.8/5", label: { en: "from 75+ Trustpilot Reviews", ar: "تقييم أكثر من 75 عميل على Trustpilot" }, icon: "star" },
      { value: "4.8/5", label: { en: "Across 200+ Google Reviews", ar: "عبر أكثر من 200 تقييم على Google" }, icon: "google" },
    ],
  },
  whoWeAre: {
    badge: { en: "Who We Are", ar: "من نحن" },
    title: { en: "Building trust through expertise and integrity.", ar: "نبني الثقة الراسخة من خلال الخبرة العميقة والنزاهة." },
    text: {
      en: "Ahmed Al Mazroei Auditing & Accounting is a UAE National-owned audit firm based in Abu Dhabi. Since 2000 we have helped companies, family businesses, government-related entities and investors with audit, accounting, tax and advisory services.",
      ar: "مكتب أحمد المزروعي لتدقيق الحسابات والمحاسبة هي شركة تدقيق مملوكة لمواطنين إماراتيين مقرها أبوظبي. منذ عام 2000، ساعدنا الشركات والشركات العائلية والجهات شبه الحكومية والمستثمرين في خدمات التدقيق والمحاسبة والضرائب والاستشارات.",
    },
    quote: {
      en: "You can start with a trade licence and still be with us at your first corporate tax return. Most of our clients are.",
      ar: "يمكنك البدء معنا منذ استخراج الرخصة التجارية والاستمرار حتى تقديم إقرار ضريبة الشركات. معظم عملائنا بدؤوا معنا هكذا وما زالوا شركاء نجاحنا.",
    },
    buttonLabel: { en: "Explore Our Services", ar: "استكشف خدماتنا الشاملة" },
    buttonHref: "/services",
    scriptText: { en: "Your Growth Partner", ar: "شريك نموك الدائم" },
    bgImage: { en: [{ url: "/img/banner/bg8.avif", publicId: "" }], ar: [{ url: "/img/banner/bg8.avif", publicId: "" }] },
    headerImage: { en: [{ url: "/img/banner/bg3.avif", publicId: "" }], ar: [{ url: "/img/banner/bg3.avif", publicId: "" }] },
    snapshotItems: [
      { label: { en: "Established", ar: "سنة التأسيس" }, value: { en: "Since 2000", ar: "منذ عام 2000" }, text: { en: "UAE National-owned audit firm", ar: "شركة تدقيق وطنية إماراتية" }, icon: "award" },
      { label: { en: "Licensed By", ar: "الترخيص والاعتماد" }, value: { en: "DED Abu Dhabi", ar: "اقتصادية أبوظبي" }, text: { en: "Department of Economic Development", ar: "دائرة التنمية الاقتصادية في أبوظبي" }, icon: "badge" },
      { label: { en: "Licence No.", ar: "رقم الترخيص" }, value: { en: "30008692", ar: "30008692" }, text: { en: "Registered Tax Agency", ar: "وكالة ضريبية مسجلة ومعتمدة" }, icon: "shield" },
      { label: { en: "Coverage", ar: "التغطية الجغرافية" }, value: { en: "All 7 Emirates", ar: "كافة إمارات الدولة الـ 7" }, text: { en: "Serving clients across the UAE", ar: "نخدم العملاء في جميع أنحاء الدولة" }, icon: "globe" },
      { label: { en: "Services", ar: "الخدمات المقدمة" }, value: { en: "Audit & Tax", ar: "تدقيق وضرائب ومحاسبة" }, text: { en: "Accounting, tax, audit & advisory", ar: "حلول مالية وضريبية واستشارية متكاملة" }, icon: "layers" },
      { label: { en: "Office", ar: "المقر الرئيسي" }, value: { en: "Abu Dhabi & Dubai", ar: "أبوظبي ودبي" }, text: { en: "Seashell Bldg Abu Dhabi / Business Bay Dubai", ar: "مبنى سي شيل أبوظبي / الخليج التجاري دبي" }, icon: "map" },
    ],
  },
  ourStory: {
    badge: { en: "OUR STORY", ar: "قصتنا ومسيرتنا" },
    narrative: {
      en: "The firm was founded in 2000 by Mr. Ahmed Al Mazroei with one goal: to give UAE businesses honest, high-quality audit services from a local firm they can trust. What started as an audit practice has grown into a full-service firm covering audit, tax, advisory and consulting. After more than 25 years, our values remain the same: integrity, quality and personal service.",
      ar: "تأسس المكتب في عام 2000 على يد السيد أحمد المزروعي بهدف واضح: تزويد مجتمع الأعمال في الإمارات بخدمات تدقيق ومحاسبة عالية الجودة تتسم بالأمانة والاحترافية من شركة محلية تحظى بثقتهم الكاملة. واليوم، وبعد أكثر من 25 عاماً من الريادة، لا تزال قيمنا الأساسية ثابتة: النزاهة التامة، والجودة الفائقة، والاهتمام الشخصي المباشر بكل عميل.",
    },
    bgImage: { en: [{ url: "/img/banner/bg9.avif", publicId: "" }], ar: [{ url: "/img/banner/bg9.avif", publicId: "" }] },
    steps: [
      {
        number: "01",
        title: { en: "It Started With the Numbers", ar: "البداية كانت مع الأرقام" },
        text: { en: "Ahmed Al Mazroei began as an accounting and tax firm, helping businesses manage bookkeeping, financial reporting, tax filings and regulatory compliance.", ar: "بدأ المكتب بتقديم خدمات المحاسبة ومسك الدفاتر والتقارير المالية والامتثال الضريبي للشركات والمؤسسات المحلية." },
        image: { en: [{ url: "/img/banner/1.jpg", publicId: "" }], ar: [{ url: "/img/banner/1.jpg", publicId: "" }] },
      },
      {
        number: "02",
        title: { en: "Then the Questions Got Bigger", ar: "ثم توسعت طموحات عملائنا" },
        text: { en: "As our clients' businesses grew, their questions expanded beyond the numbers to company formation, business structuring, new regulations and entering new markets.", ar: "مع نمو أعمال عملائنا، امتدت استفساراتهم لتشمل هيكلة الشركات، التأسيس في المناطق الحرة، واستيفاء اللوائح المنظمة الجديدة." },
        image: { en: [{ url: "/img/banner/2.jpg", publicId: "" }], ar: [{ url: "/img/banner/2.jpg", publicId: "" }] },
      },
      {
        number: "03",
        title: { en: "Clients Needed More Than Accounting", ar: "الحاجة إلى حلول متكاملة" },
        text: { en: "Operating across different jurisdictions required support in accounting, tax, audit, corporate advisory and business setup through one integrated provider.", ar: "تطلب التوسع في أسواق متعددة الحصول على خدمات التدقيق والضرائب والاستشارات وتأسيس الشركات من شريك واحد متكامل وموثوق." },
        image: { en: [{ url: "/img/banner/3.jpg", publicId: "" }], ar: [{ url: "/img/banner/3.jpg", publicId: "" }] },
      },
      {
        number: "04",
        title: { en: "So We Built One Integrated Team", ar: "بناء فريق عمل متكامل عالمي" },
        text: { en: "To meet these growing needs, we expanded our team, our expertise and our presence across different countries, offering seamless cross-border financial advisory.", ar: "لمواكبة هذا التوسع، قمنا بتعزيز فريقنا بخبرات دولية رفيعة المستوى وحضور إقليمي وعالمي يقدم استشارات مالية عابرة للحدود." },
        image: { en: [{ url: "/img/banner/4.jpg", publicId: "" }], ar: [{ url: "/img/banner/4.jpg", publicId: "" }] },
      },
    ],
    quote: {
      en: "Our growth has never been about adding services for the sake of looking bigger. We add expertise when it solves a real problem for our clients.",
      ar: "لم يكن نمونا يوماً مجرد إضافة خدمات لزيادة الحجم، بل نضيف الخبرات التخصصية دائماً عندما تقدم حلاً حقيقياً وملموساً لتحديات عملائنا.",
    },
    authorName: { en: "Mr. Ahmed Al Mazroei, UAE-CA.", ar: "السيد أحمد المزروعي، محاسب قانوني إماراتي" },
    authorRole: { en: "Director of Accounting and Taxation", ar: "مدير المحاسبة والضرائب" },
    authorImage: { en: [{ url: "/img/banner/1.jpg", publicId: "" }], ar: [{ url: "/img/banner/1.jpg", publicId: "" }] },
  },
  ourValues: {
    label: { en: "Our Values", ar: "قيمنا الجوهرية" },
    title: { en: "The Principles That Guide Us", ar: "المبادئ الراسخة التي توجه مسيرتنا" },
    values: [
      { number: "01", title: { en: "Integrity", ar: "النزاهة والأمانة" }, text: { en: "We are honest, objective and straightforward, even when the answer is difficult.", ar: "نلتزم بالصدق والموضوعية والوضوح التام مع عملائنا في كل الظروف." }, icon: "target" },
      { number: "02", title: { en: "Independence", ar: "الاستقلالية المهنية" }, text: { en: "Our professional opinion is completely objective and free from external influence.", ar: "رأينا المهني محايد ومستقل تماماً وخالٍ من أي تعارض في المصالح أو تأثير خارجي." }, icon: "handshake" },
      { number: "03", title: { en: "Quality", ar: "الجودة والتميز" }, text: { en: "Every audit report and financial filing is reviewed rigorously before it reaches you.", ar: "تخضع كافة التقارير المالية لعمليات مراجعة وتدقيق بالغة الدقة قبل اعتمادها النهائي." }, icon: "rocket" },
      { number: "04", title: { en: "Confidentiality", ar: "السرية المطلقة" }, text: { en: "Your financial information and proprietary records are always kept strictly safe and private.", ar: "بياناتك المالية وسجلاتك الخاصة محفوظة بأعلى معايير السرية والأمان المؤسسي." }, icon: "shield" },
    ],
  },
  nextChapter: {
    badge: { en: "THE NEXT CHAPTER", ar: "الفصل القادم والتوسع العالمي" },
    title: { en: "And the Story Expanded Across Four Global Markets", ar: "وامتدت قصة النجاح عبر أربعة أسواق عالمية كبرى" },
    description: {
      en: "What started in Business Bay grew into offices and an active presence across Dubai, Mississauga, the USA and Panama, helping businesses go further, wherever they are.",
      ar: "ما بدأ في الخليج التجاري بأبوظبي ودبي تحول إلى حضور دولي نشط ومكاتب شريكة عبر دبي وميسيسوجا بالولايات المتحدة وبنما، لدعم عملائنا في أي مكان في العالم.",
    },
    scriptTagline: { en: "From Business Bay to the World", ar: "من الإمارات إلى العالم" },
    bgImage: { en: [{ url: "/img/banner/bg10.avif", publicId: "" }], ar: [{ url: "/img/banner/bg10.avif", publicId: "" }] },
    countries: [
      { name: { en: "UAE", ar: "الإمارات" }, image: { en: [{ url: "/img/about/1.avif", publicId: "" }], ar: [{ url: "/img/about/1.avif", publicId: "" }] } },
      { name: { en: "Canada", ar: "كندا" }, image: { en: [{ url: "/img/about/2.avif", publicId: "" }], ar: [{ url: "/img/about/2.avif", publicId: "" }] } },
      { name: { en: "USA", ar: "الولايات المتحدة" }, image: { en: [{ url: "/img/about/3.avif", publicId: "" }], ar: [{ url: "/img/about/3.avif", publicId: "" }] } },
      { name: { en: "Panama", ar: "بنما" }, image: { en: [{ url: "/img/about/4.avif", publicId: "" }], ar: [{ url: "/img/about/4.avif", publicId: "" }] } },
    ],
  },
};

export const ensureDefaultAboutUs = async (): Promise<void> => {
  const exists = await AboutUs.exists({});
  if (exists) return;
  await AboutUs.create(DEFAULT_ABOUT_US);
};

export const getAboutUsData = async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultAboutUs();
    let about = await AboutUs.findOne();
    if (!about) about = await AboutUs.create(DEFAULT_ABOUT_US);
    res.status(200).json({
      success: true,
      statusCode: 200,
      data: about,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const updateAboutUsData = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultAboutUs();
    let about = await AboutUs.findOne();
    if (!about) about = await AboutUs.create(DEFAULT_ABOUT_US);

    const parsed = updateAboutUsSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ success: false, statusCode: 400, message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const { removePublicIds, ...sections } = parsed.data;
    if (sections.hero) about.hero = { ...about.hero, ...sections.hero };
    if (sections.whoWeAre) about.whoWeAre = { ...about.whoWeAre, ...sections.whoWeAre };
    if (sections.ourStory) about.ourStory = { ...about.ourStory, ...sections.ourStory };
    if (sections.ourValues) about.ourValues = { ...about.ourValues, ...sections.ourValues };
    if (sections.nextChapter) about.nextChapter = { ...about.nextChapter, ...sections.nextChapter };

    const files = req.files as Record<string, any[]> | undefined;
    const uploadMediaList = async (folder: string, fieldEn: string, fieldAr: string, current: any) => {
      const enFiles = await uploadMany(files?.[fieldEn], folder, "image");
      const arFiles = await uploadMany(files?.[fieldAr], folder, "image");
      return {
        en: enFiles.length > 0 ? enFiles : current?.en || [],
        ar: arFiles.length > 0 ? arFiles : current?.ar || [],
      };
    };

    if (files) {
      if (files["heroImageEn"] || files["heroImageAr"]) {
        about.hero.heroImage = await uploadMediaList("audit-website/about/hero", "heroImageEn", "heroImageAr", about.hero.heroImage);
      }
      if (files["heroBgEn"] || files["heroBgAr"]) {
        about.hero.bgImage = await uploadMediaList("audit-website/about/hero", "heroBgEn", "heroBgAr", about.hero.bgImage);
      }
      if (files["whoWeAreBgEn"] || files["whoWeAreBgAr"]) {
        about.whoWeAre.bgImage = await uploadMediaList("audit-website/about/who", "whoWeAreBgEn", "whoWeAreBgAr", about.whoWeAre.bgImage);
      }
      if (files["ourStoryBgEn"] || files["ourStoryBgAr"]) {
        about.ourStory.bgImage = await uploadMediaList("audit-website/about/story", "ourStoryBgEn", "ourStoryBgAr", about.ourStory.bgImage);
      }
      if (files["nextChapterBgEn"] || files["nextChapterBgAr"]) {
        about.nextChapter.bgImage = await uploadMediaList("audit-website/about/next", "nextChapterBgEn", "nextChapterBgAr", about.nextChapter.bgImage);
      }
    }

    await about.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "About Us content updated successfully",
      data: about,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};
