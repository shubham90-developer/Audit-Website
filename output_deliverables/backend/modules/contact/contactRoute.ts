import { Router } from "express";
import multer from "multer";
import {
  getContactSection,
  updateContactSection,
  submitContactEnquiry,
  getContactEnquiries,
  updateEnquiryStatus,
  deleteContactEnquiry,
} from "./contactController";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get("/section", getContactSection);
router.put("/section", upload.single("bgImage"), updateContactSection);

router.post("/enquiries", submitContactEnquiry);
router.get("/enquiries", getContactEnquiries);
router.put("/enquiries/:id/status", updateEnquiryStatus);
router.delete("/enquiries/:id", deleteContactEnquiry);

export const contactRoute = router;
