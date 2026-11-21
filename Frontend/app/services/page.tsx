"use client";

import React from "react";
import Services from "./components/Services";
import Breadcrumb from "../components/Breadcrumb";
import { useLang } from "@/app/services/hooks/useLang";
import { useGetServicesBannerQuery } from "@/app/store/api/servicesApi";
import { pickMedia } from "@/app/services/utils/service";

// Shown until the API answers (or if it fails). Same as the backend defaults.
const FALLBACK = {
  title: {
    en: "Professional Accounting, Tax & Business Services",
    ar: "خدمات المحاسبة والضرائب والأعمال المهنية",
  },
  subtitle: {
    en: "Tax, accounting, audit and company formation under one roof, across borders. Six groups, one senior team, and the same people from the first call to the filing.",
    ar: "الضرائب والمحاسبة والتدقيق وتأسيس الشركات تحت سقف واحد وعبر الحدود. ست مجموعات، وفريق واحد من كبار الخبراء، ونفس الأشخاص من أول مكالمة حتى تقديم الإقرارات.",
  },
  image: "/img/banner/bg2.avif",
};

const ServicesPage = () => {
  const lang = useLang();
  const { data: banner } = useGetServicesBannerQuery();

  const title = banner?.title?.[lang]?.trim() || FALLBACK.title[lang];
  const subtitle = banner?.subtitle?.[lang]?.trim() || FALLBACK.subtitle[lang];
  const image = pickMedia(banner?.bgImage, lang) || FALLBACK.image;

  return (
    <>
      <Breadcrumb title={title} subtitle={subtitle} image={image} />
      <Services />
    </>
  );
};

export default ServicesPage;
