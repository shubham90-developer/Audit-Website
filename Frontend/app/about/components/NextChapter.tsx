import { Mrs_Saint_Delafield } from "next/font/google";
import Image from "next/image";

/* ----------------------------- Content ----------------------------- */
const script = Mrs_Saint_Delafield({ subsets: ["latin"], weight: "400" });

const BG_IMAGE = "/img/banner/bg10.avif"; // skyline + world map image
const TOP_FILL = "#fffaf1"; // same colour as the OurStory section above, so there is no gap
const GOLD = "#3ddc6e";

const COUNTRIES = [
  { name: "UAE", image: "/img/about/1.avif" },
  {
    name: "Canada",
    image: "/img/about/2.avif",
  },
  { name: "USA", image: "/img/about/3.avif" },
  {
    name: "Panama",
    image: "/img/about/4.avif",
  },
];

/* ---------------------------- Component ----------------------------- */

const NextChapter = () => {
  return (
    <section className="relative isolate -mt-px bg-black pb-16 pt-24 text-white lg:pt-28">
      {/* background image + dark overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url('${BG_IMAGE}')` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-black/40 via-black/60 to-black/90"
      />
      {/* top fade: blends the image into the section above */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-24"
        style={{ background: `linear-gradient(${TOP_FILL}, transparent)` }}
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
          stroke={GOLD}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative mx-auto max-w-6xl px-6">
        {/* tagline */}
        <p
          className={`absolute right-6 top-0 hidden -rotate-6 text-right ${script.className} text-7xl leading-tight font-extrabold text-[#3ddc6e] lg:block`}
        >
          From Business Bay
          <br />
          to the World
          <span className="mt-1 block h-px w-full bg-[#3ddc6e]" />
        </p>

        {/* heading */}
        <div className="mb-3 flex items-center gap-3">
          <span className="hidden h-px w-10 bg-[#3ddc6e] sm:block" />
          <span className="rounded-full border border-[#3ddc6e] bg-black/40 px-5 py-1.5 text-sm font-extrabold tracking-[0.2em] text-[#3ddc6e]">
            THE NEXT CHAPTER
          </span>
          <span className="hidden h-px w-10 bg-[#3ddc6e] sm:block" />
        </div>

        <h2 className="max-w-xl text-3xl font-bold leading-tight sm:text-4xl">
          And the Story Expanded Across{" "}
          <span className="text-[#3ddc6e]">Four Global Markets</span>
        </h2>

        <p className="mt-5 max-w-md text-md leading-6 text-white/90">
          What started in Business Bay grew into offices and an active presence
          across Dubai, Mississauga, the USA and Panama, helping businesses go
          further, wherever they are.
        </p>

        {/* country cards */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:ml-40 lg:w-fit">
          {COUNTRIES.map(({ name, image }) => (
            <div
              key={name}
              className="relative h-40 overflow-hidden rounded-xl border border-[#3ddc6e] bg-black lg:w-40"
            >
              <Image
                src={image}
                alt={name}
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0b1230] via-transparent to-transparent" />

              <p className="absolute inset-x-0 bottom-2 text-center text-sm font-semibold">
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NextChapter;
