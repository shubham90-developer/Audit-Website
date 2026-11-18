"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadershipRouter = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// Background images
const sectionFiles = upload_1.upload.fields([
    { name: "bgImageEn", maxCount: 1 },
    { name: "bgImageAr", maxCount: 1 },
]);
// Team member images
const memberFiles = upload_1.upload.fields([
    { name: "imageEn", maxCount: 1 },
    { name: "imageAr", maxCount: 1 },
]);
// Public
router.get("/", controller_1.getLeadership);
// Admin
router.get("/admin", controller_1.getLeadershipAdmin);
router.patch("/section", sectionFiles, controller_1.updateLeadershipSection);
router.post("/members", memberFiles, controller_1.createLeadershipMember);
router.patch("/members/:id", memberFiles, controller_1.updateLeadershipMember);
router.delete("/members/:id", controller_1.deleteLeadershipMember);
exports.leadershipRouter = router;
