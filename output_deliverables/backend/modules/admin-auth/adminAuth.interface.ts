import { Document } from "mongoose";

export interface IAdminUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}
