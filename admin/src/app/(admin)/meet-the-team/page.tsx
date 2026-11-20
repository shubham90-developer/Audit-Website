/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { useGetMeetTheTeamQuery, useUpdateMeetTheTeamMutation } from '@/store/meettheteamapi'
import type { MeetTheTeam, MeetTheTeamFiles, MeetTheTeamText } from '@/store/meettheteamapi'
import type { Localized } from '@/store/bannerApi'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'
const IMAGE_FIELD = { en: 'imageEn', ar: 'imageAr' } as const
const MIN_LENGTH = 2
const ACCEPTED_MEDIA = 'image/*,video/mp4,video/webm,video/quicktime,.mov'
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

const TEXT_FIELDS: { key: keyof MeetTheTeamText; label: string; hint?: string }[] = [
  { key: 'leftTitle', label: 'Left title', hint: 'Shown on the left, e.g. "The team you\'ll actually work with"' },
  { key: 'scriptTitle', label: 'Script title', hint: 'Shown on the right in the script font' },
  { key: 'watermark', label: 'Watermark', hint: 'Large faded text behind the card' },
]

const trimLocalized = (v: Localized): Localized => ({ en: v.en.trim(), ar: v.ar.trim() })

const isValidMedia = (file: File) =>
  file.type.startsWith('image/') || VIDEO_TYPES.has(file.type) || (file.type === '' && /\.(mp4|webm|mov)$/i.test(file.name))

const isVideoUrl = (url: string) => /\/video\/upload\//i.test(url) || /\.(mp4|webm|mov)(?:[?#]|$)/i.test(url)

/* ---------- Editor ---------- */

const Editor = ({ section }: { section: MeetTheTeam }) => {
  const [draft, setDraft] = useState<MeetTheTeamText>({
    leftTitle: section.leftTitle,
    scriptTitle: section.scriptTitle,
    watermark: section.watermark,
  })
  const [files, setFiles] = useState<MeetTheTeamFiles>({})
  const [fileKey, setFileKey] = useState(0)
  const [updateMeetTheTeam, { isLoading }] = useUpdateMeetTheTeamMutation()

  const setValue = (key: keyof MeetTheTeamText, code: Lang, value: string) =>
    setDraft((prev) => ({ ...prev, [key]: { ...prev[key], [code]: value } }))

  const handleMedia = (code: Lang, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isValidMedia(file)) {
      toast.error('Please select an image or video (MP4, WebM, MOV)')
      e.target.value = ''
      return
    }

    setFiles((prev) => ({ ...prev, [IMAGE_FIELD[code]]: file }))
  }

  const save = async () => {
    for (const f of TEXT_FIELDS) {
      for (const { code, name } of LANGS) {
        if (draft[f.key][code].trim().length < MIN_LENGTH) {
          toast.error(`Please fill ${f.label} (${name})`)
          return
        }
      }
    }

    try {
      await updateMeetTheTeam({
        data: {
          leftTitle: trimLocalized(draft.leftTitle),
          scriptTitle: trimLocalized(draft.scriptTitle),
          watermark: trimLocalized(draft.watermark),
        },
        files,
      }).unwrap()
      toast.success('Section saved')
      setFiles({})
      setFileKey((k) => k + 1)
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } } | undefined
      toast.error(apiError?.data?.message || 'Something went wrong')
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h6 className="fw-bold mb-3">Section text</h6>

        {TEXT_FIELDS.map((f) => (
          <div key={f.key} className="mb-3">
            <div className="small fw-semibold mb-1">{f.label}</div>
            <div className="row g-2">
              {LANGS.map(({ code, dir }) => (
                <div className="col-6" key={code}>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    dir={dir}
                    lang={code}
                    value={draft[f.key][code]}
                    onChange={(e) => setValue(f.key, code, e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
            {f.hint && <small className="text-muted">{f.hint}</small>}
          </div>
        ))}

        <h6 className="fw-bold mt-4 mb-3">Card media (middle)</h6>
        <div className="row g-3 mb-4">
          {LANGS.map(({ code, name }) => {
            const existing = section.image?.[code] ?? []
            const currentMedia = existing[0]
            const selectedFile = files[IMAGE_FIELD[code]]

            return (
              <div className="col-6" key={code}>
                <div className="small text-muted mb-1">{name}</div>
                {currentMedia?.url ? (
                  isVideoUrl(currentMedia.url) ? (
                    <video
                      src={currentMedia.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="mb-2 rounded"
                      style={{ width: 160, height: 90, objectFit: 'cover' }}
                    />
                  ) : (
                    <img
                      src={currentMedia.url}
                      alt={`${name} media`}
                      className="mb-2 rounded"
                      style={{ width: 160, height: 90, objectFit: 'cover' }}
                    />
                  )
                ) : (
                  <div className="small text-muted mb-2">No media yet</div>
                )}
                <input
                  key={`${fileKey}-${code}`}
                  type="file"
                  accept={ACCEPTED_MEDIA}
                  className="form-control form-control-sm"
                  onChange={(e) => handleMedia(code, e)}
                  disabled={isLoading}
                />
                {selectedFile && <div className="small text-success mt-2">Selected: {selectedFile.name}</div>}
                <small className="text-muted d-block mt-1">Images or videos (MP4, WebM, MOV). A new file replaces the current one.</small>
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

const MeetTheTeamAdminPage = () => {
  const { data, isLoading, isError, refetch } = useGetMeetTheTeamQuery()

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

  return (
    <div className="p-3">
      <h5 className="fw-bold mb-3">Meet the Team</h5>
      <Editor key={data.updatedAt} section={data} />
    </div>
  )
}

export default MeetTheTeamAdminPage
