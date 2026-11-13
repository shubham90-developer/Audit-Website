'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetWhoWeServeQuery, useUpdateSectionMutation, useDeleteCardMutation } from '@/store/whoWeServeApi'
import type { CardKind, SectionFiles, SectionText, WhoWeServeCard, WhoWeServeSection } from '@/store/whoWeServeApi'
import type { Localized } from '@/store/bannerApi'
import CardDrawer from './cardDrawer'

const LANGS = ['en', 'ar'] as const
const MIN_LENGTH = 2
const BG_FIELD = { en: 'leftBgEn', ar: 'leftBgAr' } as const

const SECTION_FIELDS: { key: keyof SectionText; label: string; multiline?: boolean }[] = [
  { key: 'pillTitle', label: 'Pill text' },
  { key: 'pillHighlight', label: 'Pill highlight (green)' },
  { key: 'whyTitle', label: 'Why heading' },
  { key: 'brandName', label: 'Brand name (green)' },
  { key: 'whyIntroStart', label: 'Intro: before bold part', multiline: true },
  { key: 'whyIntroBold', label: 'Intro: bold part', multiline: true },
  { key: 'whyIntroEnd', label: 'Intro: after bold part', multiline: true },
]

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

const pickText = (s: WhoWeServeSection): SectionText => ({
  pillTitle: s.pillTitle,
  pillHighlight: s.pillHighlight,
  whyTitle: s.whyTitle,
  brandName: s.brandName,
  whyIntroStart: s.whyIntroStart,
  whyIntroBold: s.whyIntroBold,
  whyIntroEnd: s.whyIntroEnd,
})

/* ---------- Section editor ---------- */

const SectionEditor = ({ section }: { section: WhoWeServeSection }) => {
  const [draft, setDraft] = useState<SectionText>(() => pickText(section))
  const [files, setFiles] = useState<SectionFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [updateSection, { isLoading }] = useUpdateSectionMutation()

  const setValue = (key: keyof SectionText, code: 'en' | 'ar', value: string) =>
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const handleBg = (code: 'en' | 'ar', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      e.target.value = ''
      return
    }
    setFiles((prev) => ({ ...prev, [BG_FIELD[code]]: file }))
  }

  const save = async () => {
    for (const f of SECTION_FIELDS) {
      for (const code of LANGS) {
        if (draft[f.key][code].trim().length < MIN_LENGTH) {
          toast.error(`Please fill ${f.label} (${code === 'en' ? 'English' : 'Arabic'})`)
          return
        }
      }
    }

    const data = {} as SectionText
    for (const f of SECTION_FIELDS) data[f.key] = trimLocalized(draft[f.key])

    try {
      await updateSection({ data, files }).unwrap()
      toast.success('Section saved')
      setFiles({})
      setFileKey((k) => k + 1)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Section</h6>

        {SECTION_FIELDS.map((f) => (
          <div key={f.key} className="mb-3">
            <div className="small fw-semibold mb-1">{f.label}</div>
            <div className="row g-2">
              {LANGS.map((code) => (
                <div className="col-6" key={code}>
                  {f.multiline ? (
                    <textarea
                      rows={2}
                      className="form-control form-control-sm"
                      dir={code === 'ar' ? 'rtl' : 'ltr'}
                      lang={code}
                      value={draft[f.key][code]}
                      onChange={(e) => setValue(f.key, code, e.target.value)}
                      disabled={isLoading}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      dir={code === 'ar' ? 'rtl' : 'ltr'}
                      lang={code}
                      value={draft[f.key][code]}
                      onChange={(e) => setValue(f.key, code, e.target.value)}
                      disabled={isLoading}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* LEFT PANEL BACKGROUND, per language */}
        <div className="fw-semibold small mb-2 mt-4">Left panel background</div>
        <div className="row g-3 mb-3">
          {LANGS.map((code) => {
            const existing = section.leftBg[code]
            return (
              <div className="col-6" key={code}>
                <div className="small text-muted mb-1">{code === 'en' ? 'English' : 'Arabic'}</div>
                {existing.length > 0 ? (
                  <img src={existing[0].url} alt="" className="mb-2 rounded" style={{ width: 160, height: 90, objectFit: 'cover' }} />
                ) : (
                  <div className="small text-muted mb-2">No background yet</div>
                )}
                <input
                  key={`${fileKey}-${code}`}
                  type="file"
                  accept="image/*"
                  className="form-control form-control-sm"
                  onChange={(e) => handleBg(code, e)}
                  disabled={isLoading}
                />
                <small className="text-muted">Uploading a new image replaces the current one.</small>
              </div>
            )
          })}
        </div>

        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save section'}
        </button>
      </div>
    </div>
  )
}

/* ---------- Page ---------- */

const WhoWeServeAdminPage = () => {
  const { data, isLoading, isError, refetch } = useGetWhoWeServeQuery()
  const [deleteCard] = useDeleteCardMutation()

  if (isLoading) return <div className="p-3 text-muted">Loading...</div>

  if (isError || !data) {
    return (
      <div className="p-3">
        <p className="text-danger mb-2">Could not load the content.</p>
        <button type="button" className="btn btn-sm btn-light" onClick={() => refetch()}>
          Try again
        </button>
      </div>
    )
  }

  const { section, serve, why } = data

  const nextOrderOf = (cards: WhoWeServeCard[]) => (cards.length === 0 ? 0 : Math.max(...cards.map((c) => c.order)) + 1)

  const remove = async (card: WhoWeServeCard) => {
    if (!window.confirm(`Delete "${card.title.en}"?`)) return
    try {
      await deleteCard(card._id).unwrap()
      toast.success('Card deleted')
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  const renderList = (kind: CardKind, heading: string, cards: WhoWeServeCard[]) => (
    <div className="mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h6 className="fw-bold mb-0">
          {heading} ({cards.length})
        </h6>
        <CardDrawer kind={kind} nextOrder={nextOrderOf(cards)} />
      </div>

      <div className="list-group">
        {cards.map((c) => {
          const thumb = c.image.en[0]?.url ?? c.image.ar[0]?.url

          return (
            <div key={c._id} className="list-group-item d-flex align-items-center gap-3">
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" width={48} height={48} style={{ objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                <div className="bg-light rounded" style={{ width: 48, height: 48 }} />
              )}

              <div className="flex-grow-1">
                <div className="fw-semibold">{c.title.en}</div>
                <div className="small text-muted" dir="rtl" lang="ar">
                  {c.title.ar}
                </div>
                <div className="small text-muted">Order {c.order}</div>
              </div>

              <CardDrawer kind={kind} card={c} nextOrder={nextOrderOf(cards)} />

              <button type="button" className="btn btn-soft-danger" onClick={() => remove(c)} aria-label="Delete card">
                <IconifyIcon icon="solar:trash-bin-trash-broken" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">Who We Serve</h5>

      {/* key remounts the editor after a save, so it shows the new values */}
      <SectionEditor key={section.updatedAt} section={section} />

      {renderList('serve', 'Serve cards', serve)}
      {renderList('why', 'Why cards', why)}
    </div>
  )
}

export default WhoWeServeAdminPage
