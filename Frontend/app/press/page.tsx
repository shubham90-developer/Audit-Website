import { Metadata } from "next";
import Blog from "./components/Blog";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Press Releases",
  description: "Welcome to my website",
};

const PressPage = () => {
  return (
    <>
      <Breadcrumb
        title="Press Releases"
        subtitle="Stay informed with Ahmed Al Mazroei Chartered Accountants’ press releases, news announcements, and updates on UAE business and tax regulations."
        image="/img/banner/blog-bg.avif"
      />
      <Blog />
    </>
  );
};

export default PressPage;
