"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqSectionRouter = void 0;
const express_1 = require("express");
const upload_1 = require("../../middlewares/upload");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get('/', controller_1.getFaqSection);
// IMPORTANT: add your existing admin auth middleware to PUT before deploying.
router.put('/', upload_1.upload.fields([{ name: 'backgroundImageEn', maxCount: 1 }, { name: 'backgroundImageAr', maxCount: 1 }]), controller_1.updateFaqSection);
exports.faqSectionRouter = router;
