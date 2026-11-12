import { Metadata } from "next";
import BlogDetails from "./components/BlogDetails";

export const metadata: Metadata = {
  title: "Insights",
  description: "Welcome to my website",
};

const BlogDetailsPage = () => {
  return (
    <>
      <BlogDetails />
    </>
  );
};

export default BlogDetailsPage;
