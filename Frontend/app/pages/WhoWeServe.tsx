import Image from "next/image";
import React from "react";

/* ----------------------------- Content ----------------------------- */

const BRAND = "Ahmed Al Mazroei"; // screenshot shows "Ahmed Al Mazroei"

const LEFT_BG = "/img/banner/bg3.avif"; // image inside pointer panel

const SERVE_ITEMS = [
  {
    icon: "/img/banner/1.jpg",
    title: "Multinational Groups",
    text: "Transfer pricing documentation, consolidated group reporting and treaty positions. IFRS output your auditors accept without rework.",
  },
  {
    icon: "/img/banner/1.jpg",
    title: "Business Setup & New Entrants",
    text: "Mainland or free zone, chosen on the tax outcome and not the licence price. Formation, visas, banking and your first filings.",
  },
  {
    icon: "/img/banner/1.jpg",
    title: "Free Zone & QFZP",
    text: "Whether you qualify for the 0% free zone rate, and what it takes to keep it. Income tested, substance documented and de minimis monitored.",
  },
  {
    icon: "/img/banner/1.jpg",
    title: "Individuals & Expats",
    text: "Tax residency, TRC applications, wills registration and personal exposure across more than one jurisdiction. Filed with your company.",
  },
];

const WHY_ITEMS = [
  {
    icon: "/img/icons/5.avif",
    title: "FTA Registered Tax Agency",
    text: "FTA Approved Tax Agency No. 30008692. If the authority raises a query or opens a tax audit, we represent you before them. You do not face the FTA alone.",
  },
  {
    icon: "/img/icons/6.avif",
    title: "Approved Auditors",
    text: "Audit reports issued through our network of approved auditors, accepted by every UAE free zone authority, mainland licensing body and bank. We prepare the file, so the numbers already agree.",
  },
];

/* ------------------------ Connecting lines -------------------------- */

const CARD_CENTERS = [150, 450, 750, 1050];
const BADGE_X = 600;
const SVG_H = 120;

const linePath = (x: number) =>
  `M ${BADGE_X} 0 C ${BADGE_X} 70, ${x} 50, ${x} ${SVG_H}`;

// Lines only show at `xl`, where the 4 cards sit in one row.
const ConnectingLines = () => (
  <svg
    viewBox={`0 0 1200 ${SVG_H}`}
    aria-hidden="true"
    className="mx-auto hidden w-full max-w-6xl xl:block"
  >
    {CARD_CENTERS.map((x, i) => (
      <g key={x}>
        <path
          id={`wws-path-${i}`}
          d={linePath(x)}
          className="fill-none stroke-[#fab923] opacity-60"
          strokeWidth="1.5"
        />
        <circle
          r="4"
          className="fill-[#fab923] drop-shadow-[0_0_4px_#fab923] motion-reduce:hidden"
        >
          <animateMotion
            dur="2.6s"
            begin={`${i * 0.45}s`}
            repeatCount="indefinite"
          >
            <mpath href={`#wws-path-${i}`} />
          </animateMotion>
        </circle>
      </g>
    ))}
  </svg>
);

/* ---------------------------- Component ----------------------------- */

const WhoWeServe = () => {
  return (
    <section className="relative isolate grid grid-cols-1 text-[#2b2620] lg:mt-10 lg:grid-cols-[1.4fr_1fr] xl:grid-cols-[1.8fr_1fr]">
      {/* LEFT */}
      <div className="relative px-4 py-10 sm:px-8 md:pb-20 lg:py-12 lg:pb-24 lg:pl-14 lg:pr-12">
        {/* pointer-shaped image, top part only */}
        <div
          className="absolute inset-x-0 top-0 h-84 bg-cover bg-top lg:[clip-path:polygon(0_0,94%_0,100%_50%,94%_100%,0_100%)]"
          style={{ backgroundImage: `url('${LEFT_BG}')` }}
        >
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative">
          <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-[#fab923]/40 bg-[#14100a] px-6 py-2 text-base font-bold uppercase tracking-[0.12em] text-white shadow-lg sm:px-10 sm:py-2.5 sm:text-2xl">
            <span className="h-px w-8 bg-[#00852B]" />
            <span>
              Who We <span className="text-[#00852B]">Serve</span>
            </span>
            <span className="h-px w-8 bg-[#00852B]" />
          </div>

          <ConnectingLines />

          <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-x-4 gap-y-20 min-[480px]:grid-cols-2 xl:mt-0 xl:grid-cols-4 xl:gap-x-0">
            {SERVE_ITEMS.map((item, i) => (
              <article
                key={item.title}
                className="relative rounded-3xl border border-[#f3d9a4] bg-linear-to-b from-white to-[#d9f1e1] px-4 pb-6 pt-14 text-center shadow-lg xl:mx-2"
              >
                <div className="absolute -top-12 left-1/2 size-24 -translate-x-1/2 overflow-hidden rounded-full border-[3px] border-[#00852B] bg-[#14100a] shadow-md">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={160}
                    height={160}
                    quality={100}
                    sizes="96px"
                    className="size-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-[#00852B]">
                  0{i + 1}
                </span>
                <h3 className="mt-1 text-base font-semibold leading-snug">
                  {item.title}
                </h3>
                <hr className="mx-auto my-3 w-8 border-t-2 border-[#00852B]" />
                <p className="text-sm leading-relaxed text-[#5b534a]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <aside className="relative px-4 py-10 sm:px-8 md:pb-20 lg:py-12 lg:pb-24 lg:pl-12 lg:pr-10">
        <h2 className="mb-3 text-2xl font-bold leading-tight sm:text-3xl">
          Why Businesses Choose <span className="text-[#00852B]">{BRAND}</span>
        </h2>
        <p className="mb-6 text-justify text-base leading-relaxed">
          We are one of the <strong>chartered accountant firms in Dubai</strong>{" "}
          that also holds FTA tax agency approval. The books, the tax filings
          and the audit file come from one team. Nothing is translated,
          re-entered, or lost between providers.
        </p>

        <ul>
          {WHY_ITEMS.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 border-t border-[#eadfcb] py-4"
            >
              <div className="size-16 flex-none overflow-hidden rounded-xl bg-white/70 shadow-sm">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={128}
                  height={128}
                  quality={100}
                  sizes="64px"
                  className="size-full object-cover"
                />
              </div>
              <div>
                <h4 className="mb-1 text-lg font-bold leading-snug">
                  {item.title}
                </h4>
                <p className="text-justify text-sm leading-relaxed text-[#5b534a]">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
};

export default WhoWeServe;
