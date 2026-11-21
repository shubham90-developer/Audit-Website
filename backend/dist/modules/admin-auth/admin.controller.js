"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeCredentials = exports.me = exports.signin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_model_1 = require("./admin.model");
const admin_validation_1 = require("./admin.validation");
const token_1 = require("../../utils/token");
const BCRYPT_ROUNDS = 12;
// Compared against when the email doesn't exist, so response time doesn't reveal valid emails.
const DUMMY_HASH = bcryptjs_1.default.hashSync("not-a-real-password", BCRYPT_ROUNDS);
const zodMessage = (issues) => issues.map((i) => i.message).join("; ");
const signin = async (req, res) => {
    const parsed = admin_validation_1.signinSchema.safeParse(req.body);
    if (!parsed.success) {
        res
            .status(400)
            .json({ success: false, message: zodMessage(parsed.error.issues) });
        return;
    }
    const { email, password } = parsed.data;
    const admin = await admin_model_1.Admin.findOne({ email }).select("+password");
    const ok = await bcryptjs_1.default.compare(password, admin?.password ?? DUMMY_HASH);
    if (!admin || !ok || admin.status !== "active") {
        // one generic message for wrong email / wrong password / disabled account
        res
            .status(401)
            .json({ success: false, message: "Invalid email or password" });
        return;
    }
    const token = (0, token_1.signAdminToken)({ sub: String(admin._id), role: admin.role });
    res.json({
        success: true,
        statusCode: 200,
        message: "Login successful",
        token,
        data: (0, admin_model_1.toPublicAdmin)(admin),
    });
};
exports.signin = signin;
const me = async (req, res) => {
    // req.admin is attached by requireAdmin
    res.json({ success: true, data: (0, admin_model_1.toPublicAdmin)(req.admin) });
};
exports.me = me;
const changeCredentials = async (req, res) => {
    const parsed = admin_validation_1.changeCredentialsSchema.safeParse(req.body);
    if (!parsed.success) {
        res
            .status(400)
            .json({ success: false, message: zodMessage(parsed.error.issues) });
        return;
    }
    const { currentPassword, newEmail, newPassword } = parsed.data;
    const admin = await admin_model_1.Admin.findById(req.admin._id).select("+password");
    if (!admin) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }
    if (!(await bcryptjs_1.default.compare(currentPassword, admin.password))) {
        res
            .status(400)
            .json({ success: false, message: "Current password is incorrect" });
        return;
    }
    if (newEmail && newEmail !== admin.email) {
        const taken = await admin_model_1.Admin.exists({
            email: newEmail,
            _id: { $ne: admin._id },
        });
        if (taken) {
            res
                .status(409)
                .json({ success: false, message: "That email is already in use" });
            return;
        }
        admin.email = newEmail;
    }
    if (newPassword) {
        admin.password = await bcryptjs_1.default.hash(newPassword, BCRYPT_ROUNDS);
    }
    // invalidate every token issued before this change; the response carries a fresh one
    admin.credentialsChangedAt = new Date();
    await admin.save();
    const token = (0, token_1.signAdminToken)({ sub: String(admin._id), role: admin.role });
    res.json({
        success: true,
        statusCode: 200,
        message: "Credentials updated successfully",
        token,
        data: (0, admin_model_1.toPublicAdmin)(admin),
    });
};
exports.changeCredentials = changeCredentials;
