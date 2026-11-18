"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRouter = void 0;
const express_1 = require("express");
const upload_1 = require("../../middlewares/upload");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
// upload.any() is needed because detail images use dynamic
// field names such as detailImageEn_0 and detailImageAr_1.
router.get("/", controller_1.getServices);
router.get("/:id", controller_1.getServiceById);
router.post("/", upload_1.upload.any(), controller_1.createService);
router.patch("/:id", upload_1.upload.any(), controller_1.updateService);
router.delete("/:id", controller_1.deleteService);
exports.serviceRouter = router;
