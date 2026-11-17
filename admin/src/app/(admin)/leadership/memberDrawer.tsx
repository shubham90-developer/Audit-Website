'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import IconifyIcon from '@/components/wrappers/IconifyIcon'
import RichTextEditor from '@/components/RichTextEditor'

import { useCreateLeadershipMemberMutation, useUpdateLeadershipMemberMutation } from '@/store/leadershipApi'

import type { LeadershipMember, MemberFiles, MemberText } from '@/store/leadershipApi'

import type { Localized } from '@/store/bannerApi'

import ImagePicker from './imagePicker'

const LANGS = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const

type Lang = 'en' | 'ar'

const IMAGE_FIELD = {
  en: 'imageEn',
  ar: 'imageAr',
} as const

type Draft = {
  name: Localized
  role: Localized
  department: Localized
  bio: Localized
  order: string
  isFeatured: boolean
  isActive: boolean
}

const emptyDraft = (order: number): Draft => ({
  name: { en: '', ar: '' },
  role: { en: '', ar: '' },
  department: { en: '', ar: '' },
  bio: { en: '', ar: '' },
  order: String(order),
  isFeatured: false,
  isActive: true,
})

const toDraft = (member: LeadershipMember | undefined, order: number): Draft =>
  member
    ? {
        name: { ...member.name },
        role: { ...member.role },
        department: { ...member.department },
        bio: { ...member.bio },
        order: String(member.order),
        isFeatured: member.isFeatured,
        isActive: member.isActive,
      }
    : emptyDraft(order)

const hasText = (html: string) => html.replace(/<[^>]*>/g, '').trim().length > 0

const trimLocalized = (value: Localized): Localized => ({
  en: value.en.trim(),
  ar: value.ar.trim(),
})

type Props = {
  member?: LeadershipMember
  nextOrder: number
}

const MemberDrawer = ({ member, nextOrder }: Props) => {
  const isEdit = Boolean(member)

  const [open, setOpen] = useState(false)

  const [draft, setDraft] = useState<Draft>(() => toDraft(member, nextOrder))

  const [files, setFiles] = useState<MemberFiles>({})
  const [pickerKey, setPickerKey] = useState(0)

  const [createMember, { isLoading: creating }] = useCreateLeadershipMemberMutation()

  const [updateMember, { isLoading: updating }] = useUpdateLeadershipMemberMutation()

  const isLoading = creating || updating

  const openDrawer = () => {
    setDraft(toDraft(member, nextOrder))
    setFiles({})
    setPickerKey((key) => key + 1)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKey)

    return () => window.removeEventListener('keydown', handleKey)
  }, [open, isLoading])

  const setLocalized = (key: 'name' | 'role' | 'department' | 'bio', lang: Lang, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [lang]: value,
      },
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    for (const { code, name } of LANGS) {
      for (const key of ['name', 'role', 'department', 'bio'] as const) {
        const value = draft[key][code]

        if (!hasText(value)) {
          toast.error(`Please enter ${key} (${name})`)
          return
        }
      }
    }

    const order = Number(draft.order)

    if (!Number.isInteger(order) || order < 0) {
      toast.error('Order must be a whole number, 0 or more')
      return
    }

    const data: MemberText = {
      name: trimLocalized(draft.name),
      role: trimLocalized(draft.role),
      department: trimLocalized(draft.department),
      bio: trimLocalized(draft.bio),
      order,
      isFeatured: draft.isFeatured,
      isActive: draft.isActive,
    }

    try {
      if (member) {
        await updateMember({
          id: member._id,
          data,
          files,
        }).unwrap()
      } else {
        await createMember({
          data,
          files,
        }).unwrap()
      }

      toast.success(isEdit ? 'Team member updated' : 'Team member added')

      setOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong')
    }
  }

  return (
    <>
      {isEdit ? (
        <button type="button" className="btn btn-soft-dark" onClick={openDrawer} aria-label="Edit member">
          <IconifyIcon icon="solar:pen-2-broken" />
        </button>
      ) : (
        <button type="button" className="btn btn-primary d-flex align-items-center gap-2" onClick={openDrawer}>
          <IconifyIcon icon="solar:add-circle-broken" />
          Add team member
        </button>
      )}

      {open && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1040,
          }}
          onClick={() => !isLoading && setOpen(false)}
        />
      )}

      <div
        className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
        style={{
          width: 760,
          maxWidth: '100%',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          overflowY: 'auto',
          visibility: open ? 'visible' : 'hidden',
        }}>
        <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">{isEdit ? 'Edit Team Member' : 'Add Team Member'}</h5>

          <button type="button" className="btn btn-sm btn-danger rounded-circle" onClick={() => setOpen(false)} disabled={isLoading}>
            ✕
          </button>
        </div>

        {open && (
          <form onSubmit={handleSubmit} noValidate>
            <div className="p-3">
              {/* ORDER */}

              <div className="mb-3" style={{ maxWidth: 200 }}>
                <label className="form-label small fw-semibold">Display order</label>

                <input
                  type="number"
                  min={0}
                  step={1}
                  className="form-control form-control-sm"
                  value={draft.order}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      order: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                />
              </div>

              {/* NAME */}

              {(['name', 'role', 'department', 'bio'] as const).map((key) => (
                <div className="mb-3" key={key}>
                  <div className="fw-semibold small mb-2 text-capitalize">{key === 'bio' ? 'Biography' : key}</div>

                  <div className="row g-2">
                    {LANGS.map(({ code, name, dir }) => (
                      <div className="col-md-6" key={code}>
                        <div className="small text-muted mb-1">{name}</div>

                        {key === 'bio' ? (
                          <RichTextEditor
                            value={draft[key][code]}
                            onChange={(html) => setLocalized(key, code, html)}
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
                            value={draft[key][code]}
                            onChange={(e) => setLocalized(key, code, e.target.value)}
                            disabled={isLoading}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* IMAGES */}

              <h6 className="fw-bold mt-4 mb-3">Member Images</h6>

              <div className="row g-3">
                {LANGS.map(({ code, name }) => (
                  <div className="col-md-6" key={code}>
                    <ImagePicker
                      label={name}
                      current={member?.image[code][0]}
                      disabled={isLoading}
                      pickerKey={`${pickerKey}-${code}`}
                      onPick={(file) =>
                        setFiles((prev) => ({
                          ...prev,
                          [IMAGE_FIELD[code]]: file,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>

              {/* STATUS */}

              <div className="border rounded p-3 mt-4">
                <div className="form-check mb-3">
                  <input
                    id="isFeatured"
                    type="checkbox"
                    className="form-check-input"
                    checked={draft.isFeatured}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        isFeatured: e.target.checked,
                      }))
                    }
                    disabled={isLoading}
                  />

                  <label htmlFor="isFeatured" className="form-check-label fw-semibold">
                    Featured leadership member
                  </label>

                  <div className="small text-muted">Displays this person in the top leadership profile. Only one member can be featured.</div>
                </div>

                <div className="form-check">
                  <input
                    id="isActive"
                    type="checkbox"
                    className="form-check-input"
                    checked={draft.isActive}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    disabled={isLoading}
                  />

                  <label htmlFor="isActive" className="form-check-label fw-semibold">
                    Active
                  </label>

                  <div className="small text-muted">Inactive members are hidden from the public website.</div>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="p-3 border-top d-flex gap-2">
              <button type="button" className="btn btn-light w-100" onClick={() => setOpen(false)} disabled={isLoading}>
                Cancel
              </button>

              <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                <IconifyIcon icon="solar:diskette-broken" />
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}

export default MemberDrawer
