import { Router } from "express";
import {
  getNumbersPresence,
  updateSection,
  createStat,
  updateStat,
  deleteStat,
  createOffice,
  updateOffice,
  deleteOffice,
} from "./numbersPresenceController";
import { upload } from "../../middlewares/upload";

const router = Router();

// section backgrounds, one per language each
const sectionFiles = upload.fields([
  { name: "sectionBgEn", maxCount: 1 },
  { name: "sectionBgAr", maxCount: 1 },
  { name: "panelBgEn", maxCount: 1 },
  { name: "panelBgAr", maxCount: 1 },
]);

// office photos, one per language
const officeFiles = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);

router.get("/", getNumbersPresence); // public

router.patch("/section", sectionFiles, updateSection);

// stats are text only. upload.none() accepts multipart text with no files.
router.post("/stats", upload.none(), createStat);
router.patch("/stats/:id", upload.none(), updateStat);
router.delete("/stats/:id", deleteStat);

router.post("/offices", officeFiles, createOffice);
router.patch("/offices/:id", officeFiles, updateOffice);
router.delete("/offices/:id", deleteOffice);

export const numbersPresenceRouter = router;
