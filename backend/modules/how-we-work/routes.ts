import { Router } from "express";
import { upload } from "../../middlewares/upload";
import {
  getHowWeWork,
  createHowWeWork,
  updateHowWeWork,
  deleteHowWeWork,
} from "./controller";

const router = Router();

const imageFields = [
  { name: "imageEn", maxCount: 1 },
  { name: "imageAr", maxCount: 1 },
];

router.get("/", getHowWeWork);
router.post("/", upload.fields(imageFields), createHowWeWork);
router.patch("/", upload.fields(imageFields), updateHowWeWork);
router.delete("/", deleteHowWeWork);

export const howWeWorkRouter = router;
