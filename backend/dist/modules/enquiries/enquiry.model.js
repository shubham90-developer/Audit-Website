"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enquiry = void 0;
const mongoose_1 = require("mongoose");
const enquirySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 150 },
    companyName: { type: String, trim: true, maxlength: 200, default: "" },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
    },
    countryCode: {
        type: String,
        required: true,
        trim: true,
        maxlength: 8,
        default: "+971",
    },
    mobile: { type: String, required: true, trim: true, maxlength: 25 },
    service: { type: String, required: true, trim: true, maxlength: 200 },
    requirements: { type: String, required: true, trim: true, maxlength: 5000 },
    language: { type: String, enum: ["en", "ar"], default: "en" },
    status: {
        type: String,
        enum: ["new", "contacted", "in_progress", "closed"],
        default: "new",
    },
    adminNotes: { type: String, default: "", maxlength: 5000 },
}, { timestamps: true });
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1, createdAt: -1 });
exports.Enquiry = mongoose_1.models.Enquiry || (0, mongoose_1.model)("Enquiry", enquirySchema);
