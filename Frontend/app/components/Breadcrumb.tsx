import Link from "next/link";
import { HiChevronRight } from "react-icons/hi2";

const DEFAULT_BG = "/img/banner/bg10.avif";

type Crumb = { label: string; href: string };

type BreadcrumbProps = {
  title: string;
  subtitle?: string;
  image?: string;
  crumbs?: Crumb[];
};

const Breadcrumb = ({
  title,
  subtitle,
  image = DEFAULT_BG,
  crumbs = [],
}: BreadcrumbProps) => {
  const trail = [{ label: "Home", href: "/" }, ...crumbs];

  return (
    <section className="relative isolate flex min-h-85 items-center justify-center overflow-hidden bg-[#080d09] px-4 py-20 text-center text-white sm:min-h-97.5 lg:min-h-110">
      {/* Background Image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-fill bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 -z-20 bg-black/70" />

      {/* Top Center Green Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-105"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at 50% 0%, rgba(61,220,110,0.30), rgba(61,220,110,0.10) 45%, transparent 75%)",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-center text-center">
        {/* Title */}
        <h1 className="max-w-3xl text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          {title}
        </h1>

        {/* Green Divider */}
        <div className="my-6 flex items-center justify-center gap-2">
          <span className="h-px w-10 bg-[#3ddc6e]/40" />
          <span className="h-1.5 w-10 rounded-full bg-[#3ddc6e] shadow-[0_0_14px_rgba(61,220,110,0.7)]" />
          <span className="h-px w-10 bg-[#3ddc6e]/40" />
        </div>

        {/* Subtitle */}
        {subtitle && (
          <p className="mx-auto max-w-2xl text-sm font-normal leading-7 text-white/75 sm:text-base md:text-lg">
            {subtitle}
          </p>
        )}

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mt-8">
          <ol className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
            {trail.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-2">
                <Link
                  href={crumb.href}
                  className="text-white/65 transition-colors hover:text-[#3ddc6e]"
                >
                  {crumb.label}
                </Link>
                <HiChevronRight className="h-3.5 w-3.5 text-[#3ddc6e]/70" />
              </li>
            ))}

            <li aria-current="page" className="font-semibold text-[#3ddc6e]">
              {title}
            </li>
          </ol>
        </nav>
      </div>
    </section>
  );
};

export default Breadcrumb;
