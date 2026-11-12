import ThemeBtn from "@/app/components/ThemeBtn";
import Image from "next/image";
import { BsBarChartFill, BsBuilding, BsStarFill } from "react-icons/bs";
import { FaGoogle } from "react-icons/fa";

const BG_IMAGE = "/img/banner/3.jpg";

const stats = [
  { icon: <BsBuilding />, value: "25+", label: "Years of Experience" },
  { icon: <BsBarChartFill />, value: "1,000+", label: "Clients Served" },
  {
    icon: <BsStarFill className="text-[#00B67A]" />,
    value: "4.8/5",
    label: "from 75+ Trustpilot Reviews",
  },
  {
    icon: <FaGoogle className="text-[#4285F4]" />,
    value: "4.8/5",
    label: "Across 200+ Google Reviews",
  },
];

export default function AboutHero() {
  return (
    <section className="relative isolate bg-[#111] py-16 text-white lg:py-24">
      {/* Background image + gradient overlay (keeps text readable) */}
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[#111]/85 lg:bg-linear-to-r lg:from-[#111]/95 lg:via-[#111]/80 lg:to-[#111]/40" />

      <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-8 lg:px-10">
        {/* Text + photo */}
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              <span className="text-[#3ddc6e]">Trusted Auditors</span>
              <br />
              and Business Advisors in the UAE
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-white/90">
              Ahmed Al Mazroei Auditing &amp; Accounting is an Emirati-owned
              firm in Abu Dhabi. We handle audit, accounting and tax for
              businesses across the UAE.
            </p>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              We are an FTA-approved tax agency, which means we deal with the
              Federal Tax Authority on your behalf rather than leaving you
              paperwork to file yourself.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <ThemeBtn>Book Free 20-Min Call</ThemeBtn>
              <ThemeBtn>Meet the Team</ThemeBtn>
            </div>

            <p className="mt-6 flex items-center gap-3 text-sm text-white/70">
              <span className="h-px w-16 bg-linear-to-r from-[#3ddc6e] to-transparent" />
              Speak Directly with an Expert
            </p>
          </div>

          <div className="relative h-72 overflow-hidden rounded-2xl border border-[#3ddc6e]/30 sm:h-96 lg:h-115">
            <Image
              src="/img/about/2.jpg"
              alt="Our audit and accounting team"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Stats: transparent glass cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(({ icon, value, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-3 rounded-2xl border border-[#3ddc6e]/40 bg-white/10 px-3 py-5 shadow-sm backdrop-blur-md transition-colors duration-300 hover:border-[#3ddc6e] hover:bg-white/15 sm:gap-4 sm:px-4 sm:py-6"
            >
              <span className="shrink-0 text-3xl text-[#3ddc6e] sm:text-4xl">
                {icon}
              </span>
              <div>
                <p className="text-xl font-bold leading-none sm:text-2xl">
                  {value}
                </p>
                <p className="mt-1 text-xs text-white/75">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
