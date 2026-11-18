import { Router } from "express";

import {
  createEnquiry,
  getEnquiries,
  getEnquiry,
  updateEnquiry,
  deleteEnquiry,
} from "./enquiry.controller";

const router = Router();

// Public API
router.post("/", createEnquiry);

// Admin APIs
router.get("/", getEnquiries);
router.get("/:id", getEnquiry);
router.patch("/:id", updateEnquiry);
router.delete("/:id", deleteEnquiry);

export const enquiryRouter = router;
