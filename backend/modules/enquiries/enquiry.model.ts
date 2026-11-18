import { Schema, model, models } from "mongoose";

const enquirySchema = new Schema(
  {
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
  },
  { timestamps: true },
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1, createdAt: -1 });
export const Enquiry = models.Enquiry || model("Enquiry", enquirySchema);
