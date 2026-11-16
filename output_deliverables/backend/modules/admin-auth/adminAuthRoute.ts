import { Router } from "express";
import { signin, getMe, changeCredentials } from "./adminAuthController";

const router = Router();

router.post("/signin", signin);
router.get("/me", getMe);
router.put("/change-credentials", changeCredentials);

export const adminAuthRouter = router;
