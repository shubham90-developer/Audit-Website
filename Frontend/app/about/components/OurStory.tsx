import Image from "next/image";
import React from "react";

const steps = [
  {
    title: "It Started With the Numbers",
    text: "Ahmed Al Mazroeibegan as an accounting and tax firm, helping businesses manage bookkeeping, financial reporting, tax filings and regulatory compliance.",
    icon: "/img/banner/1.jpg",
  },
  {
    title: "Then the Questions Got Bigger",
    text: "As our clients’ businesses grew, their questions expanded beyond the numbers to company formation, business structuring, new regulations and entering new markets.",
    icon: "/img/banner/1.jpg",
  },
  {
    title: "Clients Needed More Than Accounting",
    text: "Operating across different countries required support in accounting, tax, audit, corporate advisory and business setup. Working with separate providers often resulted in disconnected processes and slower decisions.",
    icon: "/img/banner/1.jpg",
  },
  {
    title: "So We Built One Integrated Team",
    text: "To meet these growing needs, we expanded our team, our expertise and our presence across different countries. This development enabled Ahmed Al Mazroeito provide coordinated cross-border services through one integrated firm.",
    icon: "/img/banner/1.jpg",
  },
];

const OurStory = () => {
  return (
    <section className="relative bg-[#fffaf1] py-16">
      {/* Full-width background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/img/banner/bg9.avif')" }}
      />
      {/* Top fade */}
      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-[#fdfbf8] to-transparent" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: heading + timeline */}
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="hidden h-px w-10 bg-[#3ddc6e] sm:block" />
            <span className="rounded-full border border-[#3ddc6e] bg-white px-5 py-1.5 text-sm font-extrabold tracking-[0.2em] text-[#3ddc6e]">
              OUR STORY
            </span>
            <span className="hidden h-px w-10 bg-[#3ddc6e] sm:block" />
          </div>

          <p className="mb-6 max-w-2xl leading-relaxed text-gray-900">
            The firm was founded in 2000 by Mr. Ahmed Al Mazroei with one goal:
            to give UAE businesses honest, high-quality audit services from a
            local firm they can trust. What started as an audit practice has
            grown into a full-service firm covering audit, tax, advisory and
            consulting. After more than 25 years, our values remain the same:
            integrity, quality and personal service.
          </p>

          <ul className="space-y-3">
            {steps.map((step, i) => (
              <li key={step.title} className="relative flex items-center gap-4">
                <Image
                  src={step.icon}
                  alt="icon"
                  width={100}
                  height={100}
                  className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-[#3ddc6e] ring-offset-2 ring-offset-white"
                />

                <div className="flex-1 rounded-xl border border-[#3ddc6e]/30 bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg font-semibold text-[#3ddc6e]">
                      0{i + 1}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-1 pl-9 text-xs leading-relaxed text-gray-600">
                    {step.text}
                  </p>
                </div>

                {i < steps.length - 1 && (
                  <span className="absolute -bottom-2.5 left-8 h-1 w-1 rounded-full bg-[#3ddc6e]" />
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: quote card */}
        <figure className="rounded-2xl border border-[#3ddc6e]/70 bg-neutral-700/80 p-8 text-white shadow-xl backdrop-blur-md">
          <span className="text-4xl font-black leading-none text-[#3ddc6e]">
            “
          </span>
          <blockquote className="mt-2 text-lg italic leading-relaxed">
            Our growth has never been about adding services for the sake of
            looking bigger. We add expertise when it solves a real problem for
            our clients.
          </blockquote>

          <div className="my-5 h-px w-12 bg-[#3ddc6e]/60" />

          <figcaption className="flex items-center gap-3">
            <Image
              src="/img/banner/1.jpg"
              alt="Mr. Ahmed Al Mazroei"
              width={100}
              height={100}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-[#3ddc6e]"
            />
            <div>
              <p className="text-xs font-bold">Mr. Ahmed Al Mazroei, UAE-CA.</p>
              <p className="text-xs text-gray-300">
                Director of Accounting and Taxation
              </p>
            </div>
          </figcaption>
        </figure>
      </div>
      {/* Bottom fade: ends in the same colour as the NextChapter curve */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#fffaf1] to-transparent" />
    </section>
  );
};

export default OurStory;
