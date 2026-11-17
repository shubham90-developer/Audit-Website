/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react'
import { toast } from 'react-toastify'

import type { Media } from '@/store/servicesApi'

export const canPreview = (url?: string) => Boolean(url && /^https?:\/\//i.test(url))

type Props = {
  label: string
  current?: Media
  disabled?: boolean
  pickerKey: string
  onPick: (file: File | undefined) => void
}

const ImagePicker = ({ label, current, disabled, pickerKey, onPick }: Props) => {
  return (
    <div>
      <div className="small fw-semibold mb-2">{label}</div>

      {current?.url && canPreview(current.url) ? (
        <img
          src={current.url}
          alt={label}
          className="mb-2 rounded"
          style={{
            width: 110,
            height: 80,
            objectFit: 'cover',
          }}
        />
      ) : (
        <div
          className="bg-light rounded mb-2 d-flex align-items-center justify-content-center"
          style={{
            width: 110,
            height: 80,
          }}>
          <span className="small text-muted">No image</span>
        </div>
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

      <small className="text-muted">Uploading a new image replaces the current image.</small>
    </div>
  )
}

export default ImagePicker
