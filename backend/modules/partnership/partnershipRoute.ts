import { Router } from "express";
import {
  getPartnershipData,
  createPartner,
  updatePartner,
  deletePartner,
} from "./partnershipController";
import { upload } from "../../middlewares/upload";

const router = Router();

// one logo per language
const partnerFiles = upload.fields([
  { name: "logoEn", maxCount: 1 },
  { name: "logoAr", maxCount: 1 },
]);

router.get("/", getPartnershipData); // public
router.post("/", partnerFiles, createPartner);
router.patch("/:id", partnerFiles, updatePartner);
router.delete("/:id", deletePartner);

export const partnershipRouter = router;
