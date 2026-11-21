"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouter = void 0;
const express_1 = require("express");
const blog_controller_1 = require("./blog.controller");
const upload_1 = require("../../middlewares/upload");
const router = (0, express_1.Router)();
router.get("/", blog_controller_1.getBlogSection);
router.get("/articles/:slug", blog_controller_1.getPublishedArticle);
// IMPORTANT: Add your admin authentication middleware here before deploying.
router.put("/", blog_controller_1.updateBlogSection);
router.post("/image", upload_1.upload.single("image"), blog_controller_1.uploadBlogImage);
exports.blogRouter = router;
