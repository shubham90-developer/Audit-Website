"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteSettingsRouter = void 0;
const express_1 = require("express");
const upload_1 = require("../../middlewares/upload");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get("/", controller_1.getSettings);
// SECURITY: Insert your project's admin auth middleware before upload.fields().
router.patch("/", upload_1.upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "footerLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
]), controller_1.updateSettings);
exports.siteSettingsRouter = router;
