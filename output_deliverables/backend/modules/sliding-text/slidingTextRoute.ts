import { Router } from "express";
import { getSlidingText, updateSlidingText } from "./slidingTextController";

const router = Router();

router.get("/", getSlidingText);
router.put("/", updateSlidingText);
router.post("/", updateSlidingText);
router.patch("/", updateSlidingText);

export const slidingTextRouter = router;
