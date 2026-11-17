import { Router } from "express";
import {
  getOurStory,
  updateSection,
  createStep,
  updateStep,
  deleteStep,
} from "./controller";
import { upload } from "../../middlewares/upload";

const router = Router();

// section images, one per language
const sectionFiles = upload.fields([
  { name: "bgImageEn", maxCount: 1 },
  { name: "bgImageAr", maxCount: 1 },
  { name: "authorImageEn", maxCount: 1 },
  { name: "authorImageAr", maxCount: 1 },
]);

// step image, one per language
const stepFiles = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);

router.get("/", getOurStory); // public

router.patch("/section", sectionFiles, updateSection);

router.post("/steps", stepFiles, createStep);
router.patch("/steps/:id", stepFiles, updateStep);
router.delete("/steps/:id", deleteStep);

export const ourStoryRouter = router;
