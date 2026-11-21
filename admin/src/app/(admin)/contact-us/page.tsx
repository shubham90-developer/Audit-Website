'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import RichTextEditor from '@/components/RichTextEditor'
import { useGetContactContentQuery, useUpdateContactContentMutation } from '@/store/contactContentApi'
import type { ContactContent, ContactContentText, ContactContentFiles, TextKey, ContactCard, ContactFeature } from '@/store/contactContentApi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'Arabic', dir: 'rtl' },
] as const
const localized = (): Localized => ({ en: '', ar: '' })
const textFields: { key: TextKey; label: string }[] = [
  { key: 'heroBadge', label: 'Hero badge' },
  { key: 'heroTitle', label: 'Hero title' },
  { key: 'heroHighlight', label: 'Hero highlighted title' },
  { key: 'heroDescription', label: 'Hero description' },
  { key: 'sectionBadge', label: 'Content badge' },
  { key: 'sectionTitle', label: 'Content title' },
  { key: 'sectionHighlight', label: 'Content highlighted title' },
  { key: 'sectionDescription', label: 'Content description' },
  { key: 'sectionNote', label: 'Content bold note' },
  { key: 'formTitle', label: 'Consultation form heading (text only)' },
  { key: 'formDescription', label: 'Consultation form description (text only)' },
  { key: 'formDisclaimer', label: 'Consultation form disclaimer (text only)' },
]
const mediaFields = [
  { key: 'heroBgImage', label: 'Hero background image', kind: 'image' },
  { key: 'heroVideo', label: 'Hero right video', kind: 'video' },
  { key: 'sectionBgImage', label: 'Content background image', kind: 'image' },
] as const
const newCard = (): ContactCard => ({ key: 'phone', label: localized(), value: localized(), href: '', order: 0, isActive: true })
const newFeature = (): ContactFeature => ({ icon: 'headphones', title: localized(), description: localized(), order: 0, isActive: true })
export default function ContactContentAdminPage() {
  const { data, isLoading, isError, refetch } = useGetContactContentQuery()
  const [update, { isLoading: saving }] = useUpdateContactContentMutation()
  const [draft, setDraft] = useState<ContactContent | null>(null)
  const [files, setFiles] = useState<ContactContentFiles>({})
  useEffect(() => {
    if (data) setDraft(structuredClone(data))
  }, [data])
  const setText = (key: TextKey, lang: 'en' | 'ar', value: string) =>
    setDraft((prev) => (prev ? { ...prev, [key]: { ...prev[key], [lang]: value } } : prev))
  const setCard = (index: number, patch: Partial<ContactCard>) =>
    setDraft((prev) => (prev ? { ...prev, contactCards: prev.contactCards.map((v, i) => (i === index ? { ...v, ...patch } : v)) } : prev))
  const setFeature = (index: number, patch: Partial<ContactFeature>) =>
    setDraft((prev) => (prev ? { ...prev, features: prev.features.map((v, i) => (i === index ? { ...v, ...patch } : v)) } : prev))
  const save = async () => {
    if (!draft) return
    const payload: ContactContentText = Object.fromEntries(textFields.map((f) => [f.key, draft[f.key]])) as unknown as ContactContentText
    payload.contactCards = draft.contactCards
    payload.features = draft.features
    try {
      await update({ data: payload, files }).unwrap()
      setFiles({})
      toast.success('Contact content updated')
    } catch (e: any) {
      toast.error(e?.data?.message || 'Unable to update contact content')
    }
  }
  if (isLoading) return <div className="p-4">Loading contact content...</div>
  if (isError)
    return (
      <div className="p-4">
        Could not load contact content.{' '}
        <button className="btn btn-primary" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    )
  if (!draft) return null
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h4 className="mb-0">Contact Us </h4>
        <button className="btn btn-primary" disabled={saving} onClick={save}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <h5>Hero & Contact Section Text</h5>
          {textFields.map((field) => (
            <div className="mb-3" key={field.key}>
              <label className="form-label fw-semibold">{field.label}</label>
              <div className="row g-3">
                {LANGS.map((lang) => (
                  <div className="col-12 col-lg-6" key={lang.code}>
                    <label className="form-label small">{lang.label}</label>
                    <RichTextEditor
                      value={draft[field.key][lang.code]}
                      disabled={saving}
                      dir={lang.dir}
                      lang={lang.code}
                      onChange={(value) => setText(field.key, lang.code, value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="mb-3">Images & Video</h5>
          {mediaFields.map((field) => (
            <div key={field.key} className="mb-4">
              <h6>{field.label}</h6>
              <div className="row g-3">
                {LANGS.map((lang) => {
                  const fileKey = `${field.key}${lang.code === 'en' ? 'En' : 'Ar'}` as keyof ContactContentFiles
                  const current = draft[field.key][lang.code][0]?.url
                  return (
                    <div className="col-12 col-lg-6" key={lang.code}>
                      <label className="form-label">{lang.label}</label>
                      {current &&
                        (field.kind === 'image' ? (
                          <img
                            src={current}
                            alt={field.label}
                            className="d-block rounded mb-2"
                            style={{ width: '100%', maxWidth: 220, maxHeight: 120, objectFit: 'cover' }}
                          />
                        ) : (
                          <video src={current} controls className="d-block mb-2" style={{ width: '100%', maxWidth: 220, maxHeight: 120 }} />
                        ))}
                      <input
                        className="form-control"
                        type="file"
                        accept={field.kind === 'image' ? 'image/*' : 'video/*'}
                        disabled={saving}
                        onChange={(e) => setFiles((prev) => ({ ...prev, [fileKey]: e.target.files?.[0] }))}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h5 className="mb-0">Contact Cards</h5>
            <button
              className="btn btn-soft-primary"
              disabled={saving}
              onClick={() =>
                setDraft((prev) =>
                  prev ? { ...prev, contactCards: [...prev.contactCards, { ...newCard(), order: prev.contactCards.length }] } : prev,
                )
              }>
              Add Card
            </button>
          </div>
          {draft.contactCards.map((card, index) => (
            <div className="border rounded p-3 mb-3" key={card._id || index}>
              <div className="row g-2 align-items-end">
                <div className="col-12 col-md-6 col-xl-4">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={card.key} onChange={(e) => setCard(index, { key: e.target.value as ContactCard['key'] })}>
                    {['phone', 'email', 'whatsapp', 'address'].map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-6 col-xl-5">
                  <label className="form-label">Link (tel:, mailto:, https:)</label>
                  <input className="form-control" value={card.href} onChange={(e) => setCard(index, { href: e.target.value })} />
                </div>
                <div className="col-6 col-md-4 col-xl-2">
                  <label className="form-label">Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={card.order}
                    onChange={(e) => setCard(index, { order: Number(e.target.value) })}
                  />
                </div>
                <div className="col-6 col-md-4 col-xl-1">
                  <button
                    className="btn btn-soft-danger"
                    onClick={() => setDraft((prev) => (prev ? { ...prev, contactCards: prev.contactCards.filter((_, i) => i !== index) } : prev))}>
                    Delete
                  </button>
                </div>
              </div>
              {(['label', 'value'] as const).map((key) => (
                <div className="mt-3" key={key}>
                  <label className="form-label fw-semibold">{key}</label>
                  <div className="row g-2">
                    {LANGS.map((lang) => (
                      <div className="col-12 col-lg-6" key={lang.code}>
                        <label className="small">{lang.label}</label>
                        <RichTextEditor
                          value={card[key][lang.code]}
                          disabled={saving}
                          dir={lang.dir}
                          lang={lang.code}
                          onChange={(value) => setCard(index, { [key]: { ...card[key], [lang.code]: value } })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <label className="form-check mt-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={card.isActive}
                  onChange={(e) => setCard(index, { isActive: e.target.checked })}
                />
                Active
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h5 className="mb-0">Feature Highlights</h5>
            <button
              className="btn btn-soft-primary"
              disabled={saving}
              onClick={() =>
                setDraft((prev) => (prev ? { ...prev, features: [...prev.features, { ...newFeature(), order: prev.features.length }] } : prev))
              }>
              Add Feature
            </button>
          </div>
          {draft.features.map((feature, index) => (
            <div className="border rounded p-3 mb-3" key={feature._id || index}>
              <div className="row g-2">
                <div className="col-12 col-md-6 col-xl-5">
                  <label className="form-label">Icon</label>
                  <select
                    className="form-select"
                    value={feature.icon}
                    onChange={(e) => setFeature(index, { icon: e.target.value as ContactFeature['icon'] })}>
                    {['headphones', 'clock', 'users', 'shield'].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={feature.order}
                    onChange={(e) => setFeature(index, { order: Number(e.target.value) })}
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <label className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={feature.isActive}
                      onChange={(e) => setFeature(index, { isActive: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button
                    className="btn btn-soft-danger"
                    onClick={() => setDraft((prev) => (prev ? { ...prev, features: prev.features.filter((_, i) => i !== index) } : prev))}>
                    Delete
                  </button>
                </div>
              </div>
              {(['title', 'description'] as const).map((key) => (
                <div className="mt-3" key={key}>
                  <label className="form-label fw-semibold">{key}</label>
                  <div className="row g-2">
                    {LANGS.map((lang) => (
                      <div className="col-12 col-lg-6" key={lang.code}>
                        <label className="small">{lang.label}</label>
                        <RichTextEditor
                          value={feature[key][lang.code]}
                          disabled={saving}
                          dir={lang.dir}
                          lang={lang.code}
                          onChange={(value) => setFeature(index, { [key]: { ...feature[key], [lang.code]: value } })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <button className="btn btn-primary" disabled={saving} onClick={save}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}
