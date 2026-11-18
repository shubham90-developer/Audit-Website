"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partnershipRouter = void 0;
const express_1 = require("express");
const partnershipController_1 = require("./partnershipController");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// one logo per language
const partnerFiles = upload_1.upload.fields([
    { name: "logoEn", maxCount: 1 },
    { name: "logoAr", maxCount: 1 },
]);
router.get("/", partnershipController_1.getPartnershipData); // public
router.post("/", partnerFiles, partnershipController_1.createPartner);
router.patch("/:id", partnerFiles, partnershipController_1.updatePartner);
router.delete("/:id", partnershipController_1.deletePartner);
exports.partnershipRouter = router;
