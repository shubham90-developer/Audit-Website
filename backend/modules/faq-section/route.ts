import { Router } from "express";
import { upload } from "../../middlewares/upload";
import { getFaqSection, updateFaqSection } from "./controller";
const router = Router();
router.get("/", getFaqSection);
// IMPORTANT: add your existing admin auth middleware to PUT before deploying.
router.put("/", upload.any(), updateFaqSection);
export const faqSectionRouter = router;
