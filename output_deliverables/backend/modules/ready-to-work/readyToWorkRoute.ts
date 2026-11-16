import { Router } from "express";
import {
  getReadyToWork,
  updateSection,
  createFeature,
  updateFeature,
  deleteFeature,
} from "./readyToWorkController";
import { upload } from "../../middlewares/upload";

const router = Router();

// background photo, one per language
const sectionFiles = upload.fields([
  { name: "bgImageEn", maxCount: 1 },
  { name: "bgImageAr", maxCount: 1 },
]);

router.get("/", getReadyToWork); // public

router.patch("/section", sectionFiles, updateSection);

// features are text only. upload.none() accepts multipart text with no files.
router.post("/features", upload.none(), createFeature);
router.patch("/features/:id", upload.none(), updateFeature);
router.delete("/features/:id", deleteFeature);

export const readyToWorkRouter = router;
