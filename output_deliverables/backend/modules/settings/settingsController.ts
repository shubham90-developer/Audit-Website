import { Request, Response } from "express";
import { Settings } from "./settings.model";
import { updateSettingsSchema } from "./settings.validation";
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

const DEFAULT_SETTINGS = {
  logo: {
    en: [{ url: "/img/logo1.png", publicId: "" }],
    ar: [{ url: "/img/logo1.png", publicId: "" }],
  },
  favicon: {
    en: [{ url: "/favicon.ico", publicId: "" }],
    ar: [{ url: "/favicon.ico", publicId: "" }],
  },
  mobileNo: "+97156 742 3428",
  alternateMobileNo: "+971 52 178 6209",
  mail: "info@almazroeiaudit.com",
  alternateEmail: "support@almazroeiaudit.com",
  whatsApp: "https://wa.me/971521786209",
  address: {
    en: "M-02, Building #19, Seashell Building, Medina St - Al Khalidiyah - W9 - Abu Dhabi",
    ar: "م-02، مبنى رقم 19، مبنى سي شيل، شارع المدينة - الخالدية - W9 - أبوظبي",
  },
  addressIframe:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.4490442517467!2d54.3479391!3d24.469893499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e670e0ac08b07%3A0xc96933a32fb07adc!2sAl%20Mazroei%20Auditing%20%26%20Accounting%20-%20Abu%20Dhabi!5e0!3m2!1shi!2sin!4v1793867244439!5m2!1shi!2sin",
  workingHrs: {
    en: "Mon – Sat: 09:00 – 18:00",
    ar: "الإثنين – السبت: 09:00 – 18:00",
  },
  facebook: "https://www.facebook.com/ahmedalmazroeiaudit/",
  instagram: "https://www.instagram.com/almazroeiaudit/",
  linkedin: "https://linkedin.com",
  twitter: "https://twitter.com",
  youtube: "https://youtube.com",
  footerDesc: {
    en: "Ahmed Al Mazroei Auditing & Accounting is an Emirati-owned audit firm based in Abu Dhabi, delivering professional audit, accounting, and tax services across the UAE.",
    ar: "أحمد المزروعي لتدقيق الحسابات والمحاسبة هي شركة تدقيق مملوكة لمواطنين إماراتيين مقرها أبوظبي، تقدم خدمات تدقيق ومحاسبة وضرائب احترافية في جميع أنحاء الإمارات.",
  },
  footerCopyrights: {
    en: "© 2026 Ahmed Al Mazroei Auditing & Accounting. All rights reserved.",
    ar: "© 2026 أحمد المزروعي لتدقيق الحسابات والمحاسبة. جميع الحقوق محفوظة.",
  },
};

export const ensureDefaultSettings = async (): Promise<void> => {
  const exists = await Settings.exists({});
  if (exists) return;
  await Settings.create(DEFAULT_SETTINGS);
};

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultSettings();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Settings retrieved successfully",
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultSettings();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }

    const parsed = updateSettingsSchema.safeParse(normalizeBody(req.body));
    if (!parsed.success) {
      res.status(400).json({ success: false, statusCode: 400, message: "Validation error", errors: parsed.error.issues });
      return;
    }

    const { removePublicIds, ...fields } = parsed.data;
    settings.set(fields);

    const files = req.files as Record<string, any[]> | undefined;
    const mediaConfigs = [
      { key: "logo", folder: "audit-website/settings/logo", fields: { en: "logoEn", ar: "logoAr" } },
      { key: "favicon", folder: "audit-website/settings/favicon", fields: { en: "faviconEn", ar: "faviconAr" } },
    ];

    for (const m of mediaConfigs) {
      for (const lang of ["en", "ar"] as const) {
        const fieldName = m.fields[lang];
        const currentList = (settings.get(m.key + "." + lang) || []) as any[];
        const keep = currentList.filter((item: any) => !removePublicIds.includes(item.publicId));

        const uploaded = await uploadMany(files?.[fieldName], m.folder, "image");
        if (uploaded.length > 0) {
          settings.set(m.key + "." + lang, [...keep, ...uploaded]);
        } else if (removePublicIds.length > 0) {
          settings.set(m.key + "." + lang, keep);
        }
      }
    }

    await settings.save();
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Settings updated successfully",
      data: settings,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, statusCode: 500, message: error.message });
  }
};
