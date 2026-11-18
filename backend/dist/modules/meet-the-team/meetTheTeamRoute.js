"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meetTheTeamRouter = void 0;
const express_1 = require("express");
const meetTheTeamController_1 = require("./meetTheTeamController");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
// card image, one per language
const imageFiles = upload_1.upload.fields([
    { name: "imageEn", maxCount: 1 },
    { name: "imageAr", maxCount: 1 },
]);
router.get("/", meetTheTeamController_1.getMeetTheTeam); // public
router.patch("/", imageFiles, meetTheTeamController_1.updateMeetTheTeam); // admin
exports.meetTheTeamRouter = router;
