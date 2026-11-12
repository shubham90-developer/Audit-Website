import Image from "next/image";
import type { IconType } from "react-icons";
import {
  FiBookOpen,
  FiClock,
  FiMessageSquare,
  FiMonitor,
  FiShield,
  FiUsers,
} from "react-icons/fi";

type Item = { title: string; text: string; Icon: IconType };

const left: Item[] = [
  {
    title: "Experience Since 2000",
    text: "More than 25 years serving UAE businesses of every size.",
    Icon: FiBookOpen,
  },
  {
    title: "Emirati-Owned",
    text: "A local firm that understands UAE laws, authorities and business culture.",
    Icon: FiUsers,
  },
  {
    title: "Senior-Level Attention",
    text: "Experienced professionals lead every assignment from start to finish.",
    Icon: FiClock,
  },
];

const right: Item[] = [
  {
    title: "Independent & Objective",
    text: "Honest opinions you can rely on, with no conflict of interest.",
    Icon: FiShield,
  },
  {
    title: "Clear, Fixed Fees",
    text: "Agreed upfront in writing. No surprises.",
    Icon: FiMonitor,
  },
  {
    title: "Customized Advice",
    text: "How all this mistaken idea of denouncing pleasure",
    Icon: FiMessageSquare,
  },
];

const Card = ({
  title,
  text,
  Icon,
  side,
  shift,
}: Item & { side: "left" | "right"; shift?: boolean }) => {
  const isLeft = side === "left";
  return (
    <div
      className={`relative w-full rounded-2xl border border-slate-200 bg-white py-6 ${
        isLeft ? "pl-6 pr-16" : "pl-16 pr-6"
      } ${shift ? (isLeft ? "lg:-translate-x-10" : "lg:translate-x-10") : ""}`}
    >
      <span
        className={`absolute -top-4 flex h-20 w-14 items-center justify-center bg-orange-500/90 text-2xl text-white ${
          isLeft
            ? "-right-3 rounded-bl-3xl rounded-tr-xl lg:-right-7"
            : "-left-3 rounded-br-3xl rounded-tl-xl lg:-left-7"
        }`}
      >
        <Icon aria-hidden="true" />
      </span>
      <h3 className="text-lg font-bold text-slate-800 sm:text-xl">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
};

const WhyChooseUs = () => {
  return (
    <section className="relative w-full  bg-white py-12 sm:py-16 lg:py-20">
      {/* Big faint background text */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden select-none text-center text-[9rem] font-extrabold uppercase leading-[0.9] text-slate-100/70 lg:block xl:text-[11rem]"
      >
        Why
        <br />
        Choose Us
      </p>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section label */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 bg-linear-to-br from-slate-300 to-transparent [clip-path:polygon(0_0,100%_0,0_100%)]"
            />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#150040] sm:text-sm">
              Why Choose Us
            </span>
          </div>

          <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-[1.2] tracking-tight text-slate-800 sm:text-4xl lg:mt-5 xl:text-5xl">
            What Makes Us Different
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:mt-20 lg:grid-cols-[1fr_376px_1fr] lg:gap-6 xl:gap-10">
          {/* Center image */}
          <div className="relative mx-auto aspect-square w-64 overflow-hidden rounded-full sm:w-80 lg:order-2 lg:w-full">
            <Image
              src="/img/banner/10.jpg"
              alt="Our consultants"
              fill
              sizes="(max-width: 1024px) 320px, 376px"
              className="object-cover grayscale"
            />
            <span className="absolute inset-0 bg-slate-700/30" />
          </div>

          {/* Left cards */}
          <div className="grid grid-cols-1 gap-10 pr-3 sm:grid-cols-2 sm:gap-x-10 lg:order-1 lg:flex lg:flex-col lg:pr-0 lg:gap-10">
            {left.map((it, i) => (
              <Card key={it.title} {...it} side="left" shift={i === 1} />
            ))}
          </div>

          {/* Right cards */}
          <div className="grid grid-cols-1 gap-10 pl-3 sm:grid-cols-2 sm:gap-x-10 lg:order-3 lg:flex lg:flex-col lg:pl-0 lg:gap-10">
            {right.map((it, i) => (
              <Card key={it.title} {...it} side="right" shift={i === 1} />
            ))}
          </div>
        </div>

        {/* spacer so the background text shows under the cards on desktop */}
        <div className="hidden h-24 lg:block" />
      </div>
    </section>
  );
};

export default WhyChooseUs;
