'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import RichTextEditor from '@/components/RichTextEditor'
import { useGetSiteSettingsQuery, useUpdateSiteSettingsMutation, type SiteSettings } from '@/store/siteSettingsApi'
type Lang = 'en' | 'ar'
const langs = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', dir: 'rtl' },
] as const
const localizedFields = [
  'companyName',
  'tagline',
  'address',
  'officeHours',
  'footerDescription',
  'copyright',
  'footerQuickLinksTitle',
  'footerServicesTitle',
  'footerContactTitle',
  'headerFollowTitle',
  'whatsappCta',
] as const
const simpleFields = ['phone', 'alternatePhone', 'email', 'whatsapp', 'googleMapsUrl'] as const
const socialFields = ['instagram', 'facebook', 'youtube', 'linkedin', 'x'] as const
const mediaFields = ['logo', 'footerLogo', 'favicon'] as const
export default function SiteSettingsPage() {
  const { data, isLoading, isError, refetch } = useGetSiteSettingsQuery()
  const [update, { isLoading: saving }] = useUpdateSiteSettingsMutation()
  const [draft, setDraft] = useState<SiteSettings | null>(null)
  const [files, setFiles] = useState<Partial<Record<(typeof mediaFields)[number], File>>>({})
  useEffect(() => {
    if (data) {
      setDraft(structuredClone(data))
      setFiles({})
    }
  }, [data])
  const setText = (key: (typeof localizedFields)[number], lang: Lang, value: string) =>
    setDraft((p) => (p ? { ...p, [key]: { ...p[key], [lang]: value } } : p))
  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft) return
    try {
      await update({ data: draft, files }).unwrap()
      toast.success('Settings updated successfully')
      setFiles({})
    } catch (err: any) {
      toast.error(err?.data?.message || 'Unable to save settings')
    }
  }
  if (isLoading) return <div className="p-4">Loading settings...</div>
  if (isError)
    return (
      <div className="p-4">
        Could not load settings.{' '}
        <button className="btn btn-primary" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    )
  if (!draft) return null
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Website Settings</h4>
        <button type="submit" form="site-settings-form" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <form id="site-settings-form" onSubmit={save}>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">Brand Images</h5>
            <div className="row g-3">
              {mediaFields.map((key) => (
                <div className="col-md-4" key={key}>
                  <label className="form-label fw-semibold">{key}</label>
                  {draft[key]?.url && (
                    <div className="mb-2">
                      <img src={draft[key].url} alt={key} style={{ maxWidth: 180, maxHeight: 100, objectFit: 'contain' }} />
                    </div>
                  )}
                  <input
                    className="form-control"
                    type="file"
                    accept="image/*"
                    disabled={saving}
                    onChange={(e) => setFiles((p) => ({ ...p, [key]: e.target.files?.[0] }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">Contact Details & Links</h5>
            <div className="row g-3">
              {simpleFields.map((key) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label fw-semibold">{key}</label>
                  <input
                    className="form-control"
                    value={draft[key]}
                    disabled={saving}
                    onChange={(e) => setDraft((p) => (p ? { ...p, [key]: e.target.value } : p))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">Social Media</h5>
            <div className="row g-3">
              {socialFields.map((key) => (
                <div className="col-md-6" key={key}>
                  <label className="form-label fw-semibold">{key}</label>
                  <input
                    className="form-control"
                    type="url"
                    placeholder="https://..."
                    value={draft.socials[key]}
                    disabled={saving}
                    onChange={(e) => setDraft((p) => (p ? { ...p, socials: { ...p.socials, [key]: e.target.value } } : p))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="mb-3">Bilingual Header & Footer Content</h5>
            {localizedFields.map((key) => (
              <div className="mb-4" key={key}>
                <label className="form-label fw-semibold">{key}</label>
                <div className="row g-3">
                  {langs.map((lang) => (
                    <div className="col-md-6" key={lang.code}>
                      <label className="form-label small">{lang.name}</label>
                      <RichTextEditor
                        value={draft[key][lang.code]}
                        onChange={(value) => setText(key, lang.code, value)}
                        disabled={saving}
                        dir={lang.dir}
                        lang={lang.code}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
