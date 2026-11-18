import { Router } from "express";
import { getContactContent, updateContactContent } from "./controller";
import { upload } from "../../middlewares/upload";
const router = Router();
const media = upload.fields([
  { name: "heroBgImageEn", maxCount: 1 },
  { name: "heroBgImageAr", maxCount: 1 },
  { name: "heroVideoEn", maxCount: 1 },
  { name: "heroVideoAr", maxCount: 1 },
  { name: "sectionBgImageEn", maxCount: 1 },
  { name: "sectionBgImageAr", maxCount: 1 },
]);
router.get("/", getContactContent);
// IMPORTANT: add your existing admin auth middleware before media for PATCH.
router.patch("/", media, updateContactContent);
export const contactContentRouter = router;
