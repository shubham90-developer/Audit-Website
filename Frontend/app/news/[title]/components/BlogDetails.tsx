import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";
import TopBanner from "./TopBanner";

const categories = [
  { name: "Audit & Assurance", count: 8 },
  { name: "Corporate Tax", count: 6 },
  { name: "VAT Services", count: 5 },
  { name: "Accounting", count: 9 },
  { name: "Business Advisory", count: 4 },
  { name: "Financial Planning", count: 7 },
];

const recentPosts = [
  {
    slug: "corporate-tax-common-mistakes",
    title: "UAE Corporate Tax: 5 Common Mistakes to Avoid",
    date: "Feb 26, 2026",
    image: "/img/banner/2.jpg",
  },
  {
    slug: "vat-voluntary-disclosure",
    title: "VAT Voluntary Disclosure: When and How to Correct an Error",
    date: "Feb 05, 2026",
    image: "/img/banner/3.jpg",
  },
  {
    slug: "free-zone-corporate-tax",
    title: "Free Zone Companies and the 0% Corporate Tax Rate",
    date: "Jan 28, 2026",
    image: "/img/banner/1.jpg",
  },
];

const relatedPosts = [
  {
    slug: "corporate-tax-common-mistakes",
    tag: "Corporate Tax",
    title: "UAE Corporate Tax: 5 Common Mistakes to Avoid",
    image: "/img/banner/2.jpg",
  },
  {
    slug: "prepare-company-for-audit",
    tag: "Audit & Assurance",
    title: "How to Prepare Your Company for an Audit",
    image: "/img/banner/3.jpg",
  },
];

const card =
  "rounded-3xl border border-black/5 bg-white p-6 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.12)]";

const BlogDetails = () => {
  return (
    <>
      {/* Top banner (has its own background, title, share and meta) */}
      <TopBanner
        category="Audit & Assurance"
        title="Does My Company Need an Audit in the UAE?"
        author="Mr. Ahmed Al Mazroei,"
        authorImage="/img/about/5.jpg"
        reviewedBy="Mr. Ahmed Al Mazroei, Sr. Accountant & Tax Consultant"
        updated="March 14, 2026"
        readTime="5 minutes"
      />

      {/* ------------------------- Content ------------------------- */}
      <section className="relative isolate  bg-white px-4 py-10 sm:px-8 lg:py-16">
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
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
            {/* LEFT: Article */}
            <article className="min-w-0 rounded-3xl border border-black/5 bg-white p-4 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.12)] sm:p-6 lg:p-8">
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100">
                <Image
                  src="/img/banner/1.jpg"
                  alt="Audit and accounting services"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="object-cover"
                />
              </div>

              <div className="px-1 pt-8 sm:px-3 lg:px-4">
                <p className=" text-lg leading-8 text-gray-700">
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. In
                  unde modi earum velit minima nisi laudantium voluptas pariatur
                  exercitationem. Necessitatibus molestias doloremque debitis
                  deleniti. Repellat aspernatur corporis adipisci tempore
                  eligendi ut quam aliquid veritatis doloremque fugiat tenetur
                  nemo, nulla expedita? Eaque officiis omnis cum inventore
                  facere nam praesentium, laboriosam dolores.
                </p>

                {/* Related posts */}
                <div className="mt-14">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-bold tracking-tight text-gray-950">
                      Related Articles
                    </h2>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-linear-to-r from-[#3ddc6e]/40 to-transparent"
                    />
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-2">
                    {relatedPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/news/${post.slug}`}
                        className="group overflow-hidden rounded-2xl border border-black/5 bg-white p-2 transition duration-300 hover:-translate-y-1 hover:border-[#3ddc6e]/50 hover:shadow-[0_20px_40px_-16px_rgba(61,220,110,0.35)]"
                      >
                        <div className="relative aspect-16/10 overflow-hidden rounded-xl bg-gray-100">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 380px"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#00852B] shadow-sm backdrop-blur">
                            {post.tag}
                          </span>
                        </div>
                        <div className="flex items-start justify-between gap-3 p-3">
                          <h3 className="text-base font-semibold leading-6 text-gray-900">
                            {post.title}
                          </h3>
                          <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gray-950 text-white transition group-hover:bg-[#3ddc6e] group-hover:text-black">
                            <FiArrowUpRight aria-hidden />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* RIGHT: Sidebar */}
            <aside className="space-y-6 lg:sticky lg:top-8">
              <form role="search" action="/news" className={card}>
                <label
                  htmlFor="blog-search"
                  className="text-lg font-bold text-gray-950"
                >
                  Search Articles
                </label>
                <div className="relative mt-4">
                  <FiSearch
                    aria-hidden
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="blog-search"
                    name="q"
                    type="search"
                    placeholder="Search blog posts..."
                    className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#3ddc6e] focus:bg-white focus:ring-4 focus:ring-[#3ddc6e]/15"
                  />
                </div>
              </form>

              <div className={card}>
                <h3 className="text-lg font-bold text-gray-950">
                  Blog Categories
                </h3>
                <ul className="mt-4 space-y-1">
                  {categories.map(({ name, count }) => (
                    <li key={name}>
                      <Link
                        href="/news"
                        className="group flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm font-medium text-gray-600 transition hover:bg-[#3ddc6e]/10 hover:text-gray-950"
                      >
                        <span>{name}</span>
                        <span className="grid min-w-7 place-items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 transition group-hover:bg-[#3ddc6e] group-hover:text-black">
                          {count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={card}>
                <h3 className="text-lg font-bold text-gray-950">
                  Recent Articles
                </h3>
                <ul className="mt-5 space-y-5">
                  {recentPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/news/${post.slug}`}
                        className="group flex items-start gap-3"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                          <Image
                            src={post.image}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover transition duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-medium text-gray-400">
                            {post.date}
                          </span>
                          <h4 className="mt-1 line-clamp-3 text-sm font-semibold leading-5 text-gray-800 transition group-hover:text-[#00852B]">
                            {post.title}
                          </h4>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
