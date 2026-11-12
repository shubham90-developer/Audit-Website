"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const TopBar = () => {
  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/almazroeiaudit/",
      Icon: FaInstagram,
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/ahmedalmazroeiaudit/",
      Icon: FaFacebookF,
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      Icon: FaYoutube,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      Icon: FaLinkedinIn,
    },
  ];

  const contactItems = [
    {
      Icon: FaPhoneAlt,
      title: " +97156 742 3428",
      href: "tel: +97156 742 3428",
      className: "hidden sm:flex",
    },
    {
      Icon: FaEnvelope,
      title: "info@almazroeiaudit.com",
      href: "mailto:info@almazroeiaudit.com",
      className: "hidden md:flex",
    },
    {
      Icon: FaMapMarkerAlt,
      title:
        "M-02, Building #19, Seashell Building, Medina St - Al Khalidiyah - W9 - Abu Dhabi",
      fullTitle:
        "M-02, Building #19, Seashell Building, Medina St - Al Khalidiyah - W9 - Abu Dhabi",
      href: "https://maps.app.goo.gl/5241Xhzk9dd5d72J8?g_st=ac",
      className: "hidden xl:flex",
    },
  ];

  return (
    <div className="relative z-50 w-full border-b border-white/10 bg-[#171a18] text-white">
      <div className="mx-auto flex max-w-8xl flex-col items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:flex-row lg:px-8">
        {/* Contact Information */}
        <div className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:w-auto lg:justify-start lg:gap-x-7">
          {contactItems.map(({ Icon, title, fullTitle, href, className }) => (
            <Link
              key={title}
              href={href}
              target={href.startsWith("https") ? "_blank" : undefined}
              rel={href.startsWith("https") ? "noopener noreferrer" : undefined}
              aria-label={fullTitle || title}
              title={fullTitle || title}
              className={`group items-center gap-2.5 ${className}`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[#fc2814] transition-all duration-300 group-hover:border-[#007d32]/40 group-hover:bg-[#007d32] group-hover:text-white">
                <Icon size={11} />
              </span>

              <span className="text-[11px] font-medium tracking-wide text-gray-300 transition-colors duration-300 group-hover:text-white">
                {title}
              </span>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex w-full items-center justify-center gap-4 lg:w-auto lg:justify-end">
          <span className="hidden text-[10px] font-semibold uppercase tracking-[1.5px] text-gray-400 sm:block">
            Follow us
          </span>

          <div className="flex items-center gap-2">
            {socialLinks.map(({ name, href, Icon }) => (
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
        </div>
      </div>
    </div>
  );
};

export default TopBar;
