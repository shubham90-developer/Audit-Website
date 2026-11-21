import { Metadata } from "next";
import Blog from "./components/Blog";
import NewsHeader from "./components/NewsHeader";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Expert insights, practical guidance and the latest updates on accounting, tax and business in the UAE.",
};

const NewsPage = () => {
  return (
    <>
      <NewsHeader />
      <Blog />
    </>
  );
};

export default NewsPage;
