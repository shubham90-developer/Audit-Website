import { Document } from "mongoose";

export interface ILocalizedString {
  en: string;
  ar: string;
}

// one counter card, e.g. "25+" / "Years" / "Years of Experience"
export interface ICounterStat {
  value: ILocalizedString;
  unit: ILocalizedString;
  label: ILocalizedString;
}

export interface ICounter extends Document {
  heading: ILocalizedString; // "Numbers speak for themselves"
  stats: ICounterStat[];
  createdAt: Date;
  updatedAt: Date;
}
