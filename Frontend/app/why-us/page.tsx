import { Metadata } from "next";
import React from "react";
import WhyChooseUs from "./components/WhyChooseUs";

export const metadata: Metadata = {
  title: "Why Choose Us",
  description: "Welcome to my website",
};

const WhyUsPage = () => {
  return (
    <>
      <WhyChooseUs />
    </>
  );
};

export default WhyUsPage;
