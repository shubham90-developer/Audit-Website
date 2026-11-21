import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";

import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import LanguageToggle from "./components/LanguageToggle";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Suspense } from "react";
import StoreProvider from "./store/StoreProvider";

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  display: "swap",
});

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/v1/api";

const DEFAULT_NAME = "Ahmed Al Mazroei Auditing & Accounting";
const DEFAULT_DESCRIPTION =
  "Audit, tax and accounting services in Abu Dhabi, UAE.";

type SiteMeta = {
  companyName?: { en: string; ar: string };
  footerDescription?: { en: string; ar: string };
  favicon?: { url: string };
};

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Reads the site settings on the server (name, description, favicon). Fails quietly. */
const getSiteMeta = async (): Promise<SiteMeta | null> => {
  try {
    const res = await fetch(`${API_URL}/settings`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: SiteMeta };
    return json.data ?? null;
  } catch {
    return null;
  }
};

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getSiteMeta();
  const name = stripHtml(meta?.companyName?.en) || DEFAULT_NAME;
  const description =
    stripHtml(meta?.footerDescription?.en) || DEFAULT_DESCRIPTION;
  const favicon = meta?.favicon?.url;

  return {
    title: { default: name, template: `%s | ${name}` },
    description,
    ...(favicon
      ? { icons: { icon: favicon, shortcut: favicon, apple: favicon } }
      : {}),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunitoSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <StoreProvider>
          <TopBar />

          <Suspense fallback={<nav className="h-16 w-full bg-[#210052]" />}>
            <NavBar />
          </Suspense>

          {children}

          <LanguageToggle />

          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
