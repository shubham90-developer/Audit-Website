"use client";

import Image from "next/image";
import { HiArrowUpRight, HiOutlineMapPin } from "react-icons/hi2";

import { useLang } from "@/app/services/hooks/useLang";
import { useGetSiteSettingsQuery } from "@/app/store/api/siteSettingsApi";

/* ----------------------------- Content ----------------------------- */

const BG_IMAGE = "/img/banner/bg10.avif"; // skyline image
const LANDMARK = "/img/banner/uae-tower.avif"; // transparent PNG, pokes above the card
const TOP_FILL = "#ffffff"; // colour of the section above, so the curve blends in

type Lang = "en" | "ar";

/** Plain text from HTML (admin rich-text fields are saved as HTML). */
const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

/** Plain text in the active language, falling back to the other one when empty. */
const pickText = (
  value: { en: string; ar: string } | undefined,
  lang: Lang,
) => {
  const other: Lang = lang === "en" ? "ar" : "en";
  return stripHtml(value?.[lang]) || stripHtml(value?.[other]);
};

/** Accepts the embed URL, or the whole iframe code copied from Google Maps. */
const extractEmbedSrc = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const fromIframe = trimmed.match(/src="([^"]+)"/);
  const url = (fromIframe ? fromIframe[1] : trimmed).replace(/&amp;/g, "&");
  const isGoogleEmbed =
    /^https:\/\/www\.google\.com\/maps\/embed/.test(url) ||
    /^https:\/\/www\.google\.com\/maps\?.*output=embed/.test(url);
  return isGoogleEmbed ? url : "";
};

/** Exact place coordinates from a full Google Maps place URL (the !3d…!4d… values). Short links cannot be read. */
const parseCoords = (url: string) => {
  const match = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  return match ? `${match[1]},${match[2]}` : "";
};

/** Map embed: uses the saved URL when it is already an embed link, otherwise searches the query (coordinates or company name + address). */
const buildEmbedSrc = (mapsUrl: string, query: string) => {
  if (mapsUrl.includes("/maps/embed")) return mapsUrl;
  if (!query) return "";
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
};

/** "Open in Google Maps" link: the saved URL (unless it is an embed link), otherwise a search. */
const buildMapsLink = (mapsUrl: string, address: string) => {
  if (mapsUrl && !mapsUrl.includes("/maps/embed")) return mapsUrl;
  if (!address) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
};

/* ---------------------------- Component ----------------------------- */

const MapSection = () => {
  const lang = useLang();
  const { data, isLoading, isError } = useGetSiteSettingsQuery();

  const address = data ? pickText(data.address, lang) : "";
  const mapsUrl = data?.googleMapsUrl?.trim() ?? "";
  const companyName = data ? pickText(data.companyName, lang) : "";

  // Search by business name + address so the pin lands on the office, not just the street.
  const mapQuery = data
    ? [stripHtml(data.companyName?.en), stripHtml(data.address?.en)]
        .filter(Boolean)
        .join(", ")
    : "";
  // Saved embed (admin field) first; otherwise derive it from the Maps URL or the address.
  const embedSrc =
    extractEmbedSrc(data?.mapEmbedUrl ?? "") ||
    buildEmbedSrc(mapsUrl, parseCoords(mapsUrl) || mapQuery);
  const mapsLink = buildMapsLink(mapsUrl, address);

  return (
    <section className="relative isolate -mt-px  bg-black px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-36 lg:pt-40">
      {/* background image + light green fade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url('${BG_IMAGE}')` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-[#3ddc6e]/45 via-[#3ddc6e]/15 to-black/90"
      />

      {/* top curve */}
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-10 w-full overflow-visible lg:h-14"
      >
        <path d="M0 0H1440V60Q720 -60 0 60Z" fill={TOP_FILL} />
        <path
          d="M0 60Q720 -60 1440 60"
          fill="none"
          stroke="#3ddc6e"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative mx-auto flex max-w-6xl flex-col rounded-3xl shadow-2xl lg:flex-row">
        {/* Left: details */}
        <div className="relative rounded-t-3xl border border-[#3ddc6e]/30 bg-linear-to-b from-[#0f1f15] to-[#07090a] p-6 pt-48 text-white sm:p-8 sm:pt-52 lg:w-[45%] lg:rounded-l-3xl lg:rounded-tr-none">
          <Image
            src={LANDMARK}
            alt=""
            width={200}
            height={300}
            className="absolute -top-10 left-6 h-56 w-auto sm:left-8"
          />

          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Start Your Business
            <br />
            in UAE <span className="text-[#3ddc6e]">Now</span>
          </h2>
          <span className="mt-5 block h-0.5 w-12 bg-[#3ddc6e]" />

          {/* address */}
          <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-6">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#3ddc6e]/40 bg-white/5 text-[#3ddc6e]">
              <HiOutlineMapPin className="h-4 w-4" aria-hidden="true" />
            </span>

            {isLoading && (
              <div aria-busy="true" className="w-full space-y-2">
                <span
                  aria-hidden="true"
                  className="block h-3 w-full animate-pulse rounded bg-white/10"
                />
                <span
                  aria-hidden="true"
                  className="block h-3 w-3/5 animate-pulse rounded bg-white/10"
                />
              </div>
            )}

            {!isLoading && isError && (
              <p role="alert" className="text-xs leading-6 text-white/80">
                Unable to load the address right now.
              </p>
            )}

            {!isLoading && !isError && address && (
              <address className="text-xs not-italic leading-6 text-white/80">
                <span className="block text-white">{address}</span>
                {mapsLink && (
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 font-semibold text-[#3ddc6e] hover:underline"
                  >
                    Open in Google Maps
                    <HiArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </address>
            )}
          </div>
        </div>

        {/* Right: map */}
        <div className="relative h-80 overflow-hidden rounded-b-3xl border border-[#3ddc6e]/30 sm:h-96 lg:h-auto lg:flex-1 lg:rounded-b-none lg:rounded-r-3xl">
          {embedSrc ? (
            <iframe
              src={embedSrc}
              title={`Map: ${companyName || address}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            isLoading && (
              <div
                aria-hidden="true"
                className="absolute inset-0 animate-pulse bg-white/5"
              />
            )
          )}
          {/* fade from the dark panel into the map */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-[#07090a] to-transparent lg:inset-y-0 lg:right-auto lg:h-auto lg:w-20 lg:bg-linear-to-r"
          />
        </div>
      </div>
    </section>
  );
};

export default MapSection;
