/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useUpdateSectionMutation } from '@/store/whatWeDoApi'
import type { NumbersSection, SectionFiles, SectionText } from '@/store/numbersPresenceApi'
import RichTextEditor from './RichTextEditor'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'

const TEXT_FIELDS: { key: keyof SectionText; label: string }[] = [
  { key: 'numbersTitle', label: 'Heading' },
  { key: 'securityTitle', label: 'Security title' },
  { key: 'securityText', label: 'Security description' },
  { key: 'insuranceText', label: 'Insurance note' },
  { key: 'globalLabel', label: 'Global label' },
  { key: 'globalTitle', label: 'Global title' },
  { key: 'globalText', label: 'Global description' },
]

const BG_GROUPS = [
  { key: 'sectionBg', label: 'Main section background', fields: { en: 'sectionBgEn', ar: 'sectionBgAr' } },
  { key: 'panelBg', label: 'Numbers card background', fields: { en: 'panelBgEn', ar: 'panelBgAr' } },
] as const

// Strips tags to check whether an editor value has any visible text
const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0

const pickText = (s: NumbersSection): SectionText => ({
  numbersTitle: s.numbersTitle,
  securityTitle: s.securityTitle,
  securityText: s.securityText,
  insuranceText: s.insuranceText,
  globalLabel: s.globalLabel,
  globalTitle: s.globalTitle,
  globalText: s.globalText,
})

type Props = { section: NumbersSection }

const SectionEditor = ({ section }: Props) => {
  const [draft, setDraft] = useState<SectionText>(() => pickText(section))
  const [files, setFiles] = useState<SectionFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [updateSection, { isLoading }] = useUpdateSectionMutation()

  const setValue = (key: keyof SectionText, code: Lang, html: string) => setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: html } }))

  const handleBg = (fieldName: keyof SectionFiles, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      e.target.value = ''
      return
    }
    setFiles((prev) => ({ ...prev, [fieldName]: file }))
  }

  const save = async () => {
    for (const f of TEXT_FIELDS) {
      for (const { code, name } of LANGS) {
        if (!hasText(draft[f.key][code])) {
          toast.error(`Please fill ${f.label} (${name})`)
          return
        }
      }
    }

    try {
      await updateSection({ data: draft, files }).unwrap()
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
        <h6 className="fw-bold mb-3">Section text</h6>

        {TEXT_FIELDS.map((f) => (
          <div key={f.key} className="mb-3">
            <div className="small fw-semibold mb-1">{f.label}</div>
            <div className="row g-2">
              {LANGS.map(({ code, name, dir }) => (
                <div className="col-6" key={code}>
                  <div className="small text-muted mb-1">{name}</div>
                  <RichTextEditor
                    value={draft[f.key][code]}
                    onChange={(html) => setValue(f.key, code, html)}
                    disabled={isLoading}
                    dir={dir}
                    lang={code}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <h6 className="fw-bold mt-4 mb-3">Backgrounds</h6>
        {BG_GROUPS.map((group) => (
          <div key={group.key} className="mb-4">
            <div className="small fw-semibold mb-2">{group.label}</div>
            <div className="row g-3">
              {LANGS.map(({ code, name }) => {
                const existing = section[group.key][code]
                const fieldName = group.fields[code] as keyof SectionFiles

                return (
                  <div className="col-6" key={code}>
                    <div className="small text-muted mb-1">{name}</div>
                    {existing.length > 0 ? (
                      <img src={existing[0].url} alt="" className="mb-2 rounded" style={{ width: 160, height: 90, objectFit: 'cover' }} />
                    ) : (
                      <div className="small text-muted mb-2">No image yet</div>
                    )}
                    <input
                      key={`${fileKey}-${fieldName}`}
                      type="file"
                      accept="image/*"
                      className="form-control form-control-sm"
                      onChange={(e) => handleBg(fieldName, e)}
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
          {isLoading ? 'Saving...' : 'Save section'}
        </button>
      </div>
    </div>
  )
}

export default SectionEditor
