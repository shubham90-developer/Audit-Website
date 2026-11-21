import { Metadata } from "next";
import Privacy from "./components/Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how we collect, use, protect, and manage your personal information when you visit our website or use our services.",
};

// The hero (Breadcrumb) is rendered inside <Privacy /> so its title,
// description and image can come from the API.
const PrivacyPage = () => <Privacy />;

export default PrivacyPage;
