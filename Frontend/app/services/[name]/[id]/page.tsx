import { Suspense } from "react";
import { Metadata } from "next";
import ServicesDetails from "./components/ServicesDetails";
import WhatWeOffer from "./components/WhatWeOffer";
import Testimonials from "./components/Testimonilas";

export const metadata: Metadata = {
  title: "Services Details",
  description: "Welcome to my website",
};

// The client components below read the [id] route param, so each one
// sits in its own Suspense boundary (required with cacheComponents).
const ServicesDetailsPage = () => {
  return (
    <>
      <Suspense fallback={null}>
        <ServicesDetails />
      </Suspense>

      <Suspense fallback={null}>
        <WhatWeOffer />
      </Suspense>

      <Testimonials />
    </>
  );
};

export default ServicesDetailsPage;
