import { Router } from "express";
import {
  getIndustriesData,
  updateIndustriesSection,
  createIndustryItem,
  updateIndustryItem,
  deleteIndustryItem,
} from "./industriesController";
import { upload } from "../../middlewares/upload";

const router = Router();

const sectionFiles = upload.fields([
  { name: "bgImageEn", maxCount: 1 },
  { name: "bgImageAr", maxCount: 1 },
]);

const itemFiles = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);

router.get("/", getIndustriesData);
router.put("/section", sectionFiles, updateIndustriesSection);
router.post("/section", sectionFiles, updateIndustriesSection);
router.patch("/section", sectionFiles, updateIndustriesSection);

router.post("/items", itemFiles, createIndustryItem);
router.patch("/items/:id", itemFiles, updateIndustryItem);
router.put("/items/:id", itemFiles, updateIndustryItem);
router.delete("/items/:id", deleteIndustryItem);

export const industriesRouter = router;
