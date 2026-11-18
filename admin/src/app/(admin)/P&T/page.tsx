'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import RichTextEditor from '@/components/RichTextEditor'
import {
  useGetLegalPageQuery,
  useUpdateLegalPageMutation,
  type LegalKind,
  type LegalPage,
  type LegalSection,
  type Lang,
  type Localized,
} from '@/store/legalPageApi'
const langs: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'Arabic' },
]
const blank = (): Localized => ({ en: '', ar: '' })
const blankSection = (order: number): LegalSection => ({ title: blank(), body: blank(), bullets: [], order })
export default function LegalPagesAdmin() {
  const [kind, setKind] = useState<LegalKind>('privacy-policy')
  const { data, isLoading, isError, refetch } = useGetLegalPageQuery(kind)
  const [savePage, { isLoading: saving }] = useUpdateLegalPageMutation()
  const [draft, setDraft] = useState<LegalPage | null>(null)
  const [images, setImages] = useState<Partial<Record<Lang, File>>>({})
  useEffect(() => {
    if (data) {
      setDraft(structuredClone(data))
      setImages({})
    }
  }, [data])
  const updateText = (key: 'heroTitle' | 'heroDescription' | 'intro' | 'sidebarTitle', lang: Lang, value: string) =>
    setDraft((prev) => (prev ? { ...prev, [key]: { ...prev[key], [lang]: value } } : prev))
  const updateSection = (index: number, change: Partial<LegalSection>) =>
    setDraft((prev) => (prev ? { ...prev, sections: prev.sections.map((s, i) => (i === index ? { ...s, ...change } : s)) } : prev))
  const move = (index: number, delta: number) =>
    setDraft((prev) => {
      if (!prev) return prev
      const next = [...prev.sections]
      const to = index + delta
      if (to < 0 || to >= next.length) return prev
      ;[next[index], next[to]] = [next[to], next[index]]
      return { ...prev, sections: next.map((s, i) => ({ ...s, order: i })) }
    })
  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft) return
    try {
      await savePage({ kind, data: draft, images }).unwrap()
      toast.success('Legal page updated successfully')
      setImages({})
    } catch (e: any) {
      toast.error(e?.data?.message || 'Unable to save page')
    }
  }
  if (isLoading) return <div className="p-4">Loading legal page...</div>
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
        <h4 className="mb-0">Legal Pages</h4>
        <button className="btn btn-primary" type="submit" form="legal-form" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <div className="btn-group mb-4">
        <button className={`btn ${kind === 'privacy-policy' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setKind('privacy-policy')}>
          Privacy Policy
        </button>
        <button
          className={`btn ${kind === 'terms-and-conditions' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setKind('terms-and-conditions')}>
          Terms & Conditions
        </button>
      </div>
      <form id="legal-form" onSubmit={save}>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">Hero & Page Settings</h5>
            {(['heroTitle', 'heroDescription', 'intro', 'sidebarTitle'] as const).map((key) => (
              <div className="mb-3" key={key}>
                <label className="form-label fw-semibold">{key}</label>
                <div className="row g-3">
                  {langs.map(({ code, label }) => (
                    <div className="col-md-6" key={code}>
                      <label className="form-label small">{label}</label>
                      <RichTextEditor
                        value={draft[key][code]}
                        onChange={(value) => updateText(key, code, value)}
                        disabled={saving}
                        dir={code === 'ar' ? 'rtl' : 'ltr'}
                        lang={code}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <h6>Hero background images</h6>
            <div className="row g-3">
              {langs.map(({ code, label }) => (
                <div className="col-md-6" key={code}>
                  <label className="form-label">{label}</label>
                  {draft.heroImage?.[code]?.url && (
                    <div className="mb-2">
                      <img src={draft.heroImage[code].url} alt={`${label} hero`} style={{ maxWidth: 220, maxHeight: 110, objectFit: 'cover' }} />
                    </div>
                  )}
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImages((p) => ({ ...p, [code]: e.target.files?.[0] }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Content Sections ({draft.sections.length})</h5>
          <button
            type="button"
            className="btn btn-soft-primary"
            onClick={() => setDraft((p) => (p ? { ...p, sections: [...p.sections, blankSection(p.sections.length)] } : p))}>
            Add Section
          </button>
        </div>
        <div className="card mb-4">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>English title</th>
                  <th>Arabic title</th>
                  <th>Bullets</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {draft.sections.map((s, i) => (
                  <tr key={s._id || i}>
                    <td>{i + 1}</td>
                    <td>{s.title.en || 'Untitled'}</td>
                    <td>{s.title.ar || 'بدون عنوان'}</td>
                    <td>{s.bullets.length}</td>
                    <td>
                      <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => move(i, -1)}>
                        ↑
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => move(i, 1)}>
                        ↓
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => setDraft((p) => (p ? { ...p, sections: p.sections.filter((_, j) => j !== i) } : p))}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {draft.sections.map((section, index) => (
          <div className="card mb-3" key={section._id || index}>
            <div className="card-body">
              <h6>Section {index + 1}</h6>
              {(['title', 'body'] as const).map((key) => (
                <div className="mb-3" key={key}>
                  <label className="form-label fw-semibold">{key}</label>
                  <div className="row g-3">
                    {langs.map(({ code, label }) => (
                      <div className="col-md-6" key={code}>
                        <label className="form-label small">{label}</label>
                        <RichTextEditor
                          value={section[key][code]}
                          onChange={(value) => updateSection(index, { [key]: { ...section[key], [code]: value } })}
                          disabled={saving}
                          dir={code === 'ar' ? 'rtl' : 'ltr'}
                          lang={code}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Bullet points</strong>
                <button
                  type="button"
                  className="btn btn-sm btn-soft-primary"
                  onClick={() => updateSection(index, { bullets: [...section.bullets, blank()] })}>
                  Add Bullet
                </button>
              </div>
              {section.bullets.map((bullet, bi) => (
                <div className="row g-2 mb-2" key={bi}>
                  {langs.map(({ code, label }) => (
                    <div className="col-md-5" key={code}>
                      <RichTextEditor
                        value={bullet[code]}
                        onChange={(value) =>
                          updateSection(index, { bullets: section.bullets.map((b, j) => (j === bi ? { ...b, [code]: value } : b)) })
                        }
                        disabled={saving}
                        dir={code === 'ar' ? 'rtl' : 'ltr'}
                        lang={code}
                      />
                    </div>
                  ))}
                  <div className="col-md-2">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => updateSection(index, { bullets: section.bullets.filter((_, j) => j !== bi) })}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
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
