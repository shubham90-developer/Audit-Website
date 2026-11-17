import { Router } from "express";
import { upload } from "../../middlewares/upload";

import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "./controller";

const router = Router();

// upload.any() is needed because detail images use dynamic
// field names such as detailImageEn_0 and detailImageAr_1.

router.get("/", getServices);
router.get("/:id", getServiceById);

router.post("/", upload.any(), createService);
router.patch("/:id", upload.any(), updateService);

router.delete("/:id", deleteService);

export const serviceRouter = router;
