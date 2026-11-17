'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'

import RichTextEditor from '@/components/RichTextEditor'
import { useUpdateSectionMutation } from '@/store/globalMarketsApi'

import type { GlobalMarketsSection, SectionFiles, SectionText } from '@/store/globalMarketsApi'

import type { Localized } from '@/store/bannerApi'

import ImagePicker from './imagePicker'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
type TextKey = keyof SectionText

const TEXT_FIELDS: {
  key: TextKey
  label: string
  kind: 'rich' | 'plain'
  hint?: string
}[] = [
  { key: 'badge', label: 'Badge', kind: 'plain' },
  { key: 'title', label: 'Main heading', kind: 'rich' },
  { key: 'highlightedTitle', label: 'Highlighted heading', kind: 'rich' },
  { key: 'description', label: 'Description', kind: 'rich' },
  { key: 'sideTitle', label: 'Right decorative heading', kind: 'rich' },
]

const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0

const trimLocalized = (v: Localized): Localized => ({
  en: v.en.trim(),
  ar: v.ar.trim(),
})

type Props = {
  section: GlobalMarketsSection
}

const SectionEditor = ({ section }: Props) => {
  const [draft, setDraft] = useState<SectionText>({
    badge: { ...section.badge },
    title: { ...section.title },
    highlightedTitle: { ...section.highlightedTitle },
    description: { ...section.description },
    sideTitle: { ...section.sideTitle },
  })

  const [files, setFiles] = useState<SectionFiles>({})
  const [pickerKey, setPickerKey] = useState(0)

  const [updateSection, { isLoading }] = useUpdateSectionMutation()

  const setValue = (key: TextKey, code: Lang, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [code]: value,
      },
    }))
  }

  const save = async () => {
    for (const field of TEXT_FIELDS) {
      for (const { code, name } of LANGS) {
        const value = draft[field.key][code]

        const valid = field.kind === 'rich' ? hasText(value) : value.trim().length >= 2

        if (!valid) {
          toast.error(`Please fill ${field.label} (${name})`)
          return
        }
      }
    }

    try {
      await updateSection({
        data: {
          badge: trimLocalized(draft.badge),
          title: trimLocalized(draft.title),
          highlightedTitle: trimLocalized(draft.highlightedTitle),
          description: trimLocalized(draft.description),
          sideTitle: trimLocalized(draft.sideTitle),
        },
        files,
      }).unwrap()

      toast.success('Section saved successfully')

      setFiles({})
      setPickerKey((k) => k + 1)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Global Markets - Section Content</h6>

        {TEXT_FIELDS.map((field) => (
          <div key={field.key} className="mb-3">
            <div className="small fw-semibold mb-1">{field.label}</div>

            <div className="row g-2">
              {LANGS.map(({ code, name, dir }) => (
                <div className="col-6" key={code}>
                  <div className="small text-muted mb-1">{name}</div>

                  {field.kind === 'rich' ? (
                    <RichTextEditor
                      value={draft[field.key][code]}
                      onChange={(html) => setValue(field.key, code, html)}
                      disabled={isLoading}
                      dir={dir}
                      lang={code}
                    />
                  ) : (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      dir={dir}
                      lang={code}
                      value={draft[field.key][code]}
                      onChange={(e) => setValue(field.key, code, e.target.value)}
                      disabled={isLoading}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <h6 className="fw-bold mt-4 mb-3">Background Images</h6>

        <div className="row g-3 mb-4">
          {LANGS.map(({ code, name }) => (
            <div className="col-6" key={code}>
              <ImagePicker
                label={`Background image (${name})`}
                current={section.bgImage[code][0]}
                disabled={isLoading}
                pickerKey={`${pickerKey}-bg-${code}`}
                onPick={(file) =>
                  setFiles((prev) => ({
                    ...prev,
                    [code === 'en' ? 'bgImageEn' : 'bgImageAr']: file,
                  }))
                }
              />
            </div>
          ))}
        </div>

        <button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save section'}
        </button>
      </div>
    </div>
  )
}

export default SectionEditor
