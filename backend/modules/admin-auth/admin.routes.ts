import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAdmin } from "../../middlewares/auth";
import { signin, me, changeCredentials } from "./admin.controller";

const router = Router();

// brute-force protection: 10 attempts / 15 min / IP
const signinLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts, try again later" },
});

router.post("/signin", signinLimiter, signin);
router.get("/me", requireAdmin, me);
router.put("/change-credentials", requireAdmin, changeCredentials);

export const adminAuthRouter = router;
