'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  useGetTestimonialSectionQuery,
  useUpdateTestimonialSectionMutation,
  type TestimonialSection,
  type Testimonial,
  type Localized,
} from '@/store/testimonialApi'

type Lang = 'en' | 'ar'
const langs: { code: Lang; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
]
const localized = (): Localized => ({ en: '', ar: '' })
const newItem = (): Testimonial => ({
  clientName: localized(),
  review: localized(),
  platform: 'google',
  rating: 5,
  order: 0,
  active: true,
})
const fields: {
  key: keyof Pick<
    TestimonialSection,
    'eyebrow' | 'heading' | 'googlePrefix' | 'googleSuffix' | 'trustpilotPrefix' | 'trustpilotRating' | 'trustpilotSuffix'
  >
  label: string
}[] = [
  { key: 'eyebrow', label: 'Small heading (CLIENT FEEDBACK)' },
  { key: 'heading', label: 'Main heading' },
  { key: 'googlePrefix', label: 'Google prefix (Based on)' },
  { key: 'googleSuffix', label: 'Google suffix (Google Reviews)' },
  { key: 'trustpilotPrefix', label: 'Trustpilot prefix (Rated)' },
  { key: 'trustpilotRating', label: 'Trustpilot rating (Excellent)' },
  { key: 'trustpilotSuffix', label: 'Trustpilot suffix (on Trustpilot)' },
]
export default function TestimonialsAdminPage() {
  const { data, isLoading, isError, refetch } = useGetTestimonialSectionQuery()
  const [update, { isLoading: saving }] = useUpdateTestimonialSectionMutation()
  const [draft, setDraft] = useState<TestimonialSection | null>(null)
  useEffect(() => {
    if (data) setDraft(JSON.parse(JSON.stringify(data)))
  }, [data])
  const setField = (key: (typeof fields)[number]['key'], lang: Lang, value: string) => {
    setDraft((prev) => (prev ? { ...prev, [key]: { ...prev[key], [lang]: value } } : prev))
  }
  const setItem = (index: number, patch: Partial<Testimonial>) => {
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            testimonials: prev.testimonials.map((item, i) => (i === index ? { ...item, ...patch } : item)),
          }
        : prev,
    )
  }
  const setItemText = (index: number, key: 'clientName' | 'review', lang: Lang, value: string) => {
    if (!draft) return
    const item = draft.testimonials[index]
    setItem(index, { [key]: { ...item[key], [lang]: value } })
  }
  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft) return
    try {
      await update(draft).unwrap()
      toast.success('Client feedback updated successfully')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Unable to save client feedback')
    }
  }
  if (isLoading) return <div className="p-4">Loading client feedback...</div>
  if (isError)
    return (
      <div className="p-4">
        Could not load data.{' '}
        <button className="btn btn-primary" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    )
  if (!draft) return null
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Client Feedback / Testimonials</h4>
        <button form="testimonial-form" type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <form id="testimonial-form" onSubmit={save}>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">Section content</h5>
            {fields.map((field) => (
              <div className="mb-3" key={field.key}>
                <label className="form-label fw-semibold">{field.label}</label>
                <div className="row g-3">
                  {langs.map((lang) => (
                    <div className="col-md-6" key={lang.code}>
                      <label className="form-label small">{lang.name}</label>
                      <textarea
                        className="form-control"
                        rows={field.key === 'heading' ? 3 : 2}
                        dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                        value={draft[field.key][lang.code]}
                        onChange={(e) => setField(field.key, lang.code, e.target.value)}
                        disabled={saving}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <label className="form-label fw-semibold">Google review count</label>
            <input
              className="form-control"
              type="number"
              min={0}
              value={draft.googleReviewCount}
              onChange={(e) => setDraft((prev) => (prev ? { ...prev, googleReviewCount: Number(e.target.value) } : prev))}
              disabled={saving}
            />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="mb-0">Testimonials ({draft.testimonials.length})</h5>
          <button
            type="button"
            className="btn btn-soft-primary"
            disabled={saving}
            onClick={() =>
              setDraft((prev) => (prev ? { ...prev, testimonials: [...prev.testimonials, { ...newItem(), order: prev.testimonials.length }] } : prev))
            }>
            Add testimonial
          </button>
        </div>
        {draft.testimonials.map((item, index) => (
          <div className="card mb-3" key={item._id || `new-${index}`}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="mb-0">Testimonial {index + 1}</h6>
                <button
                  type="button"
                  className="btn btn-sm btn-soft-danger"
                  disabled={saving}
                  onClick={() => setDraft((prev) => (prev ? { ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) } : prev))}>
                  Delete
                </button>
              </div>
              {(['clientName', 'review'] as const).map((key) => (
                <div className="mb-3" key={key}>
                  <label className="form-label fw-semibold">{key === 'clientName' ? 'Client name' : 'Review text'}</label>
                  <div className="row g-3">
                    {langs.map((lang) => (
                      <div className="col-md-6" key={lang.code}>
                        <label className="form-label small">{lang.name}</label>
                        <textarea
                          className="form-control"
                          rows={key === 'review' ? 4 : 2}
                          dir={lang.code === 'ar' ? 'rtl' : 'ltr'}
                          value={item[key][lang.code]}
                          onChange={(e) => setItemText(index, key, lang.code, e.target.value)}
                          disabled={saving}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Platform</label>
                  <select
                    className="form-select"
                    value={item.platform}
                    onChange={(e) => setItem(index, { platform: e.target.value as Testimonial['platform'] })}
                    disabled={saving}>
                    <option value="google">Google</option>
                    <option value="trustpilot">Trustpilot</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Rating (0–5)</label>
                  <input
                    className="form-control"
                    type="number"
                    min={0}
                    max={5}
                    step={0.5}
                    value={item.rating ?? 5}
                    onChange={(e) => setItem(index, { rating: Number(e.target.value) })}
                    disabled={saving}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Order</label>
                  <input
                    className="form-control"
                    type="number"
                    value={item.order}
                    onChange={(e) => setItem(index, { order: Number(e.target.value) })}
                    disabled={saving}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-check-label">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={item.active}
                      onChange={(e) => setItem(index, { active: e.target.checked })}
                      disabled={saving}
                    />
                    Active
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
