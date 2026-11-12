"use client";

import ThemeBtn from "@/app/components/ThemeBtn";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";

const faq = (
  q: string,
  a = "Our team is here to help. Please contact us for more information.",
) => ({ q, a });

const FAQS = [
  {
    category: "About Ahmed Al Mazroei",
    items: [
      faq(
        "What makes Ahmed Al Mazroei different from other chartered accountant firms in Dubai?",
        "We combine professional expertise, personalized support and practical financial solutions to help businesses operate with confidence.",
      ),
      faq(
        "Are your accountants qualified, and who signs off my work?",
        "Our services are handled by experienced accounting and tax professionals, with appropriate review and approval procedures.",
      ),
      faq(
        "How do I switch to Ahmed Al Mazroei from my current accountant?",
        "We make the transition simple by reviewing your existing records, coordinating the handover and organizing your accounting documents.",
      ),
      faq(
        "How do your fees work?",
        "Our fees depend on your business requirements, transaction volume and the scope of services. We provide clear pricing before starting.",
      ),
      faq(
        "What happens if the FTA raises a query or opens a tax audit?",
        "We can assist with documentation, financial records and responses to relevant FTA queries within the agreed scope.",
      ),
      faq(
        "My books are behind and in poor shape. Will you still take me on?",
        "Yes. We can review your existing records, identify gaps and help bring your accounts up to date.",
      ),
      faq(
        "Who will I actually be dealing with day to day?",
        "You will have a dedicated point of contact to coordinate your accounting and financial requirements.",
      ),
      faq(
        "Can you handle my audit as well as my accounting?",
        "Yes. We offer accounting and audit services based on your business requirements and applicable regulations.",
      ),
      faq(
        "Will I have to change my accounting software?",
        "Not necessarily. We first review your existing software and recommend changes only when required.",
      ),
      faq(
        "What do you need from us to get started?",
        "We typically need your business licence, financial records, previous reports and relevant company documents.",
      ),
      faq(
        "How do you keep my financial information confidential?",
        "We follow professional confidentiality practices and appropriate procedures to protect client information.",
      ),
      faq(
        "Can you assist businesses based outside the UAE?",
        "Yes. We can discuss your cross-border business requirements and the services that may be appropriate.",
      ),
    ],
  },
  { category: "Business Setup", items: [] },
  { category: "Tax", items: [] },
  { category: "Accounting", items: [] },
  { category: "Audit & Compliance", items: [] },
  { category: "Corporate Services", items: [] },
  { category: "Visa & Other", items: [] },
];

const Faq = () => {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<number | null>(0);

  const { category, items } = FAQS[tab];

  const selectTab = (index: number) => {
    setTab(index);
    setOpen(0);
  };

  return (
    <section className="relative isolate bg-white py-16 sm:py-20 lg:py-24">
      {/* Background Image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/banner/bg1.avif')" }}
      />

      {/* White Overlay */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-white/85" />

      {/* Light Green Top Center Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-112.5"
        style={{
          background:
            "radial-gradient(ellipse 55% 75% at 50% 0%, rgba(61,220,110,0.15), transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Navigation */}
        <div className="mb-10 flex justify-center">
          <div
            role="tablist"
            aria-label="FAQ categories"
            className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-gray-200/80 bg-white p-2 shadow-sm"
          >
            {FAQS.map((f, i) => (
              <button
                key={f.category}
                type="button"
                role="tab"
                aria-selected={i === tab}
                onClick={() => selectTab(i)}
                className={`rounded-xl px-4 cursor-pointer py-2.5 text-xs font-semibold transition-all duration-300 sm:px-5 sm:text-sm ${
                  i === tab
                    ? "bg-[#15231a] text-white shadow-md shadow-black/10"
                    : "text-gray-600 hover:bg-[#3ddc6e]/10 hover:text-[#00852b]"
                }`}
              >
                {f.category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Content */}
        <div className="mx-auto max-w-4xl">
          {/* Category Title */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#25b957]">
                Explore answers
              </p>
              <h3 className="mt-1 text-xl font-bold text-[#15231a] sm:text-2xl">
                {category}
              </h3>
            </div>

            <span className="shrink-0 rounded-full border border-[#3ddc6e]/30 bg-[#3ddc6e]/10 px-3 py-1.5 text-xs font-semibold text-[#00852b]">
              {items.length} Questions
            </span>
          </div>

          {/* Accordion */}
          <div className="space-y-3">
            {items.length === 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm">
                <HiOutlineChatBubbleLeftRight className="mx-auto h-9 w-9 text-[#25b957]" />
                <h4 className="mt-4 font-semibold text-gray-900">
                  Questions coming soon
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  We are preparing helpful answers for this category.
                </p>
              </div>
            )}

            {items.map((item, i) => {
              const isOpen = open === i;

              return (
                <div
                  key={item.q}
                  className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-[#3ddc6e]/60 shadow-[0_8px_30px_rgba(21,35,26,0.07)]"
                      : "border-gray-200/80 shadow-sm hover:border-[#3ddc6e]/50 hover:shadow-md"
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center gap-3 px-4 py-5 text-left sm:gap-5 sm:px-6"
                  >
                    {/* Number */}
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors duration-300 ${
                        isOpen
                          ? "bg-[#3ddc6e] text-[#102116]"
                          : "bg-gray-100 text-gray-500 group-hover:bg-[#3ddc6e]/15 group-hover:text-[#00852b]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Question */}
                    <span
                      className={`flex-1 text-sm font-semibold leading-6 transition-colors sm:text-base ${
                        isOpen ? "text-[#00852b]" : "text-[#18251c]"
                      }`}
                    >
                      {item.q}
                    </span>

                    {/* Toggle */}
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen
                          ? "rotate-180 bg-[#15231a] text-white"
                          : "bg-[#3ddc6e]/10 text-[#00852b] group-hover:bg-[#3ddc6e] group-hover:text-[#102116]"
                      }`}
                    >
                      {isOpen ? (
                        <HiOutlineMinus className="h-4 w-4" />
                      ) : (
                        <HiOutlinePlus className="h-4 w-4" />
                      )}
                    </span>
                  </button>

                  {/* Answer */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-15 mr-4 border-t border-gray-100 pb-5 pt-4 sm:ml-19.5 sm:mr-6">
                        <p className="text-sm leading-7 text-gray-600">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Support CTA */}
          <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl bg-[#15231a] p-6 text-center text-white sm:flex-row sm:p-8 sm:text-left">
            <div>
              <h3 className="text-lg font-bold sm:text-xl">
                Still have questions?
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Our team is ready to help with your business and financial
                needs.
              </p>
            </div>

            <ThemeBtn onClick={() => router.push("/contact")}>
              {" "}
              Contact Our Team
            </ThemeBtn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
