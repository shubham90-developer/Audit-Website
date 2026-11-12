"use client";

import ThemeBtn from "@/app/components/ThemeBtn";
import React, { useState } from "react";
import {
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiFileText,
  FiHeadphones,
  FiLayers,
  FiMail,
  FiShield,
  FiUser,
  FiUsers,
} from "react-icons/fi";

/* ----------------------------- Content ----------------------------- */

const BG_IMAGE = "/img/banner/bg1.avif";

const FEATURES = [
  {
    icon: FiHeadphones,
    title: "Expert Consultation",
    text: "Guidance from qualified UAE tax, audit and accounting professionals.",
  },
  {
    icon: FiClock,
    title: "Quick Response",
    text: "We reply within UAE business hours, not days later.",
  },
  {
    icon: FiUsers,
    title: "Trusted by Businesses",
    text: "Hundreds of clients served across the UAE and beyond.",
  },
];

const SERVICES = [
  "Audit & Assurance",
  "Tax Services",
  "Advisory Services",
  "Consulting Services",
  "Accounting & Other Services",
  "Other Enquiries",
];

const CODES = [
  "+971",
  "+966",
  "+974",
  "+968",
  "+973",
  "+965",
  "+91",
  "+92",
  "+44",
  "+1",
];

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  code: "+971",
  phone: "",
  service: "",
  message: "",
};

const input =
  "w-full rounded-lg border border-white/15 bg-white/5 py-3 text-sm text-white outline-none transition placeholder:text-white/50 focus:border-[#3ddc6e] [&>option]:bg-black";

type FieldProps = {
  icon: React.ElementType;
  className?: string;
  children: React.ReactNode;
};

// Input wrapper with a leading icon
const Field = ({ icon: Icon, className = "", children }: FieldProps) => (
  <div className={`relative ${className}`}>
    <Icon
      aria-hidden="true"
      className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-white/60"
    />
    {children}
  </div>
);

/* ---------------------------- Component ----------------------------- */

const Contact = () => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSubmitted(false);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Connect your API or email service here.
    console.log("Contact form:", form);
    setSubmitted(true);
  };

  return (
    <main className="relative w-full  bg-white py-12 sm:py-16 lg:py-20">
      {/* background image + white wash + top/bottom fades */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${BG_IMAGE}')` }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-white/60" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-white to-transparent sm:h-32"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-white to-transparent sm:h-32"
      />

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl border border-[#3ddc6e]/30 bg-white/90 p-5 shadow-sm sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:p-10">
          {/* Left: copy + features */}
          <div>
            <span className="inline-block rounded-full bg-[#3ddc6e] px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-black">
              Reach out to us
            </span>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
              We’re Here to Help
              <br />
              <span className="text-[#00852B]">Your Business Grow</span>
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
              For any queries, assistance, or potential collaborations — our
              team is ready to listen. Tell us what you need and the right
              specialist will come back to you.
            </p>
            <p className="mt-3 text-sm font-bold text-gray-900">
              Your inquiries are important to us.
            </p>

            <ul className="mt-8 space-y-5">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-start gap-6 mb-10">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#3ddc6e] text-black">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{title}</h3>
                    <p className="mt-0.5 text-sm text-gray-600">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: dark form card */}
          <div className="rounded-2xl border border-[#3ddc6e]/40 bg-linear-to-b from-[#0d0d12] to-black p-5 text-white shadow-xl sm:p-6">
            <h3 className="text-xl font-bold sm:text-2xl">
              Book your Free Consultation
            </h3>
            <p className="mt-1.5 text-xs leading-5 text-white/80">
              Fill out the form below, and we’ll arrange a consultation at a
              time most suitable for you.
            </p>
            <hr className="my-4 border-white/10" />

            {submitted ? (
              <div role="status" className="py-8 text-center">
                <FiCheckCircle
                  className="mx-auto h-10 w-10 text-[#3ddc6e]"
                  aria-hidden="true"
                />
                <h4 className="mt-3 text-lg font-bold">
                  Thank you for contacting us!
                </h4>
                <p className="mt-2 text-sm text-white/80">
                  Our team will get back to you within one working day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(EMPTY_FORM);
                    setSubmitted(false);
                  }}
                  className="mt-4 cursor-pointer text-sm font-semibold text-[#3ddc6e] underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field icon={FiUser}>
                    <input
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your Name"
                      aria-label="Your name"
                      value={form.name}
                      onChange={onChange}
                      required
                      className={`${input} pl-10 pr-3`}
                    />
                  </Field>
                  <Field icon={FiBriefcase}>
                    <input
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="Company Name"
                      aria-label="Company name"
                      value={form.company}
                      onChange={onChange}
                      className={`${input} pl-10 pr-3`}
                    />
                  </Field>

                  <Field icon={FiMail}>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="Email"
                      aria-label="Email"
                      value={form.email}
                      onChange={onChange}
                      required
                      className={`${input} pl-10 pr-3`}
                    />
                  </Field>
                  <div className="grid grid-cols-[5.5rem_1fr] gap-3">
                    <select
                      name="code"
                      aria-label="Country code"
                      value={form.code}
                      onChange={onChange}
                      className={`${input} px-3`}
                    >
                      {CODES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel-national"
                      placeholder="Mobile"
                      aria-label="Mobile number"
                      value={form.phone}
                      onChange={onChange}
                      className={`${input} px-3`}
                    />
                  </div>
                </div>

                <Field icon={FiLayers}>
                  <select
                    name="service"
                    aria-label="Service needed"
                    value={form.service}
                    onChange={onChange}
                    required
                    className={`${input} appearance-none pl-10 pr-10 ${
                      form.service === "" ? "text-white/50" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select Service
                    </option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3.5 top-3.5 h-4 w-4 text-white/60"
                  />
                </Field>

                <Field icon={FiFileText}>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Describe Briefly Your Requirements?"
                    aria-label="Your requirements"
                    value={form.message}
                    onChange={onChange}
                    required
                    className={`${input} resize-y pl-10 pr-3`}
                  />
                </Field>

                <ThemeBtn className="w-full">Send Message</ThemeBtn>

                <p className="flex items-center justify-center gap-1.5 text-xs text-white/70">
                  <FiShield
                    aria-hidden="true"
                    className="h-3.5 w-3.5 text-[#3ddc6e]"
                  />
                  No obligation
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
