import { Router } from "express";
import {
  getWhoWeAre,
  updateSection,
  createItem,
  updateItem,
  deleteItem,
} from "./whoWeAreController";

const router = Router();

router.get("/", getWhoWeAre); // public

// admin routes. Mount behind your admin auth middleware, like the How We Work routes.
router.patch("/", updateSection);
router.post("/items", createItem);
router.patch("/items/:itemId", updateItem);
router.delete("/items/:itemId", deleteItem);

export const whoWeAreRouter = router;
