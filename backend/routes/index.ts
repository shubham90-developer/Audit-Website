import { Router } from "express";

import { homeBnnerRouter } from "../modules/home-banner/bannerRoute";
import { partnershipRouter } from "../modules/partnership/partnershipRoute";
import { whatWeDoRouter } from "../modules/what-we-do/whatWeDoRoute";
import { whoWeServeRouter } from "../modules/who-we-serve/whoWeServeRoute";
import { numbersPresenceRouter } from "../modules/numbers-presence/numbersPresenceRoute";
import { howWeWorkRouter } from "../modules/how-we-work/howWeWorkRoute";
import { meetTheTeamRouter } from "../modules/meet-the-team/meetTheTeamRoute";
import { readyToWorkRouter } from "../modules/ready-to-work/readyToWorkRoute";
import { industriesRouter } from "../modules/industries/industriesRoute";
import { aboutUsRouter } from "../modules/about-us/aboutUsRoute";
import { whoWeAreRouter } from "../modules/who-we-are/whoWeAreRoute";
import { ourStoryRouter } from "../modules/our-story/routes";
import { globalMarketsRouter } from "../modules/global-market/route";
import { leadershipRouter } from "../modules/leadership/route";
import { serviceRouter } from "../modules/services/route";
import { testimonialRouter } from "../modules/testimonial/testimonial.routes";

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
  {
    path: "/industries",
    route: industriesRouter,
  },
  {
    path: "/about-us",
    route: aboutUsRouter,
  },
  {
    path: "/who-we-are",
    route: whoWeAreRouter,
  },
  {
    path: "/our-story",
    route: ourStoryRouter,
  },
  {
    path: "/global-markets",
    route: globalMarketsRouter,
  },
  {
    path: "/leadership",
    route: leadershipRouter,
  },
  {
    path: "/services",
    route: serviceRouter,
  },
  {
    path: "/testimonials",
    route: testimonialRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
