import { Metadata } from "next";
import Faq from "./components/Faq";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Welcome to my website",
};

const FaqPage = () => {
  return <Faq />;
};

export default FaqPage;
