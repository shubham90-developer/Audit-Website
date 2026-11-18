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

export const metadata: Metadata = {
  title: "AHMED AL MAZROEI",
  description: "Welcome to my website",
};

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
