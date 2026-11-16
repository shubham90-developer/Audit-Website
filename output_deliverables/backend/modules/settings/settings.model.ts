import { Schema, model } from "mongoose";
import { ISettings } from "./settings.interface";

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
  },
  { _id: false }
);

const localizedMedia = {
  en: { type: [mediaSchema], default: [] },
  ar: { type: [mediaSchema], default: [] },
};

const settingsSchema = new Schema<ISettings>(
  {
    logo: localizedMedia,
    favicon: localizedMedia,

    mobileNo: { type: String, default: "+97156 742 3428" },
    alternateMobileNo: { type: String, default: "+971 52 178 6209" },
    mail: { type: String, default: "info@almazroeiaudit.com" },
    alternateEmail: { type: String, default: "support@almazroeiaudit.com" },
    whatsApp: { type: String, default: "https://wa.me/971521786209" },

    address: {
      en: {
        type: String,
        default: "M-02, Building #19, Seashell Building, Medina St - Al Khalidiyah - W9 - Abu Dhabi",
      },
      ar: {
        type: String,
        default: "م-02، مبنى رقم 19، مبنى سي شيل، شارع المدينة - الخالدية - W9 - أبوظبي",
      },
    },
    addressIframe: {
      type: String,
      default:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.4490442517467!2d54.3479391!3d24.469893499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e670e0ac08b07%3A0xc96933a32fb07adc!2sAl%20Mazroei%20Auditing%20%26%20Accounting%20-%20Abu%20Dhabi!5e0!3m2!1shi!2sin!4v1793867244439!5m2!1shi!2sin",
    },
    workingHrs: {
      en: { type: String, default: "Mon – Sat: 09:00 – 18:00" },
      ar: { type: String, default: "الإثنين – السبت: 09:00 – 18:00" },
    },

    facebook: { type: String, default: "https://www.facebook.com/ahmedalmazroeiaudit/" },
    instagram: { type: String, default: "https://www.instagram.com/almazroeiaudit/" },
    linkedin: { type: String, default: "https://linkedin.com" },
    twitter: { type: String, default: "https://twitter.com" },
    youtube: { type: String, default: "https://youtube.com" },

    footerDesc: {
      en: {
        type: String,
        default:
          "Ahmed Al Mazroei Auditing & Accounting is an Emirati-owned audit firm based in Abu Dhabi, delivering professional audit, accounting, and tax services across the UAE.",
      },
      ar: {
        type: String,
        default:
          "أحمد المزروعي لتدقيق الحسابات والمحاسبة هي شركة تدقيق مملوكة لمواطنين إماراتيين مقرها أبوظبي، تقدم خدمات تدقيق ومحاسبة وضرائب احترافية في جميع أنحاء الإمارات.",
      },
    },
    footerCopyrights: {
      en: {
        type: String,
        default: "© 2026 Ahmed Al Mazroei Auditing & Accounting. All rights reserved.",
      },
      ar: {
        type: String,
        default: "© 2026 أحمد المزروعي لتدقيق الحسابات والمحاسبة. جميع الحقوق محفوظة.",
      },
    },
  },
  { timestamps: true }
);

export const Settings = model<ISettings>("Settings", settingsSchema);
