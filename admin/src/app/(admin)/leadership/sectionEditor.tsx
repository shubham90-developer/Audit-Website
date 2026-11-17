'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'

import RichTextEditor from '@/components/RichTextEditor'

import { useUpdateLeadershipSectionMutation } from '@/store/leadershipApi'

import type { LeadershipSection, SectionText, SectionFiles } from '@/store/leadershipApi'

import type { Localized } from '@/store/bannerApi'

import ImagePicker from './imagePicker'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'

type Props = {
  section: LeadershipSection
}

const TEXT_FIELDS = [
  { key: 'leadershipTitle', label: 'Leadership heading', kind: 'plain' },
  { key: 'leadershipDescription', label: 'Leadership description', kind: 'rich' },
  { key: 'teamTitle', label: 'Team heading', kind: 'plain' },
  { key: 'teamDescription', label: 'Team description', kind: 'rich' },
] as const

type TextKey = keyof SectionText

const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0

const trimLocalized = (value: Localized): Localized => ({
  en: value.en.trim(),
  ar: value.ar.trim(),
})

const SectionEditor = ({ section }: Props) => {
  const [draft, setDraft] = useState<SectionText>({
    leadershipTitle: { ...section.leadershipTitle },
    leadershipDescription: { ...section.leadershipDescription },
    teamTitle: { ...section.teamTitle },
    teamDescription: { ...section.teamDescription },
  })

  const [files, setFiles] = useState<SectionFiles>({})
  const [pickerKey, setPickerKey] = useState(0)

  const [updateSection, { isLoading }] = useUpdateLeadershipSectionMutation()

  const setValue = (key: TextKey, lang: Lang, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value,
      },
    }))
  }

  const save = async () => {
    for (const field of TEXT_FIELDS) {
      for (const lang of LANGS) {
        const value = draft[field.key][lang.code]

        const valid = field.kind === 'rich' ? hasText(value) : value.trim().length >= 2

        if (!valid) {
          toast.error(`Please fill ${field.label} (${lang.name})`)
          return
        }
      }
    }

    try {
      await updateSection({
        data: {
          leadershipTitle: trimLocalized(draft.leadershipTitle),
          leadershipDescription: trimLocalized(draft.leadershipDescription),
          teamTitle: trimLocalized(draft.teamTitle),
          teamDescription: trimLocalized(draft.teamDescription),
        },
        files,
      }).unwrap()

      toast.success('Leadership section updated')

      setFiles({})
      setPickerKey((key) => key + 1)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Leadership Section Content</h6>

        {TEXT_FIELDS.map((field) => (
          <div className="mb-4" key={field.key}>
            <div className="small fw-semibold mb-2">{field.label}</div>

            <div className="row g-3">
              {LANGS.map(({ code, name, dir }) => (
                <div className="col-md-6" key={code}>
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
                      className="form-control"
                      value={draft[field.key][code]}
                      onChange={(e) => setValue(field.key, code, e.target.value)}
                      dir={dir}
                      lang={code}
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
            <div className="col-md-6" key={code}>
              <ImagePicker
                label={`${name} Background`}
                current={section.backgroundImage[code][0]}
                disabled={isLoading}
                pickerKey={`${pickerKey}-${code}`}
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
          {isLoading ? 'Saving...' : 'Save Section'}
        </button>
      </div>
    </div>
  )
}

export default SectionEditor
