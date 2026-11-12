import { Metadata } from "next";
import AboutUs from "./components/AboutUs";
import WhoWeAre from "./components/WhoWeAre";
import OurStory from "./components/OurStory";
import NextChapter from "./components/NextChapter";
import LeadeshipTeam from "./components/LeadeshipTeam";
import Team from "./components/Team";

export const metadata: Metadata = {
  title: "About Us",
  description: "Welcome to my website",
};

const BG_IMAGE = "/img/banner/bg1.avif";

const AboutPage = () => {
  return (
    <>
      <AboutUs />
      <WhoWeAre />
      <OurStory />
      <NextChapter />
      <section className="relative  bg-white py-12 sm:py-16">
        {/* background image + white wash + top/bottom fades */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${BG_IMAGE}')` }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-white/60" />
        <LeadeshipTeam />
        <Team />
      </section>
    </>
  );
};

export default AboutPage;
