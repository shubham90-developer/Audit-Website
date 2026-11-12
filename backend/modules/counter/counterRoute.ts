import { Router } from "express";
import { getCounter, updateCounter } from "./counterController";

const router = Router();

router.get("/", getCounter);
router.patch("/", updateCounter);

export const counterRouter = router;
