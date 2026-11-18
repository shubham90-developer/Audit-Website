"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactContentRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
const media = upload_1.upload.fields([
    { name: "heroBgImageEn", maxCount: 1 },
    { name: "heroBgImageAr", maxCount: 1 },
    { name: "heroVideoEn", maxCount: 1 },
    { name: "heroVideoAr", maxCount: 1 },
    { name: "sectionBgImageEn", maxCount: 1 },
    { name: "sectionBgImageAr", maxCount: 1 },
]);
router.get("/", controller_1.getContactContent);
// IMPORTANT: add your existing admin auth middleware before media for PATCH.
router.patch("/", media, controller_1.updateContactContent);
exports.contactContentRouter = router;
