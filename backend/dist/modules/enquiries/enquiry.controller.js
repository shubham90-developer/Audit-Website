"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnquiry = exports.updateEnquiry = exports.getEnquiry = exports.getEnquiries = exports.createEnquiry = void 0;
const mongoose_1 = require("mongoose");
const enquiry_model_1 = require("./enquiry.model");
const enquiry_validation_1 = require("./enquiry.validation");
const createEnquiry = async (req, res, next) => {
    try {
        const parsed = enquiry_validation_1.createEnquirySchema.safeParse(req.body);
        if (!parsed.success)
            return res
                .status(400)
                .json({
                success: false,
                message: "Invalid enquiry",
                errors: parsed.error.flatten(),
            });
        const enquiry = await enquiry_model_1.Enquiry.create(parsed.data);
        return res
            .status(201)
            .json({
            success: true,
            message: "Enquiry submitted successfully",
            data: { _id: enquiry._id },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createEnquiry = createEnquiry;
const getEnquiries = async (req, res, next) => {
    try {
        const page = Math.max(1, Number.parseInt(String(req.query.page || "1"), 10) || 1);
        const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit || "20"), 10) || 20));
        const status = typeof req.query.status === "string" ? req.query.status : "";
        const allowed = ["new", "contacted", "in_progress", "closed"];
        if (status && !allowed.includes(status))
            return res
                .status(400)
                .json({ success: false, message: "Invalid status filter" });
        const filter = status ? { status } : {};
        const [items, total] = await Promise.all([
            enquiry_model_1.Enquiry.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            enquiry_model_1.Enquiry.countDocuments(filter),
        ]);
        return res.json({
            success: true,
            data: items,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getEnquiries = getEnquiries;
const getEnquiry = async (req, res, next) => {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.id))
            return res
                .status(400)
                .json({ success: false, message: "Invalid enquiry ID" });
        const item = await enquiry_model_1.Enquiry.findById(req.params.id).lean();
        if (!item)
            return res
                .status(404)
                .json({ success: false, message: "Enquiry not found" });
        return res.json({ success: true, data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.getEnquiry = getEnquiry;
const updateEnquiry = async (req, res, next) => {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.id))
            return res
                .status(400)
                .json({ success: false, message: "Invalid enquiry ID" });
        const parsed = enquiry_validation_1.updateEnquirySchema.safeParse(req.body);
        if (!parsed.success)
            return res
                .status(400)
                .json({
                success: false,
                message: "Invalid update",
                errors: parsed.error.flatten(),
            });
        const item = await enquiry_model_1.Enquiry.findByIdAndUpdate(req.params.id, { $set: parsed.data }, { returnDocument: "after", runValidators: true });
        if (!item)
            return res
                .status(404)
                .json({ success: false, message: "Enquiry not found" });
        return res.json({ success: true, message: "Enquiry updated", data: item });
    }
    catch (error) {
        next(error);
    }
};
exports.updateEnquiry = updateEnquiry;
const deleteEnquiry = async (req, res, next) => {
    try {
        if (!(0, mongoose_1.isValidObjectId)(req.params.id))
            return res
                .status(400)
                .json({ success: false, message: "Invalid enquiry ID" });
        const item = await enquiry_model_1.Enquiry.findByIdAndDelete(req.params.id);
        if (!item)
            return res
                .status(404)
                .json({ success: false, message: "Enquiry not found" });
        return res.json({ success: true, message: "Enquiry deleted" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteEnquiry = deleteEnquiry;
