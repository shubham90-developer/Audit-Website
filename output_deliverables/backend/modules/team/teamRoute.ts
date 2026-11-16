import { Router } from "express";
import {
  getTeamData,
  updateTeamSection,
  createLeadershipMember,
  updateLeadershipMember,
  deleteLeadershipMember,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "./teamController";
import { upload } from "../../middlewares/upload";

const router = Router();

const memberFiles = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);

router.get("/", getTeamData);
router.put("/section", updateTeamSection);

router.post("/leadership", memberFiles, createLeadershipMember);
router.patch("/leadership/:id", memberFiles, updateLeadershipMember);
router.put("/leadership/:id", memberFiles, updateLeadershipMember);
router.delete("/leadership/:id", deleteLeadershipMember);

router.post("/members", memberFiles, createTeamMember);
router.patch("/members/:id", memberFiles, updateTeamMember);
router.put("/members/:id", memberFiles, updateTeamMember);
router.delete("/members/:id", deleteTeamMember);

export const teamRouter = router;
