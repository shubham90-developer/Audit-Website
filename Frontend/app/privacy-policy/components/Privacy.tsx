import Link from "next/link";
import React from "react";
import { FiMail, FiPhone, FiArrowUpRight } from "react-icons/fi";

const COMPANY = "Al Mazroei Audit";
const EMAIL = "info@almazroeiaudit.com";
const PHONE = "+971 52 178 6209";
const PHONE_HREF = `tel:${PHONE.replace(/\s/g, "")}`;

const sections = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    body: (
      <>
        <p>
          We collect only the information needed to respond to you and deliver
          our services. This may include:
        </p>
        <ul>
          <li>
            <strong>Contact details</strong> you submit through our enquiry form
            or by email, such as your name, company name, email address and
            phone number.
          </li>
          <li>
            <strong>Enquiry content</strong>, including the service you are
            interested in and the message you write.
          </li>
          <li>
            <strong>Engagement information</strong> you provide when you become
            a client, such as financial records, licences and corporate
            documents needed to perform audit, tax, advisory or accounting work.
          </li>
          <li>
            <strong>Technical data</strong> collected automatically when you
            visit our website, such as browser type, device, pages viewed and
            approximate location.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    body: (
      <>
        <p>We use personal information to:</p>
        <ul>
          <li>Respond to your enquiries and provide requested services.</li>
          <li>
            Perform our professional engagements and meet our legal, regulatory
            and professional obligations.
          </li>
          <li>
            Communicate with you about your engagement, including invoices and
            important updates.
          </li>
          <li>Maintain, secure and improve our website and services.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Sharing of Information",
    body: (
      <>
        <p>We may share information only where necessary with:</p>
        <ul>
          <li>
            Service providers that support our operations, such as hosting,
            email and IT providers, under confidentiality obligations.
          </li>
          <li>
            Regulators, authorities or professional bodies where required by
            applicable law.
          </li>
          <li>
            Professional advisers, where needed to protect our legal rights.
          </li>
        </ul>
        <p>
          Information relating to client engagements is treated as confidential
          and is not disclosed without authorisation, except where the law
          requires it.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "Data Retention",
    body: (
      <p>
        We keep personal information only for as long as needed for the purposes
        described in this policy, including to meet legal, tax, accounting and
        professional record-keeping requirements. When information is no longer
        needed, we delete or anonymise it.
      </p>
    ),
  },
  {
    id: "security",
    title: "Data Security",
    body: (
      <p>
        We apply reasonable technical and organisational measures to protect
        personal information against unauthorised access, loss, misuse or
        alteration. No method of transmission over the internet is completely
        secure, so we cannot guarantee absolute security.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights",
    body: (
      <>
        <p>
          Subject to applicable UAE data protection law, you may have the right
          to:
        </p>
        <ul>
          <li>Request access to the personal information we hold about you.</li>
          <li>Ask us to correct inaccurate or incomplete information.</li>
          <li>
            Ask us to delete or restrict the use of your information, where
            permitted.
          </li>
          <li>Object to certain processing, or withdraw your consent.</li>
        </ul>
        <p>
          To exercise these rights, contact us using the details below. We may
          need to verify your identity before acting on a request.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies",
    body: (
      <p>
        Our website may use cookies and similar technologies to make the site
        work properly and to understand how it is used. You can control or
        disable cookies through your browser settings, although some parts of
        the site may not function as intended if you do.
      </p>
    ),
  },
  {
    id: "third-party",
    title: "Third-Party Links",
    body: (
      <p>
        Our website may link to third-party sites such as maps or messaging
        services. We are not responsible for the privacy practices of those
        sites and encourage you to read their policies.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    body: (
      <p>
        We may update this policy from time to time. The latest version will
        always be available on this page, with the &ldquo;Last updated&rdquo;
        date shown at the top.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    body: (
      <p>
        If you have any questions about this policy or how we handle your
        information, please contact us at{" "}
        <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or call{" "}
        <a href={PHONE_HREF}>{PHONE}</a>.
      </p>
    ),
  },
];

// Styles nested content (p, ul, li, a) without needing the typography plugin
const proseCls =
  "mt-4 space-y-4 text-sm leading-7 text-slate-600 sm:text-[15px] " +
  "[&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-[#3ddc6e] " +
  "[&_strong]:font-semibold [&_strong]:text-slate-800 " +
  "[&_a]:font-semibold [&_a]:text-green-700 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-green-800";

const Privacy = () => {
  return (
    <main className="relative isolate bg-white py-14 sm:py-20 lg:py-24">
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
            "radial-gradient(ellipse 55% 75% at 50% 0%, rgba(61,220,110,0.22), transparent 75%)",
        }}
      />

      {/* Content */}
      <section className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-4 lg:gap-12">
          {/* Table of contents */}
          <aside className="lg:col-span-1">
            <nav
              aria-label="Privacy policy sections"
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_4px_24px_-16px_rgba(15,23,42,0.18)] lg:sticky lg:top-24"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                On this page
              </p>
              <ol className="mt-4 space-y-1">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <Link
                      href={`#${s.id}`}
                      className="flex items-start gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-green-50 hover:text-green-700"
                    >
                      <span className="w-5 shrink-0 font-semibold text-green-600">
                        {i + 1}.
                      </span>
                      <span>{s.title}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Policy body */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-3xl border border-green-100 bg-white p-6 shadow-[0_20px_70px_-35px_rgba(21,128,61,0.28)] sm:p-10">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-[#3ddc6e] via-green-500 to-emerald-300" />

              <p className="text-sm leading-7 text-slate-600 sm:text-[15px]">
                {COMPANY} (&ldquo;we&rdquo;, &ldquo;us&rdquo;,
                &ldquo;our&rdquo;) is an audit and professional services firm
                based in Abu Dhabi, United Arab Emirates. By using our website
                or contacting us, you acknowledge the practices described in
                this policy.
              </p>

              <div className="mt-8 divide-y divide-green-100">
                {sections.map((s, i) => (
                  <section
                    key={s.id}
                    id={s.id}
                    className="scroll-mt-28 py-8 first:pt-0 last:pb-0"
                  >
                    <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-sm font-bold text-green-700">
                        {i + 1}
                      </span>
                      {s.title}
                    </h2>
                    <div className={proseCls}>{s.body}</div>
                  </section>
                ))}
              </div>
            </div>

            {/* Contact strip */}
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-green-300 bg-green-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Questions about your privacy?
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Our team is happy to help.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3ddc6e] px-5 py-3 text-sm font-semibold text-[#0d100e] shadow-lg shadow-green-500/25 transition hover:-translate-y-0.5 hover:bg-[#2fc75f]"
                >
                  <FiMail size={16} />
                  Email Us
                  <FiArrowUpRight size={15} />
                </a>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:border-green-500"
                >
                  <FiPhone size={16} />
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Privacy;
