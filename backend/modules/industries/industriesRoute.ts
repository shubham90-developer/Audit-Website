import { Router } from "express";
import {
  getIndustries,
  updateSection,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} from "./industriesController";
import { upload } from "../../middlewares/upload";

const router = Router();

// section background, one per language
const sectionFiles = upload.fields([
  { name: "sectionBgEn", maxCount: 1 },
  { name: "sectionBgAr", maxCount: 1 },
]);

// card picture, one per language
const itemFiles = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);

router.get("/", getIndustries); // public

router.patch("/section", sectionFiles, updateSection);

router.post("/items", itemFiles, createIndustry);
router.patch("/items/:id", itemFiles, updateIndustry);
router.delete("/items/:id", deleteIndustry);

export const industriesRouter = router;
