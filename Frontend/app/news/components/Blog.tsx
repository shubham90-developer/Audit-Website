"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight } from "react-icons/hi2";

/* ----------------------------- Content ----------------------------- */

// Placeholder posts: replace with your real posts (or fetch them and pass as props).
const POSTS = [
  {
    slug: "annual-audit-checklist",
    category: "Audit & Assurance",
    title: "Annual Audit Checklist for UAE Businesses",
    excerpt:
      "Add a short summary of the post here, two or three lines is enough.",
    date: "5 Nov 2026",
    image: "/img/blog/1.jpg",
  },
  {
    slug: "corporate-tax-basics",
    category: "Tax Services",
    title: "Corporate Tax Basics: What Every Owner Should Know",
    excerpt:
      "Add a short summary of the post here, two or three lines is enough.",
    date: "28 Oct 2026",
    image: "/img/blog/1.jpg",
  },
  {
    slug: "vat-filing-mistakes",
    category: "Tax Services",
    title: "Common VAT Filing Mistakes and How to Avoid Them",
    excerpt:
      "Add a short summary of the post here, two or three lines is enough.",
    date: "20 Oct 2026",
    image: "/img/blog/1.jpg",
  },
  {
    slug: "growing-your-business",
    category: "Advisory Services",
    title: "Planning Your Next Stage of Growth",
    excerpt:
      "Add a short summary of the post here, two or three lines is enough.",
    date: "12 Oct 2026",
    image: "/img/blog/1.jpg",
  },
  {
    slug: "bookkeeping-habits",
    category: "Accounting",
    title: "Bookkeeping Habits That Save Time at Year End",
    excerpt:
      "Add a short summary of the post here, two or three lines is enough.",
    date: "3 Oct 2026",
    image: "/img/blog/1.jpg",
  },
];

const CATEGORIES = ["All", ...new Set(POSTS.map((p) => p.category))];

/* ---------------------------- Component ----------------------------- */

const Blog = () => {
  const [category, setCategory] = useState("All");

  const posts =
    category === "All" ? POSTS : POSTS.filter((p) => p.category === category);

  return (
    <section className="relative isolate  bg-white py-12 sm:py-16 lg:py-20">
      {/* Background Image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/banner/bg7.avif')" }}
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
        {/* category tabs: centered when they fit, scroll sideways when they don't */}
        <div
          role="tablist"
          className="mx-auto flex w-fit max-w-full gap-1.5 overflow-x-auto rounded-full bg-gray-100 p-1.5 scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={c === category}
              onClick={() => setCategory(c)}
              className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-[#3ddc6e] sm:px-4 sm:text-sm ${
                c === category
                  ? "bg-black text-white"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* posts */}
        {posts.length === 0 ? (
          <p className="mt-10 text-center text-sm text-gray-500">
            No posts in this category yet.
          </p>
        ) : (
          <div className="mt-8 grid gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#3ddc6e]/30 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[#3ddc6e] hover:shadow-md"
              >
                <Image
                  src={post.image}
                  alt={post.title}
                  width={600}
                  height={400}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-3/2 w-full object-cover"
                />

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs">
                    <span className="rounded-full bg-[#3ddc6e]/15 px-2.5 py-1 font-semibold text-[#00852B]">
                      {post.category}
                    </span>
                    <time className="text-gray-500">{post.date}</time>
                  </div>

                  <h3 className="mt-3 line-clamp-2 wrap-break-word text-base font-bold leading-snug text-gray-900 sm:text-lg">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/news/${post.slug}`}
                    className="mt-auto inline-flex w-fit items-center gap-1.5 pt-4 text-sm font-semibold text-[#00852B]"
                  >
                    Read more
                    <HiArrowRight
                      className="h-4 w-4 transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
