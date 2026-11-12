import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import TopBar from "./components/TopBar";
import NavBar from "./components/NavBar";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "./components/Footer";
import { Suspense } from "react";
import LanguageToggle from "./components/LanguageToggle";
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
        <TopBar />
        <Suspense fallback={<nav className="h-16 w-full bg-[#210052]" />}>
          <NavBar />
        </Suspense>
        {children}
        <LanguageToggle />
        <Footer />
      </body>
    </html>
  );
}
