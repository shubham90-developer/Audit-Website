import { Router } from "express";
import { getAboutUsData, updateAboutUsData } from "./aboutUsController";
import { upload } from "../../middlewares/upload";

const router = Router();

const aboutFiles = upload.fields([
  { name: "heroImageEn", maxCount: 1 },
  { name: "heroImageAr", maxCount: 1 },
  { name: "heroBgEn", maxCount: 1 },
  { name: "heroBgAr", maxCount: 1 },
  { name: "whoWeAreBgEn", maxCount: 1 },
  { name: "whoWeAreBgAr", maxCount: 1 },
  { name: "ourStoryBgEn", maxCount: 1 },
  { name: "ourStoryBgAr", maxCount: 1 },
  { name: "nextChapterBgEn", maxCount: 1 },
  { name: "nextChapterBgAr", maxCount: 1 },
]);

router.get("/", getAboutUsData);
router.put("/", aboutFiles, updateAboutUsData);
router.post("/", aboutFiles, updateAboutUsData);
router.patch("/", aboutFiles, updateAboutUsData);

export const aboutUsRouter = router;
