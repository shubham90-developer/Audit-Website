import { Schema, model, models } from "mongoose";

const localized = new Schema(
  { en: { type: String, default: "" }, ar: { type: String, default: "" } },
  { _id: false },
);
const media = new Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
  },
  { _id: false },
);
const localizedMedia = new Schema(
  {
    en: { type: media, default: () => ({}) },
    ar: { type: media, default: () => ({}) },
  },
  { _id: false },
);

const categorySchema = new Schema({
  name: { type: localized, required: true },
  slug: { type: String, required: true, trim: true },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
});
const articleSchema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, required: true },
    slug: { type: String, required: true, trim: true },
    title: { type: localized, required: true },
    excerpt: { type: localized, required: true },
    content: { type: localized, required: true },
    cardImage: { type: localizedMedia, default: () => ({}) },
    mainImage: { type: localizedMedia, default: () => ({}) },
    publishedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const blogSectionSchema = new Schema(
  {
    key: { type: String, default: "insights", unique: true },
    heroTitle: { type: localized, default: () => ({}) },
    heroDescription: { type: localized, default: () => ({}) },
    heroImage: { type: localizedMedia, default: () => ({}) },
    exploreLabel: {
      type: localized,
      default: () => ({ en: "Insights & Resources", ar: "المقالات والموارد" }),
    },
    categories: { type: [categorySchema], default: [] },
    articles: { type: [articleSchema], default: [] },
  },
  { timestamps: true },
);

export const BlogSection =
  models.BlogSection || model("BlogSection", blogSectionSchema);
