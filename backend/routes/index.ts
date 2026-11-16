import { Router } from "express";

import { homeBnnerRouter } from "../modules/home-banner/bannerRoute";
import { partnershipRouter } from "../modules/partnership/partnershipRoute";
import { whatWeDoRouter } from "../modules/what-we-do/whatWeDoRoute";
import { whoWeServeRouter } from "../modules/who-we-serve/whoWeServeRoute";
import { numbersPresenceRouter } from "../modules/numbers-presence/numbersPresenceRoute";
import { howWeWorkRouter } from "../modules/how-we-work/howWeWorkRoute";
import { meetTheTeamRouter } from "../modules/meet-the-team/meetTheTeamRoute";
import { readyToWorkRouter } from "../modules/ready-to-work/readyToWorkRoute";

const router = Router();

const moduleRoutes = [
  {
    path: "/banners",
    route: homeBnnerRouter,
  },
  {
    path: "/partners",
    route: partnershipRouter,
  },
  {
    path: "/what-we-do",
    route: whatWeDoRouter,
  },
  {
    path: "/who-we-serve",
    route: whoWeServeRouter,
  },
  {
    path: "/numbers-presence",
    route: numbersPresenceRouter,
  },
  {
    path: "/how-we-work",
    route: howWeWorkRouter,
  },
  {
    path: "/meet-the-team",
    route: meetTheTeamRouter,
  },
  {
    path: "/ready-to-work",
    route: readyToWorkRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
