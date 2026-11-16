import { Router } from "express";
import { getFaqs, createFaq, updateFaq, deleteFaq } from "./faqController";

const router = Router();

router.get("/", getFaqs);
router.post("/", createFaq);
router.patch("/:id", updateFaq);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

export const faqRouter = router;
