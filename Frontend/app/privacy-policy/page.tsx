import { Metadata } from "next";
import Privacy from "./components/Privacy";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "My Website",
  description: "Welcome to my website",
};

const PrivacyPage = () => {
  return (
    <>
      <Breadcrumb
        title="Privacy Policy"
        subtitle="Learn how we collect, use, protect, and manage your personal information when you visit our website or use our services."
        image="/img/banner/bg2.avif"
      />
      <Privacy />
    </>
  );
};

export default PrivacyPage;
