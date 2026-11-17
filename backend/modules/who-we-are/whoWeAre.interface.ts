import { Document, Types } from "mongoose";

// Icon keys the frontend maps to react-icons
export const WHO_ICONS = [
  "award",
  "badge",
  "shield",
  "globe",
  "layers",
  "pin",
] as const;
export type WhoIcon = (typeof WHO_ICONS)[number];

export interface ILocalizedString {
  en: string;
  ar: string;
}

// One card in the "Firm Snapshot" panel
export interface IWhoWeAreItem {
  _id: Types.ObjectId;
  icon: WhoIcon;
  label: ILocalizedString; // "Established", "Licence No.", ...
  value: ILocalizedString; // "Since 2000", "30008692", ...
  note: ILocalizedString; // optional small line under the value
  order: number;
}

// Single document for the whole "Who We Are" block
export interface IWhoWeAreSection extends Document {
  eyebrow: ILocalizedString; // "WHO WE ARE" pill
  headlinePrefix: ILocalizedString; // "Building trust through"
  highlight: ILocalizedString; // "expertise" (green, underlined)
  headlineSuffix: ILocalizedString; // "and integrity."
  brandName: ILocalizedString; // bold firm name at the start of the paragraph
  body: ILocalizedString; // paragraph text after the firm name
  quote: ILocalizedString; // pull quote box
  ctaLabel: ILocalizedString; // "Explore Our Services"
  ctaHref: ILocalizedString; // link per language
  watermark: ILocalizedString; // script text bottom-right ("Your Growth Partner")
  snapshotTitle: ILocalizedString; // "Firm Snapshot"
  snapshotTagline: ILocalizedString; // "Everything you need. Under one roof."
  snapshotItems: IWhoWeAreItem[];
  createdAt: Date;
  updatedAt: Date;
}
