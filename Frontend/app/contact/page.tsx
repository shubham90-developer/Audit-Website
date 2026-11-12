import { Metadata } from "next";
import Contact from "./components/Contact";
import TopBanner from "./components/TopBanner";
import MapSection from "./components/MapSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Welcome to my website",
};

const ContactPage = () => {
  return (
    <>
      <TopBanner />
      <Contact />
      <MapSection />
    </>
  );
};

export default ContactPage;
