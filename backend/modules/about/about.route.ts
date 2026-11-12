import { Router } from "express";
import {
  createMissionVision,
  getAllMissionVision,
  updateMissionVision,
  deleteMissionVision,
} from "./about.controller";
import { upload } from "../../middlewares/upload";

const router = Router();

// file fields this module accepts (names must match the controller)
const imageFiles = upload.fields([
  { name: "imageEn", maxCount: 5 },
  { name: "imageAr", maxCount: 5 },
]);

router.post("/", imageFiles, createMissionVision);
router.get("/", getAllMissionVision);
router.patch("/:id", imageFiles, updateMissionVision);
router.delete("/:id", deleteMissionVision);

export const aboutRouter = router;
