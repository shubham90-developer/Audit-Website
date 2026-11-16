import { Schema, model } from "mongoose";
import { IAdminUser } from "./adminAuth.interface";

const adminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

export const AdminUser = model<IAdminUser>("AdminUser", adminUserSchema);
