import { Document } from "mongoose";

export const STEP_ICONS = ["chat", "document", "team", "check"] as const;
export type StepIcon = (typeof STEP_ICONS)[number];

export interface Localized {
  en: string;
  ar: string;
}

export interface IHowWeWorkStep {
  title: Localized;
  description: Localized;
  icon: StepIcon;
}

export interface IHowWeWork extends Document {
  singleton: boolean;
  label: Localized;
  heading: Localized;
  videoUrl: string;
  image: {
    en: { url: string; publicId: string };
    ar: { url: string; publicId: string };
  };
  steps: IHowWeWorkStep[];
  createdAt: Date;
  updatedAt: Date;
}
