import { Router } from "express";
import { getSettings, updateSettings } from "./settingsController";
import { upload } from "../../middlewares/upload";

const router = Router();

const settingsFiles = upload.fields([
  { name: "logoEn", maxCount: 1 },
  { name: "logoAr", maxCount: 1 },
  { name: "faviconEn", maxCount: 1 },
  { name: "faviconAr", maxCount: 1 },
]);

router.get("/", getSettings);
router.post("/", settingsFiles, updateSettings);
router.put("/", settingsFiles, updateSettings);
router.patch("/", settingsFiles, updateSettings);

export const settingsRouter = router;
