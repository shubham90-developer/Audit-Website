import { Metadata } from "next";
import Terms from "./components/Terms";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Welcome to my website",
};

const TermsPage = () => {
  return (
    <>
      <Breadcrumb
        title="Terms & Conditions"
        subtitle="Review the terms and conditions that govern your use of our website, services, and business engagements with us."
        image="/img/banner/bg2.avif"
      />
      <Terms />
    </>
  );
};

export default TermsPage;
