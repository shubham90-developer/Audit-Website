"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalMarketsRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// Background image uploads
const sectionFiles = upload_1.upload.fields([
    { name: "bgImageEn", maxCount: 1 },
    { name: "bgImageAr", maxCount: 1 },
]);
// Country card image uploads
const marketFiles = upload_1.upload.fields([
    { name: "marketImageEn", maxCount: 1 },
    { name: "marketImageAr", maxCount: 1 },
]);
// Public API
router.get("/", controller_1.getGlobalMarkets);
// Main section
router.patch("/section", sectionFiles, controller_1.updateSection);
// Country cards
router.post("/countries", marketFiles, controller_1.createMarket);
router.patch("/countries/:id", marketFiles, controller_1.updateMarket);
router.delete("/countries/:id", controller_1.deleteMarket);
exports.globalMarketsRouter = router;
