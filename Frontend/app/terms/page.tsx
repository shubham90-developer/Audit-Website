import { Metadata } from "next";
import Terms from "./components/Terms";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions that govern your use of our website, services, and business engagements with us.",
};

// The hero (Breadcrumb) is rendered inside <Terms /> so its title,
// description and image can come from the API.
const TermsPage = () => <Terms />;

export default TermsPage;
