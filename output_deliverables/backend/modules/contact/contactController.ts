import { Request, Response } from "express";
import { ContactSection, ContactEnquiry } from "./contact.model";
import { uploadBuffer, deleteMedia } from "../../utils/cloudinary";

const SEED_CONTACT_SECTION = {
  title: {
    en: "Speak with our UAE Specialists",
    ar: "تحدث مع المتخصصين لدينا في الإمارات",
  },
  subtitle: {
    en: "Tell us about your business, and our team will get back to you shortly.",
    ar: "أخبرنا عن عملك، وسيتواصل معك فريقنا في أقرب وقت.",
  },
  bgImage: { url: "/img/banner/bg1.avif", publicId: "default" },
  features: [
    {
      icon: "FiHeadphones",
      title: { en: "Expert Consultation", ar: "استشارة الخبراء" },
      text: {
        en: "Guidance from qualified UAE tax, audit and accounting professionals.",
        ar: "توجيه من خبراء الضرائب والتدقيق والمحاسبة المؤهلين في الإمارات.",
      },
    },
    {
      icon: "FiClock",
      title: { en: "Quick Response", ar: "استجابة سريعة" },
      text: {
        en: "We reply within UAE business hours, not days later.",
        ar: "نرد خلال ساعات العمل الرسمية في دولة الإمارات، وليس بعد أيام.",
      },
    },
    {
      icon: "FiUsers",
      title: { en: "Trusted by Businesses", ar: "موثوق به من قبل الشركات" },
      text: {
        en: "Hundreds of clients served across the UAE and beyond.",
        ar: "مئات العملاء الذين نخدمهم في جميع أنحاء الإمارات وخارجها.",
      },
    },
  ],
  servicesList: [
    "Audit & Assurance",
    "Tax Services",
    "Advisory Services",
    "Consulting Services",
    "Accounting & Other Services",
    "Other Enquiries",
  ],
  mapSection: {
    place: {
      en: "Ahmed Al Mazroei Chartered Accountants, Abu Dhabi & Dubai",
      ar: "أحمد المزروعي مدققون قانونيون، أبوظبي ودبي",
    },
    address: [
      {
        en: "M-02, Building #19, Seashell Building, Medina St - Al Khalidiyah - W9 - Abu Dhabi",
        ar: "M-02، مبنى رقم 19، مبنى سي شيل، شارع المدينة - الخالدية - W9 - أبوظبي",
      },
    ],
    mapsLink: "https://maps.app.goo.gl/5241Xhzk9dd5d72J8?g_st=ac",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.4490442517467!2d54.3479391!3d24.469893499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e670e0ac08b07%3A0xc96933a32fb07adc!2sAl%20Mazroei%20Auditing%20%26%20Accounting%20-%20Abu%20Dhabi!5e0!3m2!1shi!2sin!4v1793867244439!5m2!1shi!2sin",
    landmarkImage: { url: "/img/banner/uae-tower.avif", publicId: "default" },
    bgImage: { url: "/img/banner/bg10.avif", publicId: "default" },
  },
};

const ensureSeeded = async () => {
  const count = await ContactSection.countDocuments();
  if (count === 0) {
    await ContactSection.create(SEED_CONTACT_SECTION);
  }
};

export const getContactSection = async (req: Request, res: Response) => {
  try {
    await ensureSeeded();
    const section = await ContactSection.findOne();
    res.status(200).json({ success: true, data: section });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateContactSection = async (req: Request, res: Response) => {
  try {
    await ensureSeeded();
    let payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
    const existing = await ContactSection.findOne();

    if (req.file) {
      if (existing?.bgImage?.publicId && existing.bgImage.publicId !== "default") {
        await deleteMedia(existing.bgImage.publicId);
      }
      const up = await uploadBuffer(req.file.buffer, "contact");
      payload.bgImage = { url: up.secure_url, publicId: up.public_id };
    }

    const updated = await ContactSection.findOneAndUpdate({}, payload, { new: true, upsert: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const submitContactEnquiry = async (req: Request, res: Response) => {
  try {
    const enquiry = await ContactEnquiry.create(req.body);
    res.status(201).json({ success: true, message: "Enquiry submitted successfully", data: enquiry });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getContactEnquiries = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }
    const enquiries = await ContactEnquiry.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: enquiries });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEnquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const enquiry = await ContactEnquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteContactEnquiry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const enquiry = await ContactEnquiry.findByIdAndDelete(id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found" });
    }
    res.status(200).json({ success: true, message: "Enquiry deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
