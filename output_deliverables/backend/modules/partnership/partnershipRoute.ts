import { Router } from "express";
import multer from "multer";
import {
  getPartnershipData,
  getPartnershipSection,
  updatePartnershipSection,
  createPartner,
  updatePartner,
  deletePartner,
} from "./partnershipController";
import { upload } from "../../middlewares/upload";

const memUpload = multer({ storage: multer.memoryStorage() });
const router = Router();

// one logo per language
const partnerFiles = upload.fields([
  { name: "logoEn", maxCount: 1 },
  { name: "logoAr", maxCount: 1 },
]);

router.get("/section", getPartnershipSection);
router.put("/section", memUpload.single("bgImage"), updatePartnershipSection);

router.get("/", getPartnershipData); // public
router.post("/", partnerFiles, createPartner);
router.patch("/:id", partnerFiles, updatePartner);
router.delete("/:id", deletePartner);

export const partnershipRouter = router;
