import type { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "mongoose";
import { Enquiry } from "./enquiry.model";
import { createEnquirySchema, updateEnquirySchema } from "./enquiry.validation";

export const createEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsed = createEnquirySchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid enquiry",
          errors: parsed.error.flatten(),
        });
    const enquiry = await Enquiry.create(parsed.data);
    return res
      .status(201)
      .json({
        success: true,
        message: "Enquiry submitted successfully",
        data: { _id: enquiry._id },
      });
  } catch (error) {
    next(error);
  }
};

export const getEnquiries = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Math.max(
      1,
      Number.parseInt(String(req.query.page || "1"), 10) || 1,
    );
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(String(req.query.limit || "20"), 10) || 20),
    );
    const status = typeof req.query.status === "string" ? req.query.status : "";
    const allowed = ["new", "contacted", "in_progress", "closed"];
    if (status && !allowed.includes(status))
      return res
        .status(400)
        .json({ success: false, message: "Invalid status filter" });
    const filter = status ? { status } : {};
    const [items, total] = await Promise.all([
      Enquiry.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Enquiry.countDocuments(filter),
    ]);
    return res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

export const getEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid enquiry ID" });
    const item = await Enquiry.findById(req.params.id).lean();
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found" });
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid enquiry ID" });
    const parsed = updateEnquirySchema.safeParse(req.body);
    if (!parsed.success)
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid update",
          errors: parsed.error.flatten(),
        });
    const item = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $set: parsed.data },
      { returnDocument: "after", runValidators: true },
    );
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found" });
    return res.json({ success: true, message: "Enquiry updated", data: item });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid enquiry ID" });
    const item = await Enquiry.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Enquiry not found" });
    return res.json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    next(error);
  }
};
