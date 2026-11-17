/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { toast } from 'react-toastify'

// Default images are relative paths that live in the website, so the admin
// can only preview real uploaded images (full URLs).
export const canPreview = (url?: string) => Boolean(url && /^https?:\/\//i.test(url))

type Props = {
  label: string
  current?: { url: string }
  disabled: boolean
  pickerKey: string
  onPick: (file: File | undefined) => void
}

const ImagePicker = ({ label, current, disabled, pickerKey, onPick }: Props) => (
  <div>
    <div className="small text-muted mb-1">{label}</div>

    {current ? (
      canPreview(current.url) ? (
        <img src={current.url} alt="" className="mb-2 rounded" style={{ width: 96, height: 64, objectFit: 'cover' }} />
      ) : (
        <div className="small text-muted mb-2">Default image (from the website)</div>
      )
    ) : (
      <div className="small text-muted mb-2">No image yet</div>
    )}

    <input
      key={pickerKey}
      type="file"
      accept="image/*"
      className="form-control form-control-sm"
      disabled={disabled}
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (!file) {
          onPick(undefined)
          return
        }
        if (!file.type.startsWith('image/')) {
          toast.error('Please select an image file')
          e.target.value = ''
          return
        }
        onPick(file)
      }}
    />
    <small className="text-muted">A new image replaces the current one.</small>
  </div>
)

export default ImagePicker
