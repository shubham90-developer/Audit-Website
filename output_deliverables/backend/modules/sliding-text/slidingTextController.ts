import { Request, Response } from "express";
import { SlidingText } from "./slidingText.model";
import { updateSlidingTextSchema } from "./slidingText.validation";

const DEFAULT_SLIDING_TEXT = {
  textLeft: {
    en: "Accounting · Tax · Audit",
    ar: "محاسبة · ضرائب · تدقيق",
  },
  textRight: {
    en: "Accounting · Tax · Audit",
    ar: "محاسبة · ضرائب · تدقيق",
  },
  speed: 60,
  separator: "•",
};

export const ensureDefaultSlidingText = async (): Promise<void> => {
  const exists = await SlidingText.exists({});
  if (exists) return;
  await SlidingText.create(DEFAULT_SLIDING_TEXT);
};

export const getSlidingText = async (_req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultSlidingText();
    let text = await SlidingText.findOne();
    if (!text) text = await SlidingText.create(DEFAULT_SLIDING_TEXT);
    res.status(200).json({ status: "success", data: text });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const updateSlidingText = async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureDefaultSlidingText();
    let text = await SlidingText.findOne();
    if (!text) text = await SlidingText.create(DEFAULT_SLIDING_TEXT);

    const parsed = updateSlidingTextSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "Validation error", errors: parsed.error.issues });
      return;
    }

    text.set(parsed.data);
    await text.save();
    res.status(200).json({ status: "success", data: text });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
