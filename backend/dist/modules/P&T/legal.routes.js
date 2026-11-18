"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legalPageRouter = void 0;
const express_1 = require("express");
const legal_controller_1 = require("./legal.controller");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
const heroFiles = upload_1.upload.fields([
    { name: "heroImageEn", maxCount: 1 },
    { name: "heroImageAr", maxCount: 1 },
]);
router.get("/:kind", legal_controller_1.getLegalPage);
// IMPORTANT: Attach your existing admin authentication middleware before heroFiles in production.
router.put("/:kind", heroFiles, legal_controller_1.updateLegalPage);
exports.legalPageRouter = router;
