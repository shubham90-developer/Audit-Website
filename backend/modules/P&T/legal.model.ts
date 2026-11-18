import { Schema, model, models } from 'mongoose'

const localized = new Schema({ en: { type: String, default: '' }, ar: { type: String, default: '' } }, { _id: false })
const media = new Schema({ url: { type: String, default: '' }, publicId: { type: String, default: '' } }, { _id: false })
const localizedMedia = new Schema({ en: { type: media, default: () => ({}) }, ar: { type: media, default: () => ({}) } }, { _id: false })
const section = new Schema({ title: { type: localized, required: true }, body: { type: localized, required: true }, bullets: { type: [localized], default: [] }, order: { type: Number, default: 0 } })
const schema = new Schema({
  kind: { type: String, enum: ['privacy-policy', 'terms-and-conditions'], unique: true, required: true },
  heroTitle: { type: localized, required: true },
  heroDescription: { type: localized, required: true },
  heroImage: { type: localizedMedia, default: () => ({}) },
  intro: { type: localized, required: true },
  sidebarTitle: { type: localized, default: () => ({ en: 'ON THIS PAGE', ar: 'في هذه الصفحة' }) },
  sections: { type: [section], default: [] },
}, { timestamps: true })
export const LegalPage = models.LegalPage || model('LegalPage', schema)
