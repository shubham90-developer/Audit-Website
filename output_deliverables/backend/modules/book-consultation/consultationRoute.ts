import { Router } from "express";
import {
  getConsultationData,
  updateConsultationSection,
  createConsultationEnquiry,
  getConsultationEnquiries,
  updateConsultationEnquiryStatus,
  deleteConsultationEnquiry,
} from "./consultationController";
import { upload } from "../../middlewares/upload";

const router = Router();

const consultationFiles = upload.fields([
  { name: "bgImageEn", maxCount: 1 },
  { name: "bgImageAr", maxCount: 1 },
  { name: "cardImageEn", maxCount: 1 },
  { name: "cardImageAr", maxCount: 1 },
]);

router.get("/", getConsultationData);
router.put("/", consultationFiles, updateConsultationSection);
router.post("/", consultationFiles, updateConsultationSection);
router.patch("/", consultationFiles, updateConsultationSection);

router.post("/enquiry", createConsultationEnquiry);
router.get("/enquiries", getConsultationEnquiries);
router.patch("/enquiries/:id", updateConsultationEnquiryStatus);
router.delete("/enquiries/:id", deleteConsultationEnquiry);

export const consultationRouter = router;
