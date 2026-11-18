"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatWeDoRouter = void 0;
const express_1 = require("express");
const whatWeDoController_1 = require("./whatWeDoController");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// one panel image per language
const serviceFiles = upload_1.upload.fields([
    { name: "imageEn", maxCount: 1 },
    { name: "imageAr", maxCount: 1 },
]);
router.get("/", whatWeDoController_1.getWhatWeDo); // public
// upload.none() accepts multipart text fields with no files
router.patch("/section", upload_1.upload.none(), whatWeDoController_1.updateSection);
router.post("/services", serviceFiles, whatWeDoController_1.createService);
router.patch("/services/:id", serviceFiles, whatWeDoController_1.updateService);
router.delete("/services/:id", whatWeDoController_1.deleteService);
exports.whatWeDoRouter = router;
