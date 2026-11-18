"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialRouter = void 0;
const express_1 = require("express");
const testimonial_controller_1 = require("./testimonial.controller");
const router = (0, express_1.Router)();
router.get("/", testimonial_controller_1.getTestimonialSection);
// IMPORTANT: Apply your existing admin JWT / role middleware before this PUT route.
router.put("/", testimonial_controller_1.updateTestimonialSection);
exports.testimonialRouter = router;
