// Usage: npm run seed:admin   (reads ADMIN_EMAIL / ADMIN_PASSWORD from .env)
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../modules/admin-auth/admin.model";

const run = async () => {
  const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env");
  }
  if (ADMIN_PASSWORD.length < 8)
    throw new Error("ADMIN_PASSWORD must be 8+ chars");

  await mongoose.connect(MONGODB_URI);
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const password = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const existing = await Admin.findOne({ email });
  if (existing) {
    existing.password = password;
    existing.credentialsChangedAt = new Date();
    await existing.save();
    console.log(`Updated password for ${email}`);
  } else {
    await Admin.create({ email, password, name: "Admin" });
    console.log(`Created admin ${email}`);
  }
  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
