'use client'

import React from 'react'
import { toast } from 'react-toastify'

type Props = {
  label: string
  current?: { url: string }[]
  type: 'image' | 'video'
  disabled: boolean
  pickerKey: string
  onPick: (file?: File) => void
}

export const canPreview = (url?: string) => Boolean(url && /^https?:\/\//i.test(url))

const MediaPicker = ({ label, current, type, disabled, pickerKey, onPick }: Props) => {
  const url = current?.[0]?.url

  return (
    <div>
      <label className="form-label small fw-semibold">{label}</label>

      {url && canPreview(url) && (
        <div className="mb-2">
          {type === 'image' ? (
            <img
              src={url}
              alt=""
              style={{
                width: 120,
                height: 80,
                objectFit: 'cover',
                borderRadius: 6,
              }}
            />
          ) : (
            <video
              src={url}
              controls
              style={{
                width: 180,
                maxHeight: 110,
                borderRadius: 6,
              }}
            />
          )}
        </div>
      )}

      {!url && <div className="small text-muted mb-2">No {type} uploaded</div>}

      <input
        key={pickerKey}
        type="file"
        accept={type === 'image' ? 'image/*' : 'video/*'}
        className="form-control form-control-sm"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0]

          if (!file) {
            onPick(undefined)
            return
          }

          if (type === 'image' && !file.type.startsWith('image/')) {
            toast.error('Please select an image file')
            e.target.value = ''
            return
          }

          if (type === 'video' && !file.type.startsWith('video/')) {
            toast.error('Please select a video file')
            e.target.value = ''
            return
          }

          onPick(file)
        }}
      />

      <small className="text-muted">Uploading a new file replaces the existing one.</small>
    </div>
  )
}

export default MediaPicker
