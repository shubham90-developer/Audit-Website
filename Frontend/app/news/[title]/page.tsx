import { Suspense } from "react";
import { Metadata } from "next";
import BlogDetails from "./components/BlogDetails";

export const metadata: Metadata = {
  title: "Insight",
  description:
    "Read this insight from Ahmed Al Mazroei Chartered Accountants.",
};

// BlogDetails reads the [title] route param (the article slug) on the
// client, so it sits in its own Suspense boundary (required with cacheComponents).
const BlogDetailsPage = () => {
  return (
    <Suspense fallback={null}>
      <BlogDetails />
    </Suspense>
  );
};

export default BlogDetailsPage;
