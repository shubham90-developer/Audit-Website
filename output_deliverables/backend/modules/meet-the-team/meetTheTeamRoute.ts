import { Router } from "express";
import multer from "multer";
import {
  getMeetTheTeamData,
  updateMeetTheTeamData,
} from "./meetTheTeamController";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

const fields = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "videoPoster", maxCount: 1 },
  { name: "bgImage", maxCount: 1 },
]);

router.get("/", getMeetTheTeamData); // public
router.patch("/", fields, updateMeetTheTeamData);

export const meetTheTeamRouter = router;
