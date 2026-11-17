import type { Request, Response, NextFunction } from "express";

import { TestimonialSection } from "./testimonial.model";

import { updateTestimonialSectionSchema } from "./testimonial.validation";

/* =====================================================
   DEFAULT DUMMY DATA - ENGLISH + ARABIC
===================================================== */

const defaultTestimonialData = {
  singleton: "client-feedback",

  eyebrow: {
    en: "CLIENT FEEDBACK",
    ar: "آراء العملاء",
  },

  heading: {
    en: "What clients say about our Accounting Firm in Dubai",
    ar: "ماذا يقول عملاؤنا عن شركتنا للمحاسبة في دبي",
  },

  googlePrefix: {
    en: "Based on",
    ar: "بناءً على",
  },

  googleReviewCount: 200,

  googleSuffix: {
    en: "Google Reviews",
    ar: "تقييمات جوجل",
  },

  trustpilotPrefix: {
    en: "Rated",
    ar: "التقييم",
  },

  trustpilotRating: {
    en: "Excellent",
    ar: "ممتاز",
  },

  trustpilotSuffix: {
    en: "on Trustpilot",
    ar: "على تراست بايلوت",
  },

  testimonials: [
    {
      clientName: {
        en: "Sample Client One",
        ar: "عميل تجريبي أول",
      },
      review: {
        en: "This is a sample review. Replace it with genuine customer feedback from the admin panel.",
        ar: "هذه مراجعة تجريبية. استبدلها بتقييم حقيقي من العملاء عبر لوحة الإدارة.",
      },
      platform: "google",
      rating: 5,
      order: 0,
      active: true,
    },
    {
      clientName: {
        en: "Sample Client Two",
        ar: "عميل تجريبي ثانٍ",
      },
      review: {
        en: "This is placeholder testimonial content for testing the website layout.",
        ar: "هذا محتوى تجريبي لاختبار تصميم قسم آراء العملاء في الموقع.",
      },
      platform: "trustpilot",
      rating: 5,
      order: 1,
      active: true,
    },
    {
      clientName: {
        en: "Sample Client Three",
        ar: "عميل تجريبي ثالث",
      },
      review: {
        en: "Add an authentic client review here using the admin dashboard.",
        ar: "أضف هنا مراجعة حقيقية من أحد العملاء باستخدام لوحة الإدارة.",
      },
      platform: "google",
      rating: 5,
      order: 2,
      active: true,
    },
  ],
};

/* =====================================================
   GET TESTIMONIAL SECTION
   CREATE DEFAULT DATA IF DATABASE IS EMPTY
===================================================== */

export const getTestimonialSection = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const section = await TestimonialSection.findOneAndUpdate(
      { singleton: "client-feedback" },
      {
        $setOnInsert: defaultTestimonialData,
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Testimonial section fetched successfully",
      data: section,
    });
  } catch (error) {
    next(error);
  }
};

/* =====================================================
   UPDATE TESTIMONIAL SECTION
===================================================== */

export const updateTestimonialSection = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = updateTestimonialSectionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial section data",
        errors: parsed.error.flatten(),
      });
    }

    const section = await TestimonialSection.findOneAndUpdate(
      { singleton: "client-feedback" },
      {
        $set: parsed.data,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Testimonial section updated successfully",
      data: section,
    });
  } catch (error) {
    next(error);
  }
};
