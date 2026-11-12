import { Metadata } from "next";
import Blog from "./components/Blog";
import Breadcrumb from "../components/Breadcrumb";

export const metadata: Metadata = {
  title: "Insights",
  description: "Welcome to my website",
};

const BlogPage = () => {
  return (
    <>
      <Breadcrumb
        title="Insights & Resources"
        subtitle="Stay informed with expert insights, practical guidance, and the latest updates on accounting, tax, and business in the UAE."
        image="/img/banner/bg4.avif"
      />
      <Blog />
    </>
  );
};

export default BlogPage;
