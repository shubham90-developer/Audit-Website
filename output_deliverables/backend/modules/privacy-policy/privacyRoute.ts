import { Router } from "express";
import { getPrivacy, updatePrivacy } from "./privacyController";

const router = Router();

router.get("/", getPrivacy);
router.put("/", updatePrivacy);
router.post("/", updatePrivacy);
router.patch("/", updatePrivacy);

export const privacyRouter = router;
