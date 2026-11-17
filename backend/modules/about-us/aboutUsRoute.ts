import { Router } from "express";
import { getAboutUsData, updateAboutUsData } from "./aboutUsController";
import { upload } from "../../middlewares/upload";
import {
  SINGLE_IMAGE_SLOTS,
  ITEM_IMAGE_SLOTS,
  MAX_ITEMS,
} from "./aboutUs.interface";

const router = Router();

// One upload field per image and language:
// - single images, e.g. heroImageEn, heroBgAr
// - list item images, e.g. ourStoryStepImageEn0 ... ourStoryStepImageAr7
const aboutFiles = upload.fields([
  ...SINGLE_IMAGE_SLOTS.flatMap((slot) => [
    { name: slot.files.en, maxCount: 1 },
    { name: slot.files.ar, maxCount: 1 },
  ]),
  ...ITEM_IMAGE_SLOTS.flatMap((slot) =>
    Array.from({ length: MAX_ITEMS }, (_, i) => [
      { name: `${slot.files.en}${i}`, maxCount: 1 },
      { name: `${slot.files.ar}${i}`, maxCount: 1 },
    ]).flat(),
  ),
]);

router.get("/", getAboutUsData); // public

// PATCH is the main method. PUT and POST stay for older admin code.
router.patch("/", aboutFiles, updateAboutUsData);
router.put("/", aboutFiles, updateAboutUsData);
router.post("/", aboutFiles, updateAboutUsData);

export const aboutUsRouter = router;
