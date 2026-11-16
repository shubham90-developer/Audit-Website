import { Router } from "express";
import {
  getWhyUsData,
  updateWhyUsSection,
  createWhyUsCard,
  updateWhyUsCard,
  deleteWhyUsCard,
} from "./whyUsController";
import { upload } from "../../middlewares/upload";

const router = Router();

const whyUsFiles = upload.fields([
  { name: "centerImageEn", maxCount: 1 },
  { name: "centerImageAr", maxCount: 1 },
]);

router.get("/", getWhyUsData);
router.put("/section", whyUsFiles, updateWhyUsSection);
router.post("/section", whyUsFiles, updateWhyUsSection);
router.patch("/section", whyUsFiles, updateWhyUsSection);

router.post("/cards", createWhyUsCard);
router.patch("/cards/:id", updateWhyUsCard);
router.put("/cards/:id", updateWhyUsCard);
router.delete("/cards/:id", deleteWhyUsCard);

export const whyUsRouter = router;
