"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HiArrowRight, HiPlay, HiXMark } from "react-icons/hi2";

/* ----------------------------- Content ----------------------------- */

type Post = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  image: string; // thumbnail
  video?: string; // YouTube video ID: makes it a video post
};

// Placeholder posts: replace with your real posts (or fetch them and pass as props).
const POSTS: Post[] = [
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
    video: "YOUTUBE_VIDEO_ID",
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
    video: "YOUTUBE_VIDEO_ID",
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

const VIDEOS = "Videos";
const CATEGORIES = ["All", ...new Set(POSTS.map((p) => p.category)), VIDEOS];

/* ---------------------------- Component ----------------------------- */

const Blog = () => {
  const [category, setCategory] = useState("All");
  const [playing, setPlaying] = useState<Post | null>(null);

  const posts =
    category === "All"
      ? POSTS
      : category === VIDEOS
        ? POSTS.filter((p) => p.video)
        : POSTS.filter((p) => p.category === category);

  // close the video with Escape + lock page scroll while open
  useEffect(() => {
    if (!playing) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [playing]);

  return (
    <section className="relative isolate  bg-white py-14 sm:py-20 lg:py-24">
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/img/banner/bg7.avif')" }}
      />
      {/* Soft white wash */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-white/90" />

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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* category tabs */}
        <div
          role="tablist"
          aria-label="Blog categories"
          className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-black/5 bg-white/70 p-1.5 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] backdrop-blur-md [&::-webkit-scrollbar]:hidden"
        >
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c)}
                className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3ddc6e] sm:px-5 sm:text-sm ${
                  active
                    ? "bg-gray-950 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* posts */}
        {posts.length === 0 ? (
          <p className="mt-12 text-center text-sm text-gray-500">
            No posts in this category yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white p-2 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1.5 hover:border-[#3ddc6e]/50 hover:shadow-[0_24px_48px_-16px_rgba(61,220,110,0.35)]"
              >
                {/* media */}
                <div className="relative overflow-hidden rounded-2xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={600}
                    height={400}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-3/2 w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  {/* gradient for legibility */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent"
                  />

                  {/* category chip on image */}
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#00852B] shadow-sm backdrop-blur">
                    {post.category}
                  </span>

                  {post.video && (
                    <button
                      type="button"
                      onClick={() => setPlaying(post)}
                      aria-label={`Play video: ${post.title}`}
                      className="absolute inset-0 grid cursor-pointer place-items-center focus-visible:outline-2 focus-visible:outline-[#3ddc6e]"
                    >
                      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#3ddc6e] text-black shadow-xl transition duration-300 group-hover:scale-110">
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 animate-ping rounded-full bg-[#3ddc6e]/40"
                        />
                        <HiPlay
                          className="relative h-6 w-6 translate-x-px"
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  )}
                </div>

                {/* body */}
                <div className="flex flex-1 flex-col px-3 pb-3 pt-4 sm:px-4 sm:pb-4">
                  <time className="text-xs font-medium text-gray-400">
                    {post.date}
                  </time>

                  <h3 className="mt-2 line-clamp-2 wrap-break-word text-lg font-bold leading-snug tracking-tight text-gray-950 sm:text-xl">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-5">
                    {post.video ? (
                      <button
                        type="button"
                        onClick={() => setPlaying(post)}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gray-950 py-1.5 pl-4 pr-1.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                      >
                        Watch video
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#3ddc6e] text-black">
                          <HiPlay className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </button>
                    ) : (
                      <Link
                        href={`/press/${post.title}`}
                        className="inline-flex items-center gap-2 rounded-full bg-gray-950 py-1.5 pl-4 pr-1.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                      >
                        Read more
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#3ddc6e] text-black transition group-hover:translate-x-0.5">
                          <HiArrowRight
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* video popup */}
      {playing?.video && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={playing.title}
          onClick={() => setPlaying(null)}
          className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl"
          >
            <button
              type="button"
              onClick={() => setPlaying(null)}
              aria-label="Close video"
              className="absolute -top-12 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/10 text-white transition hover:bg-[#3ddc6e] hover:text-black"
            >
              <HiXMark className="h-5 w-5" />
            </button>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${playing.video}?autoplay=1&rel=0`}
              title={playing.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="aspect-video w-full rounded-2xl bg-black shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;
