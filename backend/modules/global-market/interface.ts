export type Lang = "en" | "ar";

export interface ILocalizedText {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId: string;
}

// Main section
export interface IGlobalMarketsSection {
  badge: ILocalizedText;
  title: ILocalizedText;
  highlightedTitle: ILocalizedText;
  description: ILocalizedText;
  sideTitle: ILocalizedText;
  bgImage: {
    en: IMedia[];
    ar: IMedia[];
  };
}

// Individual country card
export interface IGlobalMarket {
  title: ILocalizedText;
  image: {
    en: IMedia[];
    ar: IMedia[];
  };
  order: number;
  isActive: boolean;
}
