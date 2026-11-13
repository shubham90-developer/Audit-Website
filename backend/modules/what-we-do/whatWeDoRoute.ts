import { Router } from "express";
import {
  getWhatWeDo,
  updateSection,
  createService,
  updateService,
  deleteService,
} from "./whatWeDoController";
import { upload } from "../../middlewares/upload";

const router = Router();

// one panel image per language
const serviceFiles = upload.fields([
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
]);

router.get("/", getWhatWeDo); // public

// upload.none() accepts multipart text fields with no files
router.patch("/section", upload.none(), updateSection);

router.post("/services", serviceFiles, createService);
router.patch("/services/:id", serviceFiles, updateService);
router.delete("/services/:id", deleteService);

export const whatWeDoRouter = router;
