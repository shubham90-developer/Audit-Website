import { Schema, model, type InferSchemaType } from "mongoose";

const adminSchema = new Schema(
  {
    name: { type: String, trim: true, default: "Admin" },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // select:false -> never returned unless explicitly requested with .select("+password")
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin"], default: "admin" },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    // tokens issued before this moment are rejected (set on password/email change)
    credentialsChangedAt: { type: Date },
  },
  { timestamps: true },
);

export type AdminDoc = InferSchemaType<typeof adminSchema>;
export const Admin = model("Admin", adminSchema);

export const toPublicAdmin = (a: {
  _id: unknown;
  name?: string | null;
  email: string;
  role?: string | null;
  status?: string | null;
}) => ({
  _id: String(a._id),
  name: a.name ?? "Admin",
  email: a.email,
  role: a.role ?? "admin",
  status: a.status ?? "active",
});
