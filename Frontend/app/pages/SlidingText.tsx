/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

const Strip = ({ text, outline = false, direction = "left" }: any) => (
  <div className="marquee flex overflow-hidden select-none">
    {[0, 1].map((copy) => (
      <div
        key={copy}
        aria-hidden={copy === 1}
        className={`flex shrink-0 ${
          direction === "left" ? "marquee-left" : "marquee-right"
        }`}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <span
            key={i}
            className={`flex items-center gap-8 pr-8 text-6xl font-black uppercase leading-tight whitespace-nowrap sm:text-8xl ${
              outline
                ? "text-transparent [-webkit-text-stroke:2px_#27c25a]"
                : "text-black"
            }`}
          >
            {text}
            <span className="h-3 w-3 rounded-full bg-[#27c25a]" />
          </span>
        ))}
      </div>
    ))}
  </div>
);

const SlidingText = () => (
  <section className=" py-10">
    <Strip text="Accounting · Tax · Audit" direction="left" />
    <Strip text="Accounting · Tax · Audit" direction="right" outline />
  </section>
);

export default SlidingText;
