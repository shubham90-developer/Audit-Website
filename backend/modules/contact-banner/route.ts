import { Router } from "express";
import { getContactBanner, updateContactBanner } from "./controller";
import { upload } from "../../middlewares/upload";

const router = Router();

// file fields this module accepts (names must match the controller)
const imageFiles = upload.fields([
  { name: "image1En", maxCount: 1 },
  { name: "image1Ar", maxCount: 1 },
  { name: "image2En", maxCount: 1 },
  { name: "image2Ar", maxCount: 1 },
  { name: "image3En", maxCount: 1 },
  { name: "image3Ar", maxCount: 1 },
]);

router.get("/", getContactBanner);
router.patch("/", imageFiles, updateContactBanner);

export const contactBannerRouter = router;
