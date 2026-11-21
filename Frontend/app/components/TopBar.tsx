"use client";

import Link from "next/link";
import type { ElementType } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { useLang } from "@/app/services/hooks/useLang";
import {
  useGetSiteSettingsQuery,
  type SettingsLocalized,
  type SiteSettings,
} from "@/app/store/api/siteSettingsApi";

type Lang = "en" | "ar";

type ContactItem = {
  key: string;
  Icon: ElementType;
  title: string;
  href?: string;
  className: string;
};

type SocialItem = {
  name: string;
  href: string;
  Icon: ElementType;
};

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
const pickText = (value: SettingsLocalized | undefined, lang: Lang) => {
  const other: Lang = lang === "en" ? "ar" : "en";
  return stripHtml(value?.[lang] || value?.[other] || "");
};

const SocialSkeleton = () => (
  <span
    aria-hidden="true"
    className="h-7 w-7 animate-pulse rounded-full bg-white/10"
  />
);

const ContactSkeleton = () => (
  <span
    aria-hidden="true"
    className="h-7 w-40 animate-pulse rounded-full bg-white/10"
  />
);

const TopBar = () => {
  const lang = useLang();
  const { data, isLoading, isError } = useGetSiteSettingsQuery();

  const phone = data?.phone?.trim() ?? "";
  const email = data?.email?.trim() ?? "";
  const address = data ? pickText(data.address, lang) : "";
  const followLabel = data ? pickText(data.headerFollowTitle, lang) : "";
  const mapsUrl = data?.googleMapsUrl?.trim() ?? "";

  // Only show contact items that have a value in the settings.
  const contactItems: ContactItem[] = [];
  if (phone) {
    contactItems.push({
      key: "phone",
      Icon: FaPhoneAlt,
      title: phone,
      href: `tel:${phone.replace(/\s+/g, "")}`,
      className: "hidden sm:flex",
    });
  }
  if (email) {
    contactItems.push({
      key: "email",
      Icon: FaEnvelope,
      title: email,
      href: `mailto:${email}`,
      className: "hidden md:flex",
    });
  }
  if (address) {
    contactItems.push({
      key: "address",
      Icon: FaMapMarkerAlt,
      title: address,
      href: mapsUrl || undefined,
      className: "hidden xl:flex",
    });
  }

  // Only show social links that have a URL in the settings.
  const socials = buildSocials(data?.socials).filter((item) =>
    Boolean(item.href),
  );

  return (
    <div className="relative z-50 w-full border-b border-white/10 bg-[#171a18] text-white">
      <div className="mx-auto flex max-w-8xl flex-col items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:flex-row lg:px-8">
        {/* Contact Information */}
        <div className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:w-auto lg:justify-start lg:gap-x-7">
          {isLoading && (
            <>
              <ContactSkeleton />
              <ContactSkeleton />
            </>
          )}

          {!isLoading &&
            !isError &&
            contactItems.map(({ key, Icon, title, href, className }) => {
              const content = (
                <>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[#fc2814] transition-all duration-300 group-hover:border-[#007d32]/40 group-hover:bg-[#007d32] group-hover:text-white">
                    <Icon size={11} />
                  </span>

                  <span className="text-[11px] font-medium tracking-wide text-gray-300 transition-colors duration-300 group-hover:text-white">
                    {title}
                  </span>
                </>
              );

              const itemClass = `group items-center gap-2.5 ${className}`;

              if (!href) {
                return (
                  <span key={key} title={title} className={itemClass}>
                    {content}
                  </span>
                );
              }

              return (
                <Link
                  key={key}
                  href={href}
                  target={href.startsWith("https") ? "_blank" : undefined}
                  rel={
                    href.startsWith("https") ? "noopener noreferrer" : undefined
                  }
                  aria-label={title}
                  title={title}
                  className={itemClass}
                >
                  {content}
                </Link>
              );
            })}
        </div>

        {/* Right Section */}
        {(isLoading || socials.length > 0) && (
          <div className="flex w-full items-center justify-center gap-4 lg:w-auto lg:justify-end">
            {isLoading ? (
              <>
                <SocialSkeleton />
                <SocialSkeleton />
                <SocialSkeleton />
              </>
            ) : (
              <>
                {followLabel && (
                  <span className="hidden text-[10px] font-semibold uppercase tracking-[1.5px] text-gray-400 sm:block">
                    {followLabel}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  {socials.map(({ name, href, Icon }) => (
                    <Link
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      title={name}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-[#fc2814] hover:bg-[#fc2814] hover:text-white hover:shadow-lg hover:shadow-[#b6ce8b]/10"
                    >
                      <Icon size={11} />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/** Maps the settings socials to icon links (order kept from the original top bar). */
const buildSocials = (s?: SiteSettings["socials"]) => [
  { name: "Instagram", href: s?.instagram ?? "", Icon: FaInstagram },
  { name: "Facebook", href: s?.facebook ?? "", Icon: FaFacebookF },
  { name: "YouTube", href: s?.youtube ?? "", Icon: FaYoutube },
  { name: "LinkedIn", href: s?.linkedin ?? "", Icon: FaLinkedinIn },
  { name: "X", href: s?.x ?? "", Icon: FaXTwitter },
];

export default TopBar;
