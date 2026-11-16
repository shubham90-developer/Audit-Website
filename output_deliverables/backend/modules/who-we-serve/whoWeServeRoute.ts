import { Router } from "express";
import {
  getWhoWeServe,
  updateSection,
  createCard,
  updateCard,
  deleteCard,
} from "./whoWeServeController";
import { upload } from "../../middlewares/upload";

const router = Router();

// section background, one per language
const sectionFiles = upload.fields([
  { name: "leftBgEn", maxCount: 1 },
  { name: "leftBgAr", maxCount: 1 },
]);

// card images, one per language
const cardFiles = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);

router.get("/", getWhoWeServe);

router.patch("/section", sectionFiles, updateSection);

router.post("/cards", cardFiles, createCard);
router.patch("/cards/:id", cardFiles, updateCard);
router.delete("/cards/:id", deleteCard);

export const whoWeServeRouter = router;
