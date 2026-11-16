import { Router } from "express";
import multer from "multer";
import {
  getInsights,
  getInsightBySlug,
  createInsight,
  updateInsight,
  deleteInsight,
} from "./insightsController";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/", getInsights);
router.get("/:slug", getInsightBySlug);
router.post("/", upload.single("media"), createInsight);
router.put("/:id", upload.single("media"), updateInsight);
router.delete("/:id", deleteInsight);

export const insightsRoute = router;
