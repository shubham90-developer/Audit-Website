export type Lang = "en" | "ar";

export interface ILocalized {
  en: string;
  ar: string;
}

export interface IMedia {
  url: string;
  publicId: string;
}

export interface ILocalizedMedia {
  en: IMedia[];
  ar: IMedia[];
}

export interface IServiceDetail {
  title: ILocalized;
  description: ILocalized;
  img: ILocalizedMedia;
}

export interface IService {
  title: ILocalized;
  desc: ILocalized;

  iconImg: ILocalizedMedia;
  cardImg: ILocalizedMedia;
  mainImg: ILocalizedMedia;

  bgImage: ILocalizedMedia;
  bgVideo: ILocalizedMedia;

  details: IServiceDetail[];

  createdAt?: Date;
  updatedAt?: Date;
}
