import { Metadata } from "next";
import ServicesDetails from "./components/ServicesDetails";
import WhatWeOffer from "./components/WhatWeOffer";
import Testimonilas from "./components/Testimonilas";

export const metadata: Metadata = {
  title: "Services Details",
  description: "Welcome to my website",
};

const ServicesDetailsPage = () => {
  return (
    <>
      <ServicesDetails />
      <WhatWeOffer />
      <Testimonilas />
    </>
  );
};

export default ServicesDetailsPage;
