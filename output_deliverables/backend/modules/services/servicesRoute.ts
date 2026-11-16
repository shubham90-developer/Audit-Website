import { Router } from "express";
import multer from "multer";
import {
  getServices,
  getServiceBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  createServiceItem,
  updateServiceItem,
  deleteServiceItem,
} from "./servicesController";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/", getServices);
router.get("/:slug", getServiceBySlug);

router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.post("/items", upload.single("image"), createServiceItem);
router.put("/items/:id", upload.single("image"), updateServiceItem);
router.delete("/items/:id", deleteServiceItem);

export const servicesRoute = router;
