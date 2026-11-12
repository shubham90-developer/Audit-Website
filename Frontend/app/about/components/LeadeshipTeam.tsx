import Image from "next/image";
import Title from "@/app/components/Title";

/* ----------------------------- Content ----------------------------- */

// light office / building image

const ACCENT = "#3ddc6e"; // lines, borders, button
const ACCENT_DARK = "#00852B"; // text on light backgrounds

const MEMBERS = [
  {
    name: "Mr. Ahmed Al Mazroei, UAE-CA.",
    role: "Director of Accounting and Taxation",
    image: "/img/about/5.jpg",
    bio: "Mr. Ahmed Al Mazroei is a respected business professional associated with Ahmed Al Mazroei Auditing & Accounting, a UAE-based firm established in 2000. With a strong commitment to professionalism, integrity, and excellence, he represents a vision focused on delivering reliable financial, auditing, accounting, and business advisory services. Under his leadership and guidance, the firm aims to provide comprehensive financial solutions, maintain the highest standards of professional ethics, and build long-term relationships based on trust, transparency, and client satisfaction. His commitment to quality, continuous improvement, and business excellence reflects the firm's dedication to supporting businesses across the UAE with confidence and professionalism.",
  },
];

/* ---------------------------- Component ----------------------------- */

const LeadeshipTeam = () => {
  return (
    <section>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white to-transparent sm:h-32"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white to-transparent sm:h-32"
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        {/* heading */}
        <Title
          title="Meet Our"
          colorTitle="Leadership Team"
          subtitle="Meet our experienced leadership team, dedicated to delivering excellence, building lasting relationships, and guiding our firm with integrity, expertise, and professionalism."
          watermark="Ahmed Al Mazroei"
        />

        {/* cards */}
        <div className="mt-8 grid gap-5 sm:mt-10">
          {MEMBERS.map((m) => (
            <article
              key={m.name}
              className="flex flex-col gap-4 rounded-2xl border bg-white p-3 shadow-sm sm:p-4 md:flex-row md:gap-6"
              style={{ borderColor: `${ACCENT}66` }}
            >
              <Image
                src={m.image}
                alt={m.name}
                width={300}
                height={500}
                className="h-62 w-full rounded-lg object-cover object-top sm:h-86  md:w-56 md:shrink-0 md:self-stretch lg:w-64"
              />

              <div className="flex min-w-0 flex-1 flex-col md:py-1">
                <h3 className="text-lg font-bold leading-snug text-gray-900 sm:text-xl">
                  {m.name}
                </h3>
                <p
                  className="mt-2 text-xs font-semibold sm:text-sm"
                  style={{ color: ACCENT_DARK }}
                >
                  {m.role}
                </p>
                <p className="mt-3 text-left text-sm leading-6 text-gray-600 sm:text-justify">
                  {m.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadeshipTeam;
