import { Router } from "express";
import {
  getHowWeWork,
  updateSection,
  createStep,
  updateStep,
  deleteStep,
} from "./howWeWorkController";
import { upload } from "../../middlewares/upload";

const router = Router();

// section photo, one per language
const sectionFiles = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);

router.get("/", getHowWeWork); // public

router.patch("/section", sectionFiles, updateSection);

// steps are text only. upload.none() accepts multipart text with no files.
router.post("/steps", upload.none(), createStep);
router.patch("/steps/:id", upload.none(), updateStep);
router.delete("/steps/:id", deleteStep);

export const howWeWorkRouter = router;
