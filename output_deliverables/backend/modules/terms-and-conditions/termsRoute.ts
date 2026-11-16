import { Router } from "express";
import { getTerms, updateTerms } from "./termsController";

const router = Router();

router.get("/", getTerms);
router.put("/", updateTerms);
router.post("/", updateTerms);
router.patch("/", updateTerms);

export const termsRouter = router;
