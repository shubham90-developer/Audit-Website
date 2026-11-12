import { Router } from "express";

import { homeBnnerRouter } from "../modules/home-banner/bannerRoute";

const router = Router();

const moduleRoutes = [
  {
    path: "/banners",
    route: homeBnnerRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
