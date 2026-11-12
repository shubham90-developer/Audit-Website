import Image from "next/image";
import { HiArrowUpRight, HiOutlineMapPin } from "react-icons/hi2";

/* ----------------------------- Content ----------------------------- */

const BG_IMAGE = "/img/banner/bg10.avif"; // skyline image
const LANDMARK = "/img/banner/uae-tower.avif"; // transparent PNG, pokes above the card
const TOP_FILL = "#ffffff"; // colour of the section above, so the curve blends in

const PLACE = "Ahmed Al Mazroei Chartered Accountants, Business Bay, Dubai";
const MAPS_LINK = `https://maps.app.goo.gl/5241Xhzk9dd5d72J8?g_st=ac`;
const MAP_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3631.4490442517467!2d54.3479391!3d24.469893499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5e670e0ac08b07%3A0xc96933a32fb07adc!2sAl%20Mazroei%20Auditing%20%26%20Accounting%20-%20Abu%20Dhabi!5e0!3m2!1shi!2sin!4v1793867244439!5m2!1shi!2sin`;

const ADDRESS = [
  "M-02, Building #19, Seashell Building, Medina St - Al Khalidiyah - W9 - Abu Dhabi",
];

/* ---------------------------- Component ----------------------------- */

const MapSection = () => {
  return (
    <section className="relative isolate -mt-px  bg-black px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-36 lg:pt-40">
      {/* background image + light green fade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url('${BG_IMAGE}')` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-[#3ddc6e]/45 via-[#3ddc6e]/15 to-black/90"
      />

      {/* top curve */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-10 w-full overflow-visible lg:h-14"
      >
        <path d="M0 0H1440V60Q720 -60 0 60Z" fill={TOP_FILL} />
        <path
          d="M0 60Q720 -60 1440 60"
          fill="none"
          stroke="#3ddc6e"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative mx-auto flex max-w-6xl flex-col rounded-3xl shadow-2xl lg:flex-row">
        {/* Left: details */}
        <div className="relative rounded-t-3xl border border-[#3ddc6e]/30 bg-linear-to-b from-[#0f1f15] to-[#07090a] p-6 pt-48 text-white sm:p-8 sm:pt-52 lg:w-[45%] lg:rounded-l-3xl lg:rounded-tr-none">
          <Image
            src={LANDMARK}
            alt=""
            width={200}
            height={300}
            className="absolute -top-10 left-6 h-56 w-auto sm:left-8"
          />

          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Start Your Business
            <br />
            in UAE <span className="text-[#3ddc6e]">Now</span>
          </h2>
          <span className="mt-5 block h-0.5 w-12 bg-[#3ddc6e]" />

          {/* address */}
          <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-6">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#3ddc6e]/40 bg-white/5 text-[#3ddc6e]">
              <HiOutlineMapPin className="h-4 w-4" aria-hidden="true" />
            </span>
            <address className="text-xs not-italic leading-6 text-white/80">
              {ADDRESS.map((line, i) => (
                <span
                  key={line}
                  className={`block ${i === 0 ? "text-white" : ""}`}
                >
                  {line}
                </span>
              ))}
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 font-semibold text-[#3ddc6e] hover:underline"
              >
                Open in Google Maps
                <HiArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </address>
          </div>
        </div>

        {/* Right: map */}
        <div className="relative h-80 overflow-hidden rounded-b-3xl border border-[#3ddc6e]/30 sm:h-96 lg:h-auto lg:flex-1 lg:rounded-b-none lg:rounded-r-3xl">
          <iframe
            src={MAP_EMBED}
            title={`Map: ${PLACE}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
          {/* fade from the dark panel into the map */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-[#07090a] to-transparent lg:inset-y-0 lg:right-auto lg:h-auto lg:w-20 lg:bg-linear-to-r"
          />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
