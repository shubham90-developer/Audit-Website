"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.howWeWorkRouter = void 0;
const express_1 = require("express");
const howWeWorkController_1 = require("./howWeWorkController");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// section photo, one per language
const sectionFiles = upload_1.upload.fields([
    { name: "imageEn", maxCount: 1 },
    { name: "imageAr", maxCount: 1 },
]);
router.get("/", howWeWorkController_1.getHowWeWork); // public
router.patch("/section", sectionFiles, howWeWorkController_1.updateSection);
// steps are text only. upload.none() accepts multipart text with no files.
router.post("/steps", upload_1.upload.none(), howWeWorkController_1.createStep);
router.patch("/steps/:id", upload_1.upload.none(), howWeWorkController_1.updateStep);
router.delete("/steps/:id", howWeWorkController_1.deleteStep);
exports.howWeWorkRouter = router;
