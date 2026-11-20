import { Router } from "express";
import {
  getBlogSection,
  updateBlogSection,
  getPublishedArticle,
  uploadBlogImage,
} from "./blog.controller";
import { upload } from "../../middlewares/upload";

const router = Router();

router.get("/", getBlogSection);
router.get("/articles/:slug", getPublishedArticle);
// IMPORTANT: Add your admin authentication middleware here before deploying.
router.put("/", updateBlogSection);
router.post("/image", upload.single("image"), uploadBlogImage);

export const blogRouter = router;
