import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiBarChart2,
  FiBookOpen,
  FiBriefcase,
  FiFileText,
  FiShield,
} from "react-icons/fi";

interface Service {
  id: string;
  slug: string;
  name: string;
  text: string;
  icon: React.ElementType;
  image: string;
}

const services: Service[] = [
  {
    id: "1",
    slug: "audit-assurance",
    icon: FiBarChart2,
    name: "Audit & Assurance",
    text: "Independent audits that ensure financial accuracy, transparency, and regulatory compliance.",
    image: "/img/banner/1.jpg",
  },
  {
    id: "2",
    slug: "tax-services",
    icon: FiFileText,
    name: "Tax Services",
    text: "Corporate tax, VAT, and transfer pricing solutions to simplify compliance and improve tax efficiency.",
    image: "/img/banner/2.jpg",
  },
  {
    id: "3",
    slug: "advisory-services",
    icon: FiShield,
    name: "Advisory Services",
    text: "Build stronger controls, improve governance, and manage business risks with confidence.",
    image: "/img/banner/3.jpg",
  },
  {
    id: "4",
    slug: "consulting-services",
    icon: FiBriefcase,
    name: "Consulting Services",
    text: "Strategic support for valuations, mergers, acquisitions, financial modelling, and IT audits.",
    image: "/img/banner/2.jpg",
  },
  {
    id: "5",
    slug: "accounting-other-services",
    icon: FiBookOpen,
    name: "Accounting & Other Services",
    text: "Reliable bookkeeping, outsourced CFO services, litigation support, and specialised audits.",
    image: "/img/banner/3.jpg",
  },
];

const Services: React.FC = () => {
  return (
    <section className="relative isolate  bg-white py-14 sm:py-20 lg:py-24">
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/banner/services.avif')" }}
      />
      {/* Soft white wash */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-white/80" />

      {/* Green glow, top center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-112.5"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at 50% 0%, rgba(61,220,110,0.18), transparent 75%)",
        }}
      />
      {/* Faint grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.id}
                href={`/services/${service.name}/${service.id}`}
                className="group relative isolate flex min-h-80 flex-col overflow-hidden rounded-3xl border border-white/10 bg-gray-950 p-6 text-white shadow-[0_10px_40px_-18px_rgba(0,0,0,0.6)] transition duration-300 hover:-translate-y-1.5 hover:border-[#3ddc6e]/60 hover:shadow-[0_28px_60px_-20px_rgba(61,220,110,0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ddc6e] sm:p-7"
              >
                {/* image */}
                <Image
                  src={service.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="-z-20 object-cover opacity-70 transition duration-700 group-hover:scale-110"
                />
                {/* dark gradient: image shows at top, solid at bottom for text */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 bg-linear-to-b from-gray-950/30 via-gray-950/75 to-gray-950"
                />
                {/* top accent line */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-[#3ddc6e]/70 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
                />

                {/* top row */}
                <div className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-[#3ddc6e]/50 bg-black/40 text-[#3ddc6e] backdrop-blur transition duration-300 group-hover:bg-[#3ddc6e] group-hover:text-black">
                    <Icon size={20} aria-hidden />
                  </span>
                  <span className="text-2xl font-bold tracking-wide text-[#3ddc6e]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* bottom content */}
                <div className="mt-auto pt-16">
                  <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                    {service.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-0.5 w-8 rounded-full bg-[#3ddc6e] transition-all duration-300 group-hover:w-16"
                  />
                  <p className="mt-4 text-sm leading-7 text-gray-300">
                    {service.text}
                  </p>

                  <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-[#3ddc6e]">
                    Explore service
                    <span className="grid h-7 w-7 place-items-center rounded-full border border-[#3ddc6e]/50 transition duration-300 group-hover:translate-x-1 group-hover:bg-[#3ddc6e] group-hover:text-black">
                      <FiArrowRight size={14} aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* CTA card */}
          <div className="relative isolate flex min-h-80 flex-col justify-between overflow-hidden rounded-3xl border border-[#3ddc6e]/40 bg-linear-to-br from-gray-950 via-gray-900 to-[#0b3d1d] p-6 text-white shadow-[0_10px_40px_-18px_rgba(0,0,0,0.6)] sm:p-7">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-[#3ddc6e]/20"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-5 -top-5 h-32 w-32 rounded-full border border-[#3ddc6e]/20"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -left-10 -z-10 h-56 w-56 rounded-full bg-[#3ddc6e]/15 blur-3xl"
            />

            <div className="relative">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#3ddc6e]">
                Let&apos;s Talk
              </span>
              <h3 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
                Need the right solution for your business?
              </h3>
              <span
                aria-hidden="true"
                className="mt-4 block h-0.5 w-8 rounded-full bg-[#3ddc6e]"
              />
              <p className="mt-4 text-sm leading-7 text-gray-300">
                Speak with our experts and discover how we can help your
                business move forward.
              </p>
            </div>

            <Link
              href="/contact"
              className="relative mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-[#3ddc6e] py-2 pl-5 pr-2 text-sm font-bold text-black transition duration-300 hover:bg-white"
            >
              Book a Consultation
              <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-[#3ddc6e]">
                <FiArrowUpRight size={16} aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
