import { Router } from "express";
import {
  getBlogSection,
  updateBlogSection,
  getPublishedArticle,
} from "./blog.controller";
const router = Router();
router.get("/", getBlogSection);
router.get("/articles/:slug", getPublishedArticle);
// IMPORTANT: Add your existing admin authentication/authorization middleware here.
router.put("/", updateBlogSection);
export const blogRouter = router;
