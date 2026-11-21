"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPublicAdmin = exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.Admin = (0, mongoose_1.model)("Admin", adminSchema);
const toPublicAdmin = (a) => ({
    _id: String(a._id),
    name: a.name ?? "Admin",
    email: a.email,
    role: a.role ?? "admin",
    status: a.status ?? "active",
});
exports.toPublicAdmin = toPublicAdmin;
