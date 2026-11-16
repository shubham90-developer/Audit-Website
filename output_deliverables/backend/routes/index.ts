import { Router } from "express";

import { adminAuthRouter } from "../modules/admin-auth/adminAuthRoute";
import { settingsRouter } from "../modules/settings/settingsRoute";
import { homeBnnerRouter } from "../modules/home-banner/bannerRoute";
import { partnershipRouter } from "../modules/partnership/partnershipRoute";
import { whatWeDoRouter } from "../modules/what-we-do/whatWeDoRoute";
import { whoWeServeRouter } from "../modules/who-we-serve/whoWeServeRoute";
import { numbersPresenceRouter } from "../modules/numbers-presence/numbersPresenceRoute";
import { howWeWorkRouter } from "../modules/how-we-work/howWeWorkRoute";
import { meetTheTeamRouter } from "../modules/meet-the-team/meetTheTeamRoute";
import { readyToWorkRouter } from "../modules/ready-to-work/readyToWorkRoute";
import { slidingTextRouter } from "../modules/sliding-text/slidingTextRoute";
import { whyUsRouter } from "../modules/why-us/whyUsRoute";
import { faqRouter } from "../modules/faq/faqRoute";
import { privacyRouter } from "../modules/privacy-policy/privacyRoute";
import { termsRouter } from "../modules/terms-and-conditions/termsRoute";
import { industriesRouter } from "../modules/industries/industriesRoute";
import { consultationRouter } from "../modules/book-consultation/consultationRoute";
import { teamRouter } from "../modules/team/teamRoute";
import { aboutUsRouter } from "../modules/about-us/aboutUsRoute";
import { servicesRoute } from "../modules/services/servicesRoute";
import { insightsRoute } from "../modules/insights/insightsRoute";
import { contactRoute } from "../modules/contact/contactRoute";

const router = Router();

const moduleRoutes = [
  {
    path: "/admin-auth",
    route: adminAuthRouter,
  },
  {
    path: "/settings",
    route: settingsRouter,
  },
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
    path: "/sliding-text",
    route: slidingTextRouter,
  },
  {
    path: "/why-us",
    route: whyUsRouter,
  },
  {
    path: "/faq",
    route: faqRouter,
  },
  {
    path: "/privacy-policy",
    route: privacyRouter,
  },
  {
    path: "/terms-and-conditions",
    route: termsRouter,
  },
  {
    path: "/industries",
    route: industriesRouter,
  },
  {
    path: "/book-consultation",
    route: consultationRouter,
  },
  {
    path: "/team",
    route: teamRouter,
  },
  {
    path: "/about-us",
    route: aboutUsRouter,
  },
  {
    path: "/services",
    route: servicesRoute,
  },
  {
    path: "/insights",
    route: insightsRoute,
  },
  {
    path: "/contact",
    route: contactRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
