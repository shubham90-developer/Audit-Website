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
import { faqSectionRouter } from "../modules/faq-section/route";
import { blogRouter } from "../modules/blog/blog.routes";
import { enquiryRouter } from "../modules/enquiries/enquiry.routes";
import { contactContentRouter } from "../modules/contact-content/route";
import { legalPageRouter } from "../modules/P&T/legal.routes";
import { siteSettingsRouter } from "../modules/settings/route";

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
  {
    path: "/faq",
    route: faqSectionRouter,
  },
  {
    path: "/blog",
    route: blogRouter,
  },
  {
    path: "/enquiries",
    route: enquiryRouter,
  },
  {
    path: "/contact-content",
    route: contactContentRouter,
  },
  {
    path: "/legal-pages",
    route: legalPageRouter,
  },
  {
    path: "/settings",
    route: siteSettingsRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
