"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.industriesRouter = void 0;
const express_1 = require("express");
const industriesController_1 = require("./industriesController");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// section background, one per language
const sectionFiles = upload_1.upload.fields([
    { name: "sectionBgEn", maxCount: 1 },
    { name: "sectionBgAr", maxCount: 1 },
]);
// card picture, one per language
const itemFiles = upload_1.upload.fields([
    { name: "imageEn", maxCount: 1 },
    { name: "imageAr", maxCount: 1 },
]);
router.get("/", industriesController_1.getIndustries); // public
router.patch("/section", sectionFiles, industriesController_1.updateSection);
router.post("/items", itemFiles, industriesController_1.createIndustry);
router.patch("/items/:id", itemFiles, industriesController_1.updateIndustry);
router.delete("/items/:id", industriesController_1.deleteIndustry);
exports.industriesRouter = router;
