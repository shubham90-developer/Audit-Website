import { Request, Response } from "express";
import { Counter } from "./counter.model";
import { updateCounterSchema } from "./counter.validation";

// Used when there is no counter in the database yet
const DEFAULT_COUNTER = {
  heading: { en: "Numbers speak for themselves", ar: "الأرقام تتحدث عن نفسها" },
  stats: [
    {
      value: { en: "25+", ar: "25+" },
      unit: { en: "Years", ar: "سنة" },
      label: { en: "Years of Experience", ar: "سنوات الخبرة" },
    },
    {
      value: { en: "100%", ar: "100%" },
      unit: { en: "Emirati", ar: "إماراتي" },
      label: { en: "UAE National Owned", ar: "ملكية وطنية إماراتية" },
    },
    {
      value: { en: "5", ar: "5" },
      unit: { en: "Areas", ar: "مجالات" },
      label: { en: "Service Areas", ar: "مجالات الخدمة" },
    },
    {
      value: { en: "7", ar: "7" },
      unit: { en: "Emirates", ar: "إمارات" },
      label: { en: "Emirates Covered", ar: "الإمارات المغطاة" },
    },
  ],
};

// returns the counter, creating the default one if none exists
const getOrCreateCounter = async () => {
  const existing = await Counter.findOne();
  if (existing) return existing;
  return Counter.create(DEFAULT_COUNTER);
};

// GET /api/counter
export const getCounter = async (_req: Request, res: Response) => {
  try {
    const counter = await getOrCreateCounter();
    res.status(200).json({ status: "success", data: counter });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// PATCH /api/counter
export const updateCounter = async (req: Request, res: Response) => {
  try {
    const parsed = updateCounterSchema.safeParse(req.body);
    if (!parsed.success) {
      const message = parsed.error.issues
        .map((i: any) => `${i.path.join(".")}: ${i.message}`)
        .join(", ");
      res.status(400).json({ status: "error", message });
      return;
    }

    const counter = await getOrCreateCounter();
    counter.set(parsed.data);
    await counter.save();

    res.status(200).json({ status: "success", data: counter });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
