import { Router } from "express";

import {
  getLeadership,
  getLeadershipAdmin,
  updateLeadershipSection,
  createLeadershipMember,
  updateLeadershipMember,
  deleteLeadershipMember,
} from "./controller";

import { upload } from "../../middlewares/upload";

const router = Router();

// Background images
const sectionFiles = upload.fields([
  { name: "bgImageEn", maxCount: 1 },
  { name: "bgImageAr", maxCount: 1 },
]);

// Team member images
const memberFiles = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);

// Public
router.get("/", getLeadership);

// Admin
router.get("/admin", getLeadershipAdmin);

router.patch("/section", sectionFiles, updateLeadershipSection);

router.post("/members", memberFiles, createLeadershipMember);

router.patch("/members/:id", memberFiles, updateLeadershipMember);

router.delete("/members/:id", deleteLeadershipMember);

export const leadershipRouter = router;
