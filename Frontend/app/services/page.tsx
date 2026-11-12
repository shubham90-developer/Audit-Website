import { Metadata } from "next";
import React from "react";
import Services from "./components/Services";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Services",
  description: "Welcome to my website",
};

const ServicesPage = () => {
  return (
    <>
      <Breadcrumb
        title="Professional Accounting,
Tax & Business Services"
        subtitle="Tax, accounting, audit and company formation under one roof, across borders. Six groups, one senior team, and the same people from the first call to the filing."
        image="/img/banner/bg2.avif"
      />
      <Services />
    </>
  );
};

export default ServicesPage;
