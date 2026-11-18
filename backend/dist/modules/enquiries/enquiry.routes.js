"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryRouter = void 0;
const express_1 = require("express");
const enquiry_controller_1 = require("./enquiry.controller");
const router = (0, express_1.Router)();
// Public API
router.post("/", enquiry_controller_1.createEnquiry);
// Admin APIs
router.get("/", enquiry_controller_1.getEnquiries);
router.get("/:id", enquiry_controller_1.getEnquiry);
router.patch("/:id", enquiry_controller_1.updateEnquiry);
router.delete("/:id", enquiry_controller_1.deleteEnquiry);
exports.enquiryRouter = router;
