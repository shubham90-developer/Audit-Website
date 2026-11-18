import { Router } from "express";
import { getLegalPage, updateLegalPage } from "./legal.controller";
import { upload } from "../../middlewares/upload";

const router = Router();
const heroFiles = upload.fields([
  { name: "heroImageEn", maxCount: 1 },
  { name: "heroImageAr", maxCount: 1 },
]);
router.get("/:kind", getLegalPage);
// IMPORTANT: Attach your existing admin authentication middleware before heroFiles in production.
router.put("/:kind", heroFiles, updateLegalPage);
export const legalPageRouter = router;
