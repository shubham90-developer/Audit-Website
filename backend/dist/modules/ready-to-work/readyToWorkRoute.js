"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readyToWorkRouter = void 0;
const express_1 = require("express");
const readyToWorkController_1 = require("./readyToWorkController");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// background photo, one per language
const sectionFiles = upload_1.upload.fields([
    { name: "bgImageEn", maxCount: 1 },
    { name: "bgImageAr", maxCount: 1 },
]);
router.get("/", readyToWorkController_1.getReadyToWork); // public
router.patch("/section", sectionFiles, readyToWorkController_1.updateSection);
// features are text only. upload.none() accepts multipart text with no files.
router.post("/features", upload_1.upload.none(), readyToWorkController_1.createFeature);
router.patch("/features/:id", upload_1.upload.none(), readyToWorkController_1.updateFeature);
router.delete("/features/:id", readyToWorkController_1.deleteFeature);
exports.readyToWorkRouter = router;
