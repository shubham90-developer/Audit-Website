import { Router } from "express";
import { upload } from "../../middlewares/upload";

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getServicesBanner,
  updateServicesBanner,
} from "./controller";

const router = Router();

// upload.any() is needed because detail images use dynamic
// field names such as detailImageEn_0 and detailImageAr_1.

// Page banner (singleton). These must stay above the "/:id" routes,
// otherwise "page-banner" would be treated as a service id.
router.get("/page-banner", getServicesBanner);
router.patch(
  "/page-banner",
  upload.fields([
    { name: "bgImageEn", maxCount: 1 },
    { name: "bgImageAr", maxCount: 1 },
  ]),
  updateServicesBanner,
);

router.get("/", getServices);
router.get("/:id", getServiceById);

router.post("/", upload.any(), createService);
router.patch("/:id", upload.any(), updateService);

router.delete("/:id", deleteService);

export const serviceRouter = router;
