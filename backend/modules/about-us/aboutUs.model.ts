import { Schema, model } from "mongoose";
import { IAboutUs } from "./aboutUs.interface";

const localizedString = {
  en: { type: String, default: "", trim: true },
  ar: { type: String, default: "", trim: true },
};

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: "" },
  },
  { _id: false },
);

const localizedMedia = {
  en: { type: [mediaSchema], default: [] },
  ar: { type: [mediaSchema], default: [] },
};

const aboutUsSchema = new Schema<IAboutUs>(
  {
    hero: {
      title: localizedString,
      subtitle: localizedString,
      intro1: localizedString,
      intro2: localizedString,
      cta1Label: localizedString,
      cta1Href: { type: String, default: "/contact", trim: true },
      cta2Label: localizedString,
      cta2Href: { type: String, default: "/about", trim: true },
      speakLabel: localizedString,
      heroImage: localizedMedia,
      bgImage: localizedMedia,
      stats: [
        {
          value: { type: String, default: "" },
          label: localizedString,
          icon: { type: String, default: "building" },
        },
      ],
    },
    whoWeAre: {
      badge: localizedString,
      title: localizedString,
      text: localizedString,
      quote: localizedString,
      buttonLabel: localizedString,
      buttonHref: { type: String, default: "/services", trim: true },
      scriptText: localizedString,
      bgImage: localizedMedia,
      headerImage: localizedMedia,
      snapshotItems: [
        {
          label: localizedString,
          value: localizedString,
          text: localizedString,
          icon: { type: String, default: "award" },
        },
      ],
    },
    ourStory: {
      badge: localizedString,
      narrative: localizedString,
      bgImage: localizedMedia,
      steps: [
        {
          number: { type: String, default: "01" },
          title: localizedString,
          text: localizedString,
          image: localizedMedia,
        },
      ],
      quote: localizedString,
      authorName: localizedString,
      authorRole: localizedString,
      authorImage: localizedMedia,
    },
    ourValues: {
      label: localizedString,
      title: localizedString,
      values: [
        {
          number: { type: String, default: "01" },
          title: localizedString,
          text: localizedString,
          icon: { type: String, default: "target" },
        },
      ],
    },
    nextChapter: {
      badge: localizedString,
      title: localizedString,
      description: localizedString,
      scriptTagline: localizedString,
      bgImage: localizedMedia,
      countries: [
        {
          name: localizedString,
          image: localizedMedia,
        },
      ],
    },
  },
  { timestamps: true },
);

export const AboutUs = model<IAboutUs>("AboutUs", aboutUsSchema);
