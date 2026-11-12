import { Metadata } from "next";
import Faq from "./components/Faq";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Welcome to my website",
};

const FaqPage = () => {
  return (
    <>
      <Breadcrumb
        title="Frequently Asked Questions"
        subtitle="Clear answers on company setup, corporate tax, VAT, accounting, audit and visas in Dubai and the UAE, from an FTA registered tax agency."
        image="/img/banner/bg2.avif"
      />
      <Faq />
    </>
  );
};

export default FaqPage;
