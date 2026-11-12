import { Router } from "express";
import { getFaq, createFaq, updateFaq, deleteFaq } from "./controller";

const router = Router();

router.get("/", getFaq);
router.post("/", createFaq);
router.patch("/", updateFaq);
router.delete("/", deleteFaq);

export default router;
