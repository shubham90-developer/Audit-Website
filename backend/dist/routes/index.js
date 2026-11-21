"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bannerRoute_1 = require("../modules/home-banner/bannerRoute");
const partnershipRoute_1 = require("../modules/partnership/partnershipRoute");
const whatWeDoRoute_1 = require("../modules/what-we-do/whatWeDoRoute");
const whoWeServeRoute_1 = require("../modules/who-we-serve/whoWeServeRoute");
const numbersPresenceRoute_1 = require("../modules/numbers-presence/numbersPresenceRoute");
const howWeWorkRoute_1 = require("../modules/how-we-work/howWeWorkRoute");
const meetTheTeamRoute_1 = require("../modules/meet-the-team/meetTheTeamRoute");
const readyToWorkRoute_1 = require("../modules/ready-to-work/readyToWorkRoute");
const industriesRoute_1 = require("../modules/industries/industriesRoute");
const aboutUsRoute_1 = require("../modules/about-us/aboutUsRoute");
const whoWeAreRoute_1 = require("../modules/who-we-are/whoWeAreRoute");
const routes_1 = require("../modules/our-story/routes");
const route_1 = require("../modules/global-market/route");
const route_2 = require("../modules/leadership/route");
const route_3 = require("../modules/services/route");
const testimonial_routes_1 = require("../modules/testimonial/testimonial.routes");
const route_4 = require("../modules/faq-section/route");
const blog_routes_1 = require("../modules/blog/blog.routes");
const enquiry_routes_1 = require("../modules/enquiries/enquiry.routes");
const route_5 = require("../modules/contact-content/route");
const legal_routes_1 = require("../modules/P&T/legal.routes");
const route_6 = require("../modules/settings/route");
const admin_routes_1 = require("../modules/admin-auth/admin.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    { path: "/admin-auth", route: admin_routes_1.adminAuthRouter },
    {
        path: "/banners",
        route: bannerRoute_1.homeBnnerRouter,
    },
    {
        path: "/partners",
        route: partnershipRoute_1.partnershipRouter,
    },
    {
        path: "/what-we-do",
        route: whatWeDoRoute_1.whatWeDoRouter,
    },
    {
        path: "/who-we-serve",
        route: whoWeServeRoute_1.whoWeServeRouter,
    },
    {
        path: "/numbers-presence",
        route: numbersPresenceRoute_1.numbersPresenceRouter,
    },
    {
        path: "/how-we-work",
        route: howWeWorkRoute_1.howWeWorkRouter,
    },
    {
        path: "/meet-the-team",
        route: meetTheTeamRoute_1.meetTheTeamRouter,
    },
    {
        path: "/ready-to-work",
        route: readyToWorkRoute_1.readyToWorkRouter,
    },
    {
        path: "/industries",
        route: industriesRoute_1.industriesRouter,
    },
    {
        path: "/about-us",
        route: aboutUsRoute_1.aboutUsRouter,
    },
    {
        path: "/who-we-are",
        route: whoWeAreRoute_1.whoWeAreRouter,
    },
    {
        path: "/our-story",
        route: routes_1.ourStoryRouter,
    },
    {
        path: "/global-markets",
        route: route_1.globalMarketsRouter,
    },
    {
        path: "/leadership",
        route: route_2.leadershipRouter,
    },
    {
        path: "/services",
        route: route_3.serviceRouter,
    },
    {
        path: "/testimonials",
        route: testimonial_routes_1.testimonialRouter,
    },
    {
        path: "/faq",
        route: route_4.faqSectionRouter,
    },
    {
        path: "/blog",
        route: blog_routes_1.blogRouter,
    },
    {
        path: "/enquiries",
        route: enquiry_routes_1.enquiryRouter,
    },
    {
        path: "/contact-content",
        route: route_5.contactContentRouter,
    },
    {
        path: "/legal-pages",
        route: legal_routes_1.legalPageRouter,
    },
    {
        path: "/settings",
        route: route_6.siteSettingsRouter,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
