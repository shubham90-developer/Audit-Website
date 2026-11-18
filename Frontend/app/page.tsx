import { Suspense } from "react";

import HomeBanner from "./pages/HomeBanner";
import Counter from "./about/components/Counter";
import WhatWeDo from "./pages/WhatWeDo";
import IndustriesWeServe from "./pages/IndustriesWeServe";
import HowWeWork from "./pages/HowWeWork";
import BookConsultation from "./pages/BookConsultation";
import Partnership from "./pages/Partnership";
import WhoWeServe from "./pages/WhoWeServe";
import IntroVideo from "./pages/IntroVideo";
import ReadyToWork from "./pages/ReadyToWork";
import SlidingText from "./pages/SlidingText";

const Page = () => {
  return (
    <>
      <Suspense fallback={null}>
        <HomeBanner />
      </Suspense>

      <Suspense fallback={null}>
        <Partnership />
      </Suspense>

      <WhatWeDo />
      <SlidingText />
      <WhoWeServe />
      <Counter />
      <HowWeWork />
      <IntroVideo />
      <ReadyToWork />
      <IndustriesWeServe />
      <BookConsultation />
    </>
  );
};

export default Page;
