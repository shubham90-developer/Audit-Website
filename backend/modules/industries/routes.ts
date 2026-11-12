import { Router } from "express";
import { upload } from "../../middlewares/upload";
import {
  getIndustries,
  createIndustries,
  updateIndustries,
  deleteIndustries,
} from "./controller";

const router = Router();

const imageFields = Array.from({ length: 10 }, (_, i) => [
  { name: `item${i + 1}ImageEn`, maxCount: 1 },
  { name: `item${i + 1}ImageAr`, maxCount: 1 },
]).flat();

router.get("/", getIndustries);
router.post("/", upload.fields(imageFields), createIndustries);
router.patch("/", upload.fields(imageFields), updateIndustries);
router.delete("/", deleteIndustries);

export const industriesRouter = router;
