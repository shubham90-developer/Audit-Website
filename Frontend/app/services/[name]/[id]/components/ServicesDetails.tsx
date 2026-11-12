import Image from "next/image";
import TopBanner from "./TopBanner";

const ServicesDetails = () => {
  return (
    <>
      <TopBanner />

      {/* ------------------------- Intro ------------------------- */}
      <section className="relative isolate  bg-white py-14 sm:py-20 lg:py-24">
        {/* Background image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/banner/bg7.avif')" }}
        />
        {/* Soft white wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-white/90"
        />
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

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14 lg:px-8">
          {/* ---------------------- Left: text ---------------------- */}
          <div>
            <h2 className="text-3xl font-bold leading-[1.12] tracking-tight text-gray-950 sm:text-4xl lg:text-5xl">
              Reliable accounting. Clear financial direction.
            </h2>
            <div className="mt-5 h-1 w-14 rounded-full bg-[#3ddc6e]" />

            <div className="mt-6 max-w-2xl space-y-4 text-base leading-7 text-gray-600">
              <p>
                Managing your business finances requires accuracy, consistency,
                and attention to detail. Our accounting support helps simplify
                daily financial operations, maintain organized records, and
                provide better visibility into your business performance.
              </p>
              <p>
                Whether you need assistance with bookkeeping, financial
                reporting, payroll documentation, or general accounting support,
                we help you build a more structured and efficient financial
                process.
              </p>
            </div>

            {/* Stat Card */}
            <div className="mt-8 overflow-hidden rounded-3xl border border-[#3ddc6e]/30 bg-white/90 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.12)] backdrop-blur">
              <div className="flex h-1.5 bg-[#3ddc6e] sm:h-auto sm:flex-row">
                <span className="hidden w-1.5 shrink-0 bg-[#3ddc6e] sm:block" />
              </div>

              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-7">
                {/* Image */}
                <div className="flex shrink-0 items-center justify-center sm:w-44 sm:border-r sm:border-gray-200 sm:pr-7">
                  <Image
                    src="/img/banner/uae-tower.avif"
                    alt="UAE business skyline"
                    width={200}
                    height={120}
                    priority
                    className="h-24 w-full max-w-48 rounded-xl object-contain sm:h-28 sm:w-40"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-sm leading-7 text-gray-600 sm:text-base">
                    Even companies with clean books should be audited properly.
                    A well-run audit protects the owners, supports your bank and
                    licensing needs, and keeps you in good standing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ---------------------- Right: image ---------------------- */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-gray-100 shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)] sm:aspect-5/6 lg:aspect-4/5">
              <Image
                src="/img/banner/7.jpg"
                alt="Audit consultants reviewing financial documents"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent"
              />
            </div>

            {/* round badge */}
            <div className="absolute -left-3 -top-3 grid h-28 w-28 place-items-center rounded-full border-2 border-[#3ddc6e] bg-gray-950 p-3 text-center shadow-xl sm:-left-8 sm:-top-6 sm:h-32 sm:w-32">
              <div>
                <p className="text-2xl font-extrabold leading-none text-[#3ddc6e] sm:text-3xl">
                  25+ Yrs
                </p>
                <p className="mt-1.5 text-[10px] leading-3 text-white/85 sm:text-[11px] sm:leading-4">
                  Audit experience in
                  <br />
                  the UAE
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesDetails;
