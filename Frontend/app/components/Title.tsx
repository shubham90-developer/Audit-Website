import React from "react";

interface TitleTypes {
  title: string;
  colorTitle: string;
  subtitle: string;
  watermark: string;
  titleClassName?: string;
  colorTitleClassName?: string;
  subtitleClassName?: string;
  watermarkClassName?: string;
}

const Title = ({
  title,
  colorTitle,
  subtitle,
  watermark,
  titleClassName = "text-[#111]",
  colorTitleClassName = "text-[#00852B]",
  subtitleClassName = "text-[#111]/65",
  watermarkClassName = "text-[#00852B]/[0.06]",
}: TitleTypes) => {
  return (
    <div className="relative mx-auto mb-10 max-w-4xl px-4 text-center">
      {/* Watermark */}
      <h5
        className={`pointer-events-none absolute inset-x-0 -top-2 select-none text-4xl font-extrabold uppercase tracking-widest sm:-top-6 sm:text-6xl lg:text-7xl ${watermarkClassName}`}
      >
        {watermark}
      </h5>

      {/* Heading */}
      <h2
        className={`relative text-2xl font-extrabold leading-tight sm:text-3xl lg:text-6xl ${titleClassName}`}
      >
        {title} <span className={colorTitleClassName}>{colorTitle}</span>
      </h2>

      {/* Divider */}
      <div className="mx-auto my-4 flex h-1 w-20 overflow-hidden rounded-full">
        <span className="w-2/3 bg-[#00852B]" />
        <span className="w-1/3 bg-[#F20D18]" />
      </div>

      {/* Subtitle */}
      <p
        className={`relative mx-auto max-w-2xl text-sm leading-7 sm:text-base ${subtitleClassName}`}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default Title;
