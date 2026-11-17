import { Router } from "express";

import {
  getGlobalMarkets,
  updateSection,
  createMarket,
  updateMarket,
  deleteMarket,
} from "./controller";

import { upload } from "../../middlewares/upload";

const router = Router();

// Background image uploads
const sectionFiles = upload.fields([
  { name: "bgImageEn", maxCount: 1 },
  { name: "bgImageAr", maxCount: 1 },
]);

// Country card image uploads
const marketFiles = upload.fields([
  { name: "marketImageEn", maxCount: 1 },
  { name: "marketImageAr", maxCount: 1 },
]);

// Public API
router.get("/", getGlobalMarkets);

// Main section
router.patch("/section", sectionFiles, updateSection);

// Country cards
router.post("/countries", marketFiles, createMarket);
router.patch("/countries/:id", marketFiles, updateMarket);
router.delete("/countries/:id", deleteMarket);

export const globalMarketsRouter = router;
