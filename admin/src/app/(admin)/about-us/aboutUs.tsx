/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { STAT_ICON_OPTIONS, useGetAboutUsQuery, useUpdateHeroMutation } from '@/store/aboutUsApi'
import type { AboutHero as AboutHeroData, HeroFiles, HeroText } from '@/store/aboutUsApi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
type LocalizedKey = 'title' | 'subtitle' | 'intro1' | 'intro2' | 'cta1Label' | 'cta2Label' | 'speakLabel'

const MAX_STATS = 8

const TEXT_FIELDS: { key: LocalizedKey; label: string; hint?: string; multiline?: boolean }[] = [
  { key: 'title', label: 'Title (green part)', hint: 'e.g. "Trusted Auditors"' },
  { key: 'subtitle', label: 'Subtitle (white part)', hint: 'e.g. "and Business Advisors in the UAE"' },
  { key: 'intro1', label: 'Intro paragraph 1', multiline: true },
  { key: 'intro2', label: 'Intro paragraph 2', multiline: true },
  { key: 'cta1Label', label: 'Button 1 label' },
  { key: 'cta2Label', label: 'Button 2 label' },
  { key: 'speakLabel', label: 'Line under the buttons' },
]

const IMAGE_GROUPS = [
  { key: 'heroImage', label: 'Hero photo (right side)', fields: { en: 'heroImageEn', ar: 'heroImageAr' } },
  { key: 'bgImage', label: 'Dark background image', fields: { en: 'heroBgEn', ar: 'heroBgAr' } },
] as const

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

// Same rule as the backend: a path, an anchor, or an http(s) URL
const isSafeHref = (v: string) => /^(\/|#|https?:\/\/)/i.test(v.trim())

// uid gives each stat row a stable React key while rows are added, moved or removed
type StatRow = { uid: number; value: string; icon: string; label: Localized }

type Draft = {
  text: Record<LocalizedKey, Localized>
  cta1Href: string
  cta2Href: string
}

/* ---------- Editor ---------- */

const Editor = ({ hero }: { hero: AboutHeroData }) => {
  const uidRef = useRef(0)
  const nextUid = () => (uidRef.current += 1)

  const [draft, setDraft] = useState<Draft>(() => ({
    text: {
      title: hero.title,
      subtitle: hero.subtitle,
      intro1: hero.intro1,
      intro2: hero.intro2,
      cta1Label: hero.cta1Label,
      cta2Label: hero.cta2Label,
      speakLabel: hero.speakLabel,
    },
    cta1Href: hero.cta1Href,
    cta2Href: hero.cta2Href,
  }))
  const [stats, setStats] = useState<StatRow[]>(() =>
    hero.stats.map((s) => ({ uid: nextUid(), value: s.value, icon: s.icon, label: { en: s.label.en, ar: s.label.ar } })),
  )
  const [files, setFiles] = useState<HeroFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [updateHero, { isLoading }] = useUpdateHeroMutation()

  const setText = (key: LocalizedKey, code: Lang, value: string) =>
    setDraft((prev) => ({ ...prev, text: { ...prev.text, [key]: { ...prev.text[key], [code]: value } } }))

  const setStat = (uid: number, patch: Partial<Omit<StatRow, 'uid'>>) => setStats((prev) => prev.map((s) => (s.uid === uid ? { ...s, ...patch } : s)))

  const setStatLabel = (uid: number, code: Lang, value: string) =>
    setStats((prev) => prev.map((s) => (s.uid === uid ? { ...s, label: { ...s.label, [code]: value } } : s)))

  const addStat = () => setStats((prev) => [...prev, { uid: nextUid(), value: '', icon: STAT_ICON_OPTIONS[0].value, label: { en: '', ar: '' } }])

  const removeStat = (uid: number) => setStats((prev) => prev.filter((s) => s.uid !== uid))

  const moveStat = (index: number, dir: -1 | 1) =>
    setStats((prev) => {
      const target = index + dir
      if (target < 0 || target >= prev.length) return prev
      const copy = [...prev]
      ;[copy[index], copy[target]] = [copy[target], copy[index]]
      return copy
    })

  const handleImage = (field: keyof HeroFiles, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      e.target.value = ''
      return
    }
    setFiles((prev) => ({ ...prev, [field]: file }))
  }

  const save = async () => {
    for (const f of TEXT_FIELDS) {
      for (const { code, name } of LANGS) {
        if (draft.text[f.key][code].trim().length < 2) {
          toast.error(`Please fill ${f.label} (${name})`)
          return
        }
      }
    }

    if (!isSafeHref(draft.cta1Href) || !isSafeHref(draft.cta2Href)) {
      toast.error('Button links must start with /, # or http(s)://')
      return
    }

    if (stats.length === 0) {
      toast.error('Add at least one stat')
      return
    }

    for (const [i, s] of stats.entries()) {
      if (!s.value.trim() || !s.label.en.trim() || !s.label.ar.trim()) {
        toast.error(`Please fill the value and both labels for stat ${i + 1}`)
        return
      }
    }

    const payload: HeroText = {
      title: trimLocalized(draft.text.title),
      subtitle: trimLocalized(draft.text.subtitle),
      intro1: trimLocalized(draft.text.intro1),
      intro2: trimLocalized(draft.text.intro2),
      cta1Label: trimLocalized(draft.text.cta1Label),
      cta1Href: draft.cta1Href.trim(),
      cta2Label: trimLocalized(draft.text.cta2Label),
      cta2Href: draft.cta2Href.trim(),
      speakLabel: trimLocalized(draft.text.speakLabel),
      stats: stats.map((s) => ({ value: s.value.trim(), icon: s.icon, label: trimLocalized(s.label) })),
    }

    try {
      await updateHero({ hero: payload, files }).unwrap()
      toast.success('About Us hero saved')
      setFiles({})
      setFileKey((k) => k + 1)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        {/* ---------- Text ---------- */}
        <h6 className="fw-bold mb-3">Hero text</h6>

        {TEXT_FIELDS.map((f) => (
          <div key={f.key} className="mb-3">
            <div className="small fw-semibold mb-1">{f.label}</div>
            <div className="row g-2">
              {LANGS.map(({ code, dir }) => (
                <div className="col-6" key={code}>
                  {f.multiline ? (
                    <textarea
                      rows={4}
                      className="form-control form-control-sm"
                      dir={dir}
                      lang={code}
                      value={draft.text[f.key][code]}
                      onChange={(e) => setText(f.key, code, e.target.value)}
                      disabled={isLoading}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      dir={dir}
                      lang={code}
                      value={draft.text[f.key][code]}
                      onChange={(e) => setText(f.key, code, e.target.value)}
                      disabled={isLoading}
                    />
                  )}
                </div>
              ))}
            </div>
            {f.hint && <small className="text-muted">{f.hint}</small>}
          </div>
        ))}

        {/* ---------- Links ---------- */}
        <div className="row g-3 mb-4">
          <div className="col-6">
            <div className="small fw-semibold mb-1">Button 1 link</div>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="/contact"
              value={draft.cta1Href}
              onChange={(e) => setDraft((p) => ({ ...p, cta1Href: e.target.value }))}
              disabled={isLoading}
            />
          </div>
          <div className="col-6">
            <div className="small fw-semibold mb-1">Button 2 link</div>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="/about"
              value={draft.cta2Href}
              onChange={(e) => setDraft((p) => ({ ...p, cta2Href: e.target.value }))}
              disabled={isLoading}
            />
          </div>
          <div className="col-12">
            <small className="text-muted">Same link for both languages. Start with /, # or http(s)://</small>
          </div>
        </div>

        {/* ---------- Stats ---------- */}
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-bold mb-0">
            Stats ({stats.length}/{MAX_STATS})
          </h6>
          <button
            type="button"
            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
            onClick={addStat}
            disabled={isLoading || stats.length >= MAX_STATS}>
            <IconifyIcon icon="solar:add-circle-broken" />
            Add stat
          </button>
        </div>

        <div className="list-group mb-4">
          {stats.map((s, index) => (
            <div key={s.uid} className="list-group-item">
              <div className="row g-2 align-items-end">
                <div className="col-md-2">
                  <label className="form-label small mb-1">Value</label>
                  <input
                    type="text"
                    maxLength={20}
                    className="form-control form-control-sm"
                    placeholder="25+"
                    value={s.value}
                    onChange={(e) => setStat(s.uid, { value: e.target.value })}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label small mb-1">Icon</label>
                  <select
                    className="form-select form-select-sm"
                    value={s.icon}
                    onChange={(e) => setStat(s.uid, { icon: e.target.value })}
                    disabled={isLoading}>
                    {STAT_ICON_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small mb-1">Label (English)</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={s.label.en}
                    onChange={(e) => setStatLabel(s.uid, 'en', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label small mb-1">Label (Arabic)</label>
                  <input
                    type="text"
                    dir="rtl"
                    lang="ar"
                    className="form-control form-control-sm"
                    value={s.label.ar}
                    onChange={(e) => setStatLabel(s.uid, 'ar', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-2 d-flex gap-1 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => moveStat(index, -1)}
                    disabled={isLoading || index === 0}
                    aria-label="Move up">
                    ↑
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-light"
                    onClick={() => moveStat(index, 1)}
                    disabled={isLoading || index === stats.length - 1}
                    aria-label="Move down">
                    ↓
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-soft-danger"
                    onClick={() => removeStat(s.uid)}
                    disabled={isLoading}
                    aria-label="Remove stat">
                    <IconifyIcon icon="solar:trash-bin-trash-broken" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- Images ---------- */}
        <h6 className="fw-bold mb-3">Images</h6>
        {IMAGE_GROUPS.map((group) => (
          <div key={group.key} className="mb-4">
            <div className="small fw-semibold mb-2">{group.label}</div>
            <div className="row g-3">
              {LANGS.map(({ code, name }) => {
                const existing = hero[group.key][code]
                const field = group.fields[code] as keyof HeroFiles

                return (
                  <div className="col-6" key={code}>
                    <div className="small text-muted mb-1">{name}</div>
                    {existing.length > 0 ? (
                      <img src={existing[0].url} alt="" className="mb-2 rounded" style={{ width: 160, height: 90, objectFit: 'cover' }} />
                    ) : (
                      <div className="small text-muted mb-2">No image yet</div>
                    )}
                    <input
                      key={`${fileKey}-${field}`}
                      type="file"
                      accept="image/*"
                      className="form-control form-control-sm"
                      onChange={(e) => handleImage(field, e)}
                      disabled={isLoading}
                    />
                    <small className="text-muted">A new image replaces the current one.</small>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save hero'}
        </button>
      </div>
    </div>
  )
}

/* ---------- Page body ---------- */

const AboutHero = () => {
  const { data, isLoading, isError, refetch } = useGetAboutUsQuery()

  if (isLoading) return <div className="p-3 text-muted">Loading...</div>

  if (isError || !data?.hero) {
    return (
      <div className="p-3">
        <p className="text-danger mb-2">Could not load the content.</p>
        <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">About Us: Hero</h5>

      {/* key remounts the editor after a save, so it shows the new values */}
      <Editor key={data.updatedAt} hero={data.hero} />
    </div>
  )
}

export default AboutHero
