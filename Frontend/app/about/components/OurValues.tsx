import React from "react";

const values = [
  {
    icon: "🎯",
    title: "Integrity",
    text: "We are honest, even when the answer is difficult.",
  },
  {
    icon: "🤝",
    title: "Independence",
    text: "Our opinion is objective and free from influence.",
  },
  {
    icon: "🚀",
    title: "Quality",
    text: "Every report is reviewed carefully before it reaches you.",
  },
  {
    icon: "🌱",
    title: "Confidentiality",
    text: "Your information is always kept safe and private.",
  },
];

const OurValues: React.FC = () => {
  return (
    <section className="relative py-24">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-200/50 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-200/50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Section label */}
        <div className="flex items-center justify-center gap-2">
          <span
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 bg-linear-to-br from-slate-300 to-transparent [clip-path:polygon(0_0,100%_0,0_100%)]"
          />
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#150040] sm:text-sm">
            Our Values
          </span>
        </div>

        <h2 className="mt-4 text-3xl text-center font-bold leading-[1.2] tracking-tight text-slate-800 sm:text-4xl lg:mt-5 lg:text-[2.65rem] xl:text-5xl">
          The Principles That Guide Us
        </h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((v, i) => (
            <div
              key={v.title}
              className="group rounded-3xl border border-slate-100 bg-white p-8 shadow-md transition duration-300 hover:-translate-y-2 hover:border-pink-300 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-black text-2xl shadow-lg">
                  {v.icon}
                </span>
                <span className="text-5xl font-bold text-slate-100 transition group-hover:text-pink-200">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-800">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
