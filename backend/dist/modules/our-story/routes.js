"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ourStoryRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// section images, one per language
const sectionFiles = upload_1.upload.fields([
    { name: "bgImageEn", maxCount: 1 },
    { name: "bgImageAr", maxCount: 1 },
    { name: "authorImageEn", maxCount: 1 },
    { name: "authorImageAr", maxCount: 1 },
]);
// step image, one per language
const stepFiles = upload_1.upload.fields([
    { name: "imageEn", maxCount: 1 },
    { name: "imageAr", maxCount: 1 },
]);
router.get("/", controller_1.getOurStory); // public
router.patch("/section", sectionFiles, controller_1.updateSection);
router.post("/steps", stepFiles, controller_1.createStep);
router.patch("/steps/:id", stepFiles, controller_1.updateStep);
router.delete("/steps/:id", controller_1.deleteStep);
exports.ourStoryRouter = router;
