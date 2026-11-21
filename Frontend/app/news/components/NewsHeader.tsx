"use client";

import Breadcrumb from "@/app/components/Breadcrumb";
import { useLang } from "@/app/services/hooks/useLang";
import { getNewsLabels } from "@/app/news/labels";

/** Page banner for /news. Client component so the text follows the language toggle. */
const NewsHeader = () => {
  const lang = useLang();
  const t = getNewsLabels(lang);

  return (
    <Breadcrumb
      title={t.pageTitle}
      subtitle={t.pageSubtitle}
      image="/img/banner/bg4.avif"
      crumbs={[]}
    />
  );
};

export default NewsHeader;
