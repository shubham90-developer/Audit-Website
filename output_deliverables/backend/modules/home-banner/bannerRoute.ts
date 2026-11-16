import { Router } from "express";
import {
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
} from "./bannerController";

import { upload } from "../../middlewares/upload";

const router = Router();

// fields this module accepts (names must match the controller)
const bannerFiles = upload.fields([
  { name: "bgImagesEn", maxCount: 10 },
  { name: "bgImagesAr", maxCount: 10 },
  { name: "posterImageEn", maxCount: 1 },
  { name: "posterImageAr", maxCount: 1 },
  { name: "bgVideosEn", maxCount: 5 },
  { name: "bgVideosAr", maxCount: 5 },
]);

router.post("/", bannerFiles, createBanner);
router.get("/", getAllBanners);
router.patch("/:id", bannerFiles, updateBanner);
router.delete("/:id", deleteBanner);

export const homeBnnerRouter = router;
