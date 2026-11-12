import { Request, Response } from "express";
import { Faq } from "./model";
import { createFaqSchema, updateFaqSchema } from "./validation";

const NOT_FOUND = "FAQ section has not been created yet";
const ALREADY_EXISTS = "FAQ section already exists. Use PATCH to update it.";

const zodMessage = (error: any) =>
  error.issues.map((i: any) => `${i.path.join(".")}: ${i.message}`).join(", ");

const sendError = (res: Response, status: number, message: string) =>
  res.status(status).json({ status: "error", message });

// ---------- GET /api/faq ----------
export const getFaq = async (_req: Request, res: Response) => {
  try {
    const data = await Faq.findOne().lean();
    if (!data) return sendError(res, 404, NOT_FOUND);
    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

// ---------- POST /api/faq  (JSON) ----------
export const createFaq = async (req: Request, res: Response) => {
  try {
    if (await Faq.exists({})) return sendError(res, 409, ALREADY_EXISTS);

    const parsed = createFaqSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, zodMessage(parsed.error));

    const doc = await Faq.create(parsed.data);
    res.status(201).json({ status: "success", data: doc });
  } catch (error: any) {
    if (error.code === 11000) return sendError(res, 409, ALREADY_EXISTS);
    sendError(res, 500, error.message);
  }
};

// ---------- PATCH /api/faq  (JSON) ----------
export const updateFaq = async (req: Request, res: Response) => {
  try {
    const parsed = updateFaqSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, zodMessage(parsed.error));

    const doc = await Faq.findOne();
    if (!doc) return sendError(res, 404, NOT_FOUND);

    doc.set(parsed.data);
    await doc.save();

    res.status(200).json({ status: "success", data: doc });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

// ---------- DELETE /api/faq ----------
export const deleteFaq = async (_req: Request, res: Response) => {
  try {
    const doc = await Faq.findOne();
    if (!doc) return sendError(res, 404, NOT_FOUND);

    await Faq.deleteOne({ _id: doc._id });
    res.status(200).json({ status: "success", message: "FAQ section deleted" });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
