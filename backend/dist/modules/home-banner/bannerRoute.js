"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeBnnerRouter = void 0;
const express_1 = require("express");
const bannerController_1 = require("./bannerController");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// fields this module accepts (names must match the controller)
const bannerFiles = upload_1.upload.fields([
    { name: "bgImagesEn", maxCount: 10 },
    { name: "bgImagesAr", maxCount: 10 },
    { name: "posterImageEn", maxCount: 1 },
    { name: "posterImageAr", maxCount: 1 },
    { name: "bgVideosEn", maxCount: 5 },
    { name: "bgVideosAr", maxCount: 5 },
]);
router.post("/", bannerFiles, bannerController_1.createBanner);
router.get("/", bannerController_1.getAllBanners);
router.patch("/:id", bannerFiles, bannerController_1.updateBanner);
router.delete("/:id", bannerController_1.deleteBanner);
exports.homeBnnerRouter = router;
