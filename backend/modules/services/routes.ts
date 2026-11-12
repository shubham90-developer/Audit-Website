import { Router } from "express";
import { getWhatWeDo, updateWhatWeDo } from "./controller";
import { upload } from "../../middlewares/upload";

const router = Router();

// item1ImageEn, item1ImageAr ... item5ImageEn, item5ImageAr (5 cards)
const imageFiles = upload.fields(
  Array.from({ length: 5 }, (_, i) => [
    { name: `item${i + 1}ImageEn`, maxCount: 1 },
    { name: `item${i + 1}ImageAr`, maxCount: 1 },
  ]).flat(),
);

router.get("/", getWhatWeDo);
router.patch("/", imageFiles, updateWhatWeDo);

export const servicesRouter = router;
