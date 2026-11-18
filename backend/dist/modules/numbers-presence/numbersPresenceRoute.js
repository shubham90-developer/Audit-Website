"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numbersPresenceRouter = void 0;
const express_1 = require("express");
const numbersPresenceController_1 = require("./numbersPresenceController");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// section backgrounds, one per language each
const sectionFiles = upload_1.upload.fields([
    { name: "sectionBgEn", maxCount: 1 },
    { name: "sectionBgAr", maxCount: 1 },
    { name: "panelBgEn", maxCount: 1 },
    { name: "panelBgAr", maxCount: 1 },
]);
// office photos, one per language
const officeFiles = upload_1.upload.fields([
    { name: "imageEn", maxCount: 1 },
    { name: "imageAr", maxCount: 1 },
]);
router.get("/", numbersPresenceController_1.getNumbersPresence); // public
router.patch("/section", sectionFiles, numbersPresenceController_1.updateSection);
// stats are text only. upload.none() accepts multipart text with no files.
router.post("/stats", upload_1.upload.none(), numbersPresenceController_1.createStat);
router.patch("/stats/:id", upload_1.upload.none(), numbersPresenceController_1.updateStat);
router.delete("/stats/:id", numbersPresenceController_1.deleteStat);
router.post("/offices", officeFiles, numbersPresenceController_1.createOffice);
router.patch("/offices/:id", officeFiles, numbersPresenceController_1.updateOffice);
router.delete("/offices/:id", numbersPresenceController_1.deleteOffice);
exports.numbersPresenceRouter = router;
