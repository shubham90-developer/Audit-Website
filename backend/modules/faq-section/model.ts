import { Schema, model, models } from 'mongoose'

const localized = new Schema({ en: { type: String, default: '' }, ar: { type: String, default: '' } }, { _id: false })
const media = new Schema({ url: { type: String, default: '' }, publicId: { type: String, default: '' } }, { _id: false })
const bilingualMedia = new Schema({ en: { type: media, default: () => ({}) }, ar: { type: media, default: () => ({}) } }, { _id: false })
const question = new Schema({ question: { type: localized, required: true }, answer: { type: localized, required: true }, order: { type: Number, default: 0 }, active: { type: Boolean, default: true } }, { timestamps: true })
const category = new Schema({ name: { type: localized, required: true }, order: { type: Number, default: 0 }, active: { type: Boolean, default: true }, questions: { type: [question], default: [] } }, { timestamps: true })
const schema = new Schema({ singleton: { type: String, default: 'faq-page', unique: true }, title: { type: localized, required: true }, description: { type: localized, required: true }, breadcrumbHome: { type: localized, required: true }, exploreLabel: { type: localized, required: true }, questionsLabel: { type: localized, required: true }, emptyLabel: { type: localized, required: true }, ctaTitle: { type: localized, required: true }, ctaDescription: { type: localized, required: true }, ctaButton: { type: localized, required: true }, backgroundImage: { type: bilingualMedia, default: () => ({}) }, categories: { type: [category], default: [] } }, { timestamps: true })
export const FaqSection = models.FaqSection || model('FaqSection', schema)
