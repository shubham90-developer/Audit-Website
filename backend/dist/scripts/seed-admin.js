"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Usage: npm run seed:admin   (reads ADMIN_EMAIL / ADMIN_PASSWORD from .env)
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_model_1 = require("../modules/admin-auth/admin.model");
const run = async () => {
    const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
        throw new Error("Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    }
    if (ADMIN_PASSWORD.length < 8)
        throw new Error("ADMIN_PASSWORD must be 8+ chars");
    await mongoose_1.default.connect(MONGODB_URI);
    const email = ADMIN_EMAIL.trim().toLowerCase();
    const password = await bcryptjs_1.default.hash(ADMIN_PASSWORD, 12);
    const existing = await admin_model_1.Admin.findOne({ email });
    if (existing) {
        existing.password = password;
        existing.credentialsChangedAt = new Date();
        await existing.save();
        console.log(`Updated password for ${email}`);
    }
    else {
        await admin_model_1.Admin.create({ email, password, name: "Admin" });
        console.log(`Created admin ${email}`);
    }
    await mongoose_1.default.disconnect();
};
run().catch((e) => {
    console.error(e.message);
    process.exit(1);
});
