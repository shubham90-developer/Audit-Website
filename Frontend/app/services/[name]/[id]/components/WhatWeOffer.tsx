import Image from "next/image";
import Link from "next/link";

const BG_IMAGE = "/img/banner/bg2.avif";

interface Offer {
  slug: string;
  name: string;
  text: string;
  image: string;
}

const offers: Offer[] = [
  {
    slug: "bookkeeping-accounting",
    name: "Bookkeeping & Accounting",
    text: "Maintain accurate financial records, track transactions, and keep your accounts organized.",
    image: "/img/banner/1.jpg",
  },
  {
    slug: "financial-reporting",
    name: "Financial Reporting",
    text: "Get clear financial reports and insights to support better business decisions.",
    image: "/img/banner/2.jpg",
  },
  {
    slug: "payroll-documentation",
    name: "Payroll & Documentation",
    text: "Simplify payroll processing and keep essential financial documentation up to date.",
    image: "/img/banner/3.jpg",
  },
  {
    slug: "compliance-support",
    name: "Compliance Support",
    text: "Stay organized with professional support for financial reporting and compliance requirements.",
    image: "/img/banner/2.jpg",
  },
];

const WhatWeOffer = () => {
  return (
    <section className="relative isolate bg-[#0d100e] pb-16 sm:pb-20 lg:pb-24">
      {/* light strip at the top so the big word overlaps both light and dark */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-16 bg-white sm:h-20 lg:h-24"
      />

      {/* dark background image */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 top-16 -z-30 bg-cover bg-center opacity-40 sm:top-20 lg:top-24"
        style={{ backgroundImage: `url('${BG_IMAGE}')` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 top-16 -z-20 bg-linear-to-b from-[#0d100e]/80 via-[#0d100e]/90 to-[#0d100ecc] sm:top-20 lg:top-24"
      />
      {/* green glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-40 -z-10 h-96 w-160 -translate-x-1/2 rounded-full blur-[130px]"
        style={{ background: "rgba(61,220,110,0.12)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* big image-filled word */}
        <p
          aria-hidden="true"
          className="select-none whitespace-nowrap bg-cover bg-center bg-clip-text text-center text-[clamp(2rem,6vw,10rem)] font-black uppercase leading-[0.9] tracking-tight text-transparent"
          style={{
            backgroundImage: `url('${BG_IMAGE}')`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.25))",
          }}
        >
          Ahmed Al Mazroei
        </p>

        {/* heading */}
        <div className="mx-auto mt-8 max-w-3xl text-center sm:mt-10">
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            What We Offer
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
            Services designed around your needs
          </p>
        </div>

        {/* cards */}
        <ul className="mt-12 flex flex-wrap justify-center gap-6">
          {offers.map((offer, index) => (
            <li
              key={offer.slug}
              className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <Link
                href={`/services/${offer.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-linear-to-b from-[#16191a] to-[#0f1211] shadow-[0_10px_40px_-18px_rgba(0,0,0,0.8)] transition duration-300 hover:-translate-y-1.5 hover:border-[#3ddc6e]/60 hover:shadow-[0_28px_60px_-20px_rgba(61,220,110,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ddc6e]"
              >
                {/* image */}
                <div className="relative aspect-16/10 overflow-hidden">
                  <Image
                    src={offer.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-linear-to-t from-[#0f1211] via-transparent to-black/20"
                  />
                  <span className="absolute left-4 top-3 text-sm font-bold tracking-wider text-[#3ddc6e]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* body */}
                <div className="flex flex-1 flex-col p-5 pt-6 sm:p-6 sm:pt-7">
                  <h3 className="text-lg font-bold tracking-tight text-white">
                    {offer.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-0.5 w-8 rounded-full bg-[#3ddc6e] transition-all duration-300 group-hover:w-14"
                  />
                  <p className="mt-4 text-sm leading-7 text-white/70">
                    {offer.text}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WhatWeOffer;
