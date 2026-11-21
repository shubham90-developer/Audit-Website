"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = require("../../middlewares/auth");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
// brute-force protection: 10 attempts / 15 min / IP
const signinLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many attempts, try again later" },
});
router.post("/signin", signinLimiter, admin_controller_1.signin);
router.get("/me", auth_1.requireAdmin, admin_controller_1.me);
router.put("/change-credentials", auth_1.requireAdmin, admin_controller_1.changeCredentials);
exports.adminAuthRouter = router;
