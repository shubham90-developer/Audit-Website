import { Router } from "express";
import {
  getTestimonialSection,
  updateTestimonialSection,
} from "./testimonial.controller";
const router = Router();
router.get("/", getTestimonialSection);
// IMPORTANT: Apply your existing admin JWT / role middleware before this PUT route.
router.put("/", updateTestimonialSection);
export const testimonialRouter = router;
