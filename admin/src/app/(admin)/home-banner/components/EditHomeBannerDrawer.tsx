'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useUpdateBannerMutation } from '@/store/homeBanner'
import type { Banner, BannerText, BannerFiles, Localized, MediaFieldName } from '@/store/homeBanner'

type Texts = Record<string, Localized>
type Field = { key: string; label: string; multiline?: boolean }
type Section = { title: string; fields: Field[] }
type MediaGroup = {
  key: 'bgImages' | 'posterImage' | 'bgVideos'
  label: string
  kind: 'image' | 'video'
  fields: Record<'en' | 'ar', MediaFieldName>
}

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

const STATIC_SECTIONS: Section[] = [
  {
    title: 'Heading',
    fields: [
      { key: 'establishmentYear', label: 'Established year' },
      { key: 'titleHighlight', label: 'Title (highlighted)' },
      { key: 'titleRest', label: 'Title (rest)' },
      { key: 'intro', label: 'Intro', multiline: true },
      { key: 'speakLabel', label: 'Speak label' },
    ],
  },
  {
    title: 'Buttons',
    fields: [
      { key: 'primaryCtaLabel', label: 'Primary button label' },
      { key: 'primaryCtaHref', label: 'Primary button link' },
      { key: 'secondaryCtaLabel', label: 'Secondary button label' },
      { key: 'secondaryCtaHref', label: 'Secondary button link' },
    ],
  },
  {
    title: 'Tax agency card',
    fields: [
      { key: 'ftaLine1', label: 'Line 1' },
      { key: 'ftaLine2', label: 'Line 2' },
      { key: 'ftaLicense', label: 'License number' },
    ],
  },
  {
    title: 'Partner card',
    fields: [
      { key: 'partnerTitle', label: 'Title' },
      { key: 'partnerSubtitle', label: 'Subtitle' },
    ],
  },
  {
    title: 'Experience card',
    fields: [
      { key: 'experienceValue', label: 'Value' },
      { key: 'experienceLabel', label: 'Label' },
      { key: 'experienceTagline', label: 'Tagline' },
    ],
  },
  {
    title: 'Trust note',
    fields: [{ key: 'trustedNote', label: 'Note', multiline: true }],
  },
]

const MEDIA_GROUPS: MediaGroup[] = [
  { key: 'bgImages', label: 'Background image', kind: 'image', fields: { en: 'bgImagesEn', ar: 'bgImagesAr' } },
  { key: 'posterImage', label: 'Video poster', kind: 'image', fields: { en: 'posterImageEn', ar: 'posterImageAr' } },
  { key: 'bgVideos', label: 'Background video', kind: 'video', fields: { en: 'bgVideosEn', ar: 'bgVideosAr' } },
]

// Banner -> flat map of every localized string, keyed by field name
const flattenTexts = (b: Banner): Texts => {
  const t: Texts = {
    establishmentYear: b.establishmentYear,
    titleHighlight: b.titleHighlight,
    titleRest: b.titleRest,
    intro: b.intro,
    speakLabel: b.speakLabel,
    primaryCtaLabel: b.primaryCta.label,
    primaryCtaHref: b.primaryCta.href,
    secondaryCtaLabel: b.secondaryCta.label,
    secondaryCtaHref: b.secondaryCta.href,
    ftaLine1: b.ftaCard.line1,
    ftaLine2: b.ftaCard.line2,
    ftaLicense: b.ftaCard.licenseNumber,
    partnerTitle: b.partnerCard.title,
    partnerSubtitle: b.partnerCard.subtitle,
    experienceValue: b.experienceCard.value,
    experienceLabel: b.experienceCard.label,
    experienceTagline: b.experienceCard.tagline,
    trustedNote: b.trustedNote,
  }
  b.reviewRatings.forEach((r, i) => {
    t[`review${i}Label`] = r.label
  })
  return t
}

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })
const isEmpty = (v: Localized) => !v.en.trim() || !v.ar.trim()

// Flat map + scores -> the BannerText payload the API expects.
// Keeps variant, platform, and the other non-editable values from the original banner.
const buildPayload = (b: Banner, t: Texts, scores: number[]): BannerText => ({
  establishmentYear: trimLocalized(t.establishmentYear),
  titleHighlight: trimLocalized(t.titleHighlight),
  titleRest: trimLocalized(t.titleRest),
  intro: trimLocalized(t.intro),
  speakLabel: trimLocalized(t.speakLabel),
  primaryCta: {
    ...b.primaryCta,
    label: trimLocalized(t.primaryCtaLabel),
    href: trimLocalized(t.primaryCtaHref),
  },
  secondaryCta: {
    ...b.secondaryCta,
    label: trimLocalized(t.secondaryCtaLabel),
    href: trimLocalized(t.secondaryCtaHref),
  },
  ftaCard: {
    line1: trimLocalized(t.ftaLine1),
    line2: trimLocalized(t.ftaLine2),
    licenseNumber: trimLocalized(t.ftaLicense),
  },
  partnerCard: {
    title: trimLocalized(t.partnerTitle),
    subtitle: trimLocalized(t.partnerSubtitle),
  },
  experienceCard: {
    value: trimLocalized(t.experienceValue),
    label: trimLocalized(t.experienceLabel),
    tagline: trimLocalized(t.experienceTagline),
  },
  reviewRatings: b.reviewRatings.map((r, i) => ({
    platform: r.platform,
    score: scores[i],
    label: trimLocalized(t[`review${i}Label`]),
  })),
  trustedNote: trimLocalized(t.trustedNote),
})

const EditBannerDrawer = ({ item }: { item: Banner }) => {
  const [open, setOpen] = useState(false)
  const [updateBanner, { isLoading }] = useUpdateBannerMutation()

  const [texts, setTexts] = useState<Texts>(() => flattenTexts(item))
  const [scores, setScores] = useState<number[]>(() => item.reviewRatings.map((r) => r.score))
  const [removeIds, setRemoveIds] = useState<string[]>([])
  const [files, setFiles] = useState<BannerFiles>({})
  const [fileKey, setFileKey] = useState(0) // remounts file inputs on open to clear them
  const [showErrors, setShowErrors] = useState(false)

  const reviewFields: Field[] = item.reviewRatings.map((r, i) => ({
    key: `review${i}Label`,
    label: `Review ${i + 1} (${r.platform})`,
  }))
  const sections: Section[] = [...STATIC_SECTIONS, { title: 'Reviews', fields: reviewFields }]
  const allFields = sections.flatMap((s) => s.fields)

  // Always start from the latest saved values when the drawer opens
  const openDrawer = () => {
    setTexts(flattenTexts(item))
    setScores(item.reviewRatings.map((r) => r.score))
    setRemoveIds([])
    setFiles({})
    setShowErrors(false)
    setFileKey((k) => k + 1)
    setOpen(true)
  }

  const setLocalized = (key: string, code: 'en' | 'ar', value: string) => {
    setTexts((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))
  }

  const setScore = (index: number, value: string) => {
    setScores((prev) => prev.map((s, i) => (i === index ? Number(value) : s)))
  }

  const toggleRemove = (publicId: string) => {
    setRemoveIds((prev) => (prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]))
  }

  const handleFiles = (field: MediaFieldName, kind: 'image' | 'video', e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    const valid = selected.filter((f) => f.type.startsWith(`${kind}/`))

    if (valid.length !== selected.length) {
      toast.error(`Only ${kind} files can be added here`)
    }
    setFiles((prev) => ({ ...prev, [field]: valid }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowErrors(true)

    const missing = allFields.find((f) => isEmpty(texts[f.key]))
    if (missing) {
      toast.error(`Please fill in ${missing.label} for both languages`)
      return
    }

    if (scores.some((s) => !Number.isFinite(s) || s < 0 || s > 5)) {
      toast.error('Review scores must be between 0 and 5')
      return
    }

    try {
      await updateBanner({
        id: item._id,
        data: buildPayload(item, texts, scores),
        files,
        removePublicIds: removeIds,
      }).unwrap()

      toast.success('Banner updated successfully')
      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {/* OPEN BUTTON */}
      <button type="button" className="btn btn-soft-dark d-flex align-items-center gap-2" onClick={openDrawer} aria-label="Edit home banner">
        <IconifyIcon icon="solar:pen-2-broken" />
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* DRAWER */}
      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: '560px',
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
        }}>
        {/* HEADER */}
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Edit Home Banner</h5>
          <button
            type="button"
            className="btn btn-sm btn-danger rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 32, height: 32 }}
            onClick={() => setOpen(false)}
            aria-label="Close drawer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="p-3">
            {/* LOCALIZED TEXT: English and Arabic side by side */}
            {sections.map((section) => (
              <div key={section.title} className="mb-4">
                <h6 className="fw-bold text-uppercase text-muted small mb-2">{section.title}</h6>

                {section.fields.map((f) => (
                  <div key={f.key} className="mb-3">
                    <div className="small fw-semibold mb-1">{f.label}</div>
                    <div className="row g-2">
                      {LANGS.map(({ code, name, dir }) => {
                        const id = `editBanner-${item._id}-${f.key}-${code}`
                        const value = texts[f.key][code]
                        const invalid = showErrors && !value.trim()
                        const common = {
                          id,
                          value,
                          dir,
                          lang: code,
                          disabled: isLoading,
                          className: `form-control form-control-sm ${invalid ? 'is-invalid' : ''}`,
                          onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setLocalized(f.key, code, e.target.value),
                        }

                        return (
                          <div className="col-6" key={code}>
                            <label htmlFor={id} className="form-label small text-muted mb-1">
                              {name}
                            </label>
                            {f.multiline ? <textarea rows={3} {...common} /> : <input type="text" {...common} />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {/* Review scores sit with the review labels */}
                {section.title === 'Reviews' &&
                  item.reviewRatings.map((r, i) => (
                    <div key={`score-${i}`} className="mb-3 d-flex align-items-center gap-2">
                      <label htmlFor={`editBanner-${item._id}-score-${i}`} className="small fw-semibold mb-0" style={{ minWidth: 120 }}>
                        Score ({r.platform})
                      </label>
                      <input
                        id={`editBanner-${item._id}-score-${i}`}
                        type="number"
                        min={0}
                        max={5}
                        step={0.1}
                        className="form-control form-control-sm"
                        style={{ width: 100 }}
                        value={scores[i]}
                        onChange={(e) => setScore(i, e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  ))}
              </div>
            ))}

            {/* MEDIA: existing files (with remove) and new uploads, per language */}
            <div className="mb-2">
              <h6 className="fw-bold text-uppercase text-muted small mb-2">Media</h6>
              <p className="text-muted small mb-3">
                Tick "Remove" on existing files to delete them. New files are added alongside the ones you keep.
              </p>
            </div>

            {MEDIA_GROUPS.map((group) => (
              <div key={group.key} className="mb-4">
                <div className="fw-semibold small mb-2">{group.label}</div>

                <div className="row g-2">
                  {LANGS.map(({ code, name }) => {
                    const existing = item[group.key][code]
                    const inputId = `editBanner-${item._id}-${group.fields[code]}-${fileKey}`

                    return (
                      <div className="col-6" key={code}>
                        <div className="small text-muted mb-1">{name}</div>

                        {existing.map((m) => (
                          <div key={m.publicId} className="d-flex align-items-center gap-2 mb-2">
                            {group.kind === 'image' ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={m.url} alt="" width={56} height={56} style={{ objectFit: 'cover', borderRadius: 6 }} />
                            ) : (
                              <video src={m.url} width={56} height={56} muted style={{ objectFit: 'cover', borderRadius: 6 }} />
                            )}
                            <div className="form-check mb-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`${inputId}-rm-${m.publicId}`}
                                checked={removeIds.includes(m.publicId)}
                                onChange={() => toggleRemove(m.publicId)}
                                disabled={isLoading}
                              />
                              <label className="form-check-label small" htmlFor={`${inputId}-rm-${m.publicId}`}>
                                Remove
                              </label>
                            </div>
                          </div>
                        ))}

                        {existing.length === 0 && <div className="small text-muted mb-2">No files yet</div>}

                        <input
                          key={inputId}
                          id={inputId}
                          type="file"
                          multiple
                          accept={group.kind === 'image' ? 'image/*' : 'video/*'}
                          className="form-control form-control-sm"
                          onChange={(e) => handleFiles(group.fields[code], group.kind, e)}
                          disabled={isLoading}
                        />
                        {(files[group.fields[code]]?.length ?? 0) > 0 && (
                          <small className="text-muted">{files[group.fields[code]]!.length} new file(s) will be added</small>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="p-3 border-top d-flex gap-2">
            <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={isLoading}>
              <IconifyIcon icon="solar:diskette-broken" />
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default EditBannerDrawer
