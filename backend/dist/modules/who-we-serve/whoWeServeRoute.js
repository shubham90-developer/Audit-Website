"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoWeServeRouter = void 0;
const express_1 = require("express");
const whoWeServeController_1 = require("./whoWeServeController");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// section background, one per language
const sectionFiles = upload_1.upload.fields([
    { name: "leftBgEn", maxCount: 1 },
    { name: "leftBgAr", maxCount: 1 },
]);
// card images, one per language
const cardFiles = upload_1.upload.fields([
    { name: "imageEn", maxCount: 1 },
    { name: "imageAr", maxCount: 1 },
]);
router.get("/", whoWeServeController_1.getWhoWeServe);
router.patch("/section", sectionFiles, whoWeServeController_1.updateSection);
router.post("/cards", cardFiles, whoWeServeController_1.createCard);
router.patch("/cards/:id", cardFiles, whoWeServeController_1.updateCard);
router.delete("/cards/:id", whoWeServeController_1.deleteCard);
exports.whoWeServeRouter = router;
