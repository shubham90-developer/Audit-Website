"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aboutUsRouter = void 0;
const express_1 = require("express");
const aboutUsController_1 = require("./aboutUsController");
const upload_1 = require("../../middlewares/upload");
const aboutUs_interface_1 = require("./aboutUs.interface");
const router = (0, express_1.Router)();
// One upload field per image and language:
// - single images, e.g. heroImageEn, heroBgAr
// - list item images, e.g. ourStoryStepImageEn0 ... ourStoryStepImageAr7
const aboutFiles = upload_1.upload.fields([
    ...aboutUs_interface_1.SINGLE_IMAGE_SLOTS.flatMap((slot) => [
        { name: slot.files.en, maxCount: 1 },
        { name: slot.files.ar, maxCount: 1 },
    ]),
    ...aboutUs_interface_1.ITEM_IMAGE_SLOTS.flatMap((slot) => Array.from({ length: aboutUs_interface_1.MAX_ITEMS }, (_, i) => [
        { name: `${slot.files.en}${i}`, maxCount: 1 },
        { name: `${slot.files.ar}${i}`, maxCount: 1 },
    ]).flat()),
]);
router.get("/", aboutUsController_1.getAboutUsData); // public
// PATCH is the main method. PUT and POST stay for older admin code.
router.patch("/", aboutFiles, aboutUsController_1.updateAboutUsData);
router.put("/", aboutFiles, aboutUsController_1.updateAboutUsData);
router.post("/", aboutFiles, aboutUsController_1.updateAboutUsData);
exports.aboutUsRouter = router;
