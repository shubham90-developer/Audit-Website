import { Router } from "express";
import { upload } from "../../middlewares/upload";
import {
  getWhyChooseUs,
  createWhyChooseUs,
  updateWhyChooseUs,
  deleteWhyChooseUs,
} from "./controller";

const router = Router();

const imageFields = [
  { name: "centerImageEn", maxCount: 1 },
  { name: "centerImageAr", maxCount: 1 },
];

router.get("/", getWhyChooseUs);
router.post("/", upload.fields(imageFields), createWhyChooseUs);
router.patch("/", upload.fields(imageFields), updateWhyChooseUs);
router.delete("/", deleteWhyChooseUs);

export const whyChooseUsRouter = router;
