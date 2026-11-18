import { Router } from "express";
import { upload } from "../../middlewares/upload";
import { getSettings, updateSettings } from "./controller";
const router = Router();
router.get("/", getSettings);
// SECURITY: Insert your project's admin auth middleware before upload.fields().
router.patch(
  "/",
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "footerLogo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
  ]),
  updateSettings,
);
export const siteSettingsRouter = router;
