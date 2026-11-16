import { Router } from "express";
import { getMeetTheTeam, updateMeetTheTeam } from "./meetTheTeamController";
import { upload } from "../../middlewares/upload";

const router = Router();

// card image, one per language
const imageFiles = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);

router.get("/", getMeetTheTeam); // public
router.patch("/", imageFiles, updateMeetTheTeam); // admin

export const meetTheTeamRouter = router;
