'use client'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import RichTextEditor from '@/components/RichTextEditor'
import {
  useGetBlogSectionQuery,
  useUpdateBlogSectionMutation,
  type BlogSection,
  type BlogArticle,
  type BlogCategory,
  type Localized,
  type LocalizedMedia,
  type Media,
} from '@/store/blogApi'

type Lang = 'en' | 'ar'
const languages: Lang[] = ['en', 'ar']
const loc = (): Localized => ({ en: '', ar: '' })
const media = (): LocalizedMedia => ({ en: { url: '', publicId: '' }, ar: { url: '', publicId: '' } })
const objectId = () => Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
const plainText = (html: string) =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim()
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const newCategory = (): BlogCategory => ({ _id: objectId(), name: loc(), slug: '', order: 0, active: true })
const newArticle = (categoryId: string): BlogArticle => ({
  _id: objectId(),
  categoryId,
  slug: '',
  title: loc(),
  excerpt: loc(),
  content: loc(),
  cardImage: media(),
  mainImage: media(),
  publishedAt: new Date().toISOString(),
  status: 'draft',
  order: 0,
})

export default function BlogsAdminPage() {
  const { data, isLoading, error, refetch } = useGetBlogSectionQuery()
  const [saveSection, { isLoading: saving }] = useUpdateBlogSectionMutation()
  const [draft, setDraft] = useState<BlogSection | null>(null)
  const [tab, setTab] = useState<'articles' | 'categories' | 'hero'>('articles')
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const [editingArticle, setEditingArticle] = useState<number | null>(null)
  const [uploading, setUploading] = useState(false)
  useEffect(() => {
    if (data) setDraft(structuredClone(data))
  }, [data])
  const update = (patch: Partial<BlogSection>) => setDraft((prev) => (prev ? { ...prev, ...patch } : prev))
  const setCategory = (i: number, patch: Partial<BlogCategory>) =>
    setDraft((prev) => (prev ? { ...prev, categories: prev.categories.map((x, j) => (i === j ? { ...x, ...patch } : x)) } : prev))
  const setArticle = (i: number, patch: Partial<BlogArticle>) =>
    setDraft((prev) => (prev ? { ...prev, articles: prev.articles.map((x, j) => (i === j ? { ...x, ...patch } : x)) } : prev))
  const uploadImage = async (file: File, done: (m: Media) => void) => {
    setUploading(true)
    try {
      const body = new FormData()
      body.append('image', file)
      const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/v1/api'}/blog/image`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body,
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Upload failed')
      done(result.data)
      toast.success('Image uploaded')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }
  const imageInput = (value: LocalizedMedia, onChange: (v: LocalizedMedia) => void) => (
    <div className="row g-3">
      {languages.map((lang) => (
        <div className="col-12 col-md-6" key={lang}>
          <label className="form-label">{lang === 'en' ? 'English' : 'Arabic'} image</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            disabled={uploading || saving}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void uploadImage(file, (m) => onChange({ ...value, [lang]: m }))
            }}
          />
          {value[lang]?.url && (
            <img alt="Preview" src={value[lang].url} style={{ width: 120, height: 75, objectFit: 'cover' }} className="mt-2 rounded" />
          )}
        </div>
      ))}
    </div>
  )
  const localizedInput = (label: string, value: Localized, onChange: (v: Localized) => void, _rows = 2) => (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>
      <div className="row g-3">
        {languages.map((lang) => (
          <div className="col-12 col-lg-6" key={lang}>
            <label className="form-label small">{lang === 'en' ? 'English' : 'Arabic'}</label>
            <RichTextEditor
              value={value[lang]}
              onChange={(html) => onChange({ ...value, [lang]: html })}
              disabled={saving || uploading}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              lang={lang}
            />
          </div>
        ))}
      </div>
    </div>
  )
  const save = async () => {
    if (!draft) return
    if (draft.categories.some((c) => !plainText(c.name.en) || !plainText(c.name.ar) || !c.slug.trim()))
      return toast.error('Fill both category names and slug')
    if (draft.articles.some((a) => !plainText(a.title.en) || !plainText(a.title.ar) || !a.slug.trim() || !a.categoryId))
      return toast.error('Fill both article titles, slug, and category')
    try {
      await saveSection(draft).unwrap()
      toast.success('Blogs saved successfully')
      setEditingArticle(null)
      setEditingCategory(null)
    } catch (e: any) {
      toast.error(e?.data?.message || 'Unable to save')
    }
  }
  if (isLoading) return <div className="p-4">Loading blogs...</div>
  if (error)
    return (
      <div className="p-4">
        Unable to load blogs.{' '}
        <button className="btn btn-primary" onClick={() => refetch()}>
          Retry
        </button>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  if (!draft) return null
  const article = editingArticle !== null ? draft.articles[editingArticle] : null
  const category = editingCategory !== null ? draft.categories[editingCategory] : null
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h4>Insights & Resources / Blogs</h4>
        <button className="btn btn-primary" disabled={saving || uploading} onClick={save}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {(['articles', 'categories', 'hero'] as const).map((t) => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setTab(t)}>
            {t === 'hero' ? 'Banner Settings' : t === 'articles' ? 'Blog Articles' : 'Categories'}
          </button>
        ))}
      </div>
      {tab === 'hero' && (
        <div className="card">
          <div className="card-body">
            <h5>Banner content</h5>
            {localizedInput('Hero title', draft.heroTitle, (v) => update({ heroTitle: v }))}
            {localizedInput('Hero description', draft.heroDescription, (v) => update({ heroDescription: v }), 4)}
            {localizedInput('Explore label', draft.exploreLabel, (v) => update({ exploreLabel: v }))}
            <h6>Hero background images</h6>
            {imageInput(draft.heroImage, (v) => update({ heroImage: v }))}
          </div>
        </div>
      )}
      {tab === 'categories' && (
        <>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h5>Categories ({draft.categories.length})</h5>
            <button
              className="btn btn-primary"
              onClick={() => {
                update({ categories: [...draft.categories, { ...newCategory(), order: draft.categories.length }] })
                setEditingCategory(draft.categories.length)
              }}>
              Add Category
            </button>
          </div>
          <div className="table-responsive card">
            <table className="table table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th>English</th>
                  <th>Arabic</th>
                  <th>Slug</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {draft.categories.map((c, i) => (
                  <tr key={c._id || i}>
                    <td>{plainText(c.name.en)}</td>
                    <td>{plainText(c.name.ar)}</td>
                    <td>{c.slug}</td>
                    <td>{c.order}</td>
                    <td>{c.active ? 'Active' : 'Hidden'}</td>
                    <td>
                      <button className="btn btn-sm btn-soft-dark me-2" onClick={() => setEditingCategory(i)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-soft-danger"
                        onClick={() => {
                          if (draft.articles.some((a) => a.categoryId === c._id))
                            return toast.error('Remove or reassign articles before deleting this category')
                          if (confirm('Delete category?')) update({ categories: draft.categories.filter((_, j) => i !== j) })
                        }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {tab === 'articles' && (
        <>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <h5>Blog Articles ({draft.articles.length})</h5>
            <button
              className="btn btn-primary"
              disabled={!draft.categories.length}
              onClick={() => {
                update({ articles: [...draft.articles, { ...newArticle(draft.categories[0]._id!), order: draft.articles.length }] })
                setEditingArticle(draft.articles.length)
              }}>
              Add Blog
            </button>
          </div>
          <div className="table-responsive card">
            <table className="table table-hover mb-0 align-middle">
              <thead>
                <tr>
                  <th>Title (EN)</th>
                  <th>Title (AR)</th>
                  <th>Category</th>
                  <th>Published</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {draft.articles.map((a, i) => (
                  <tr key={a._id || i}>
                    <td>{plainText(a.title.en)}</td>
                    <td>{plainText(a.title.ar)}</td>
                    <td>
                      {draft.categories.find((c) => c._id === a.categoryId)?.name.en
                        ? plainText(draft.categories.find((c) => c._id === a.categoryId)!.name.en)
                        : 'Unknown'}
                    </td>
                    <td>{a.publishedAt?.slice(0, 10)}</td>
                    <td>{a.status}</td>
                    <td>
                      <button className="btn btn-sm btn-soft-dark me-2" onClick={() => setEditingArticle(i)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-soft-danger"
                        onClick={() => {
                          if (confirm('Delete blog?')) update({ articles: draft.articles.filter((_, j) => j !== i) })
                        }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {(category || article) && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ background: 'rgba(0,0,0,.5)', zIndex: 1040 }}
            onClick={() => {
              setEditingCategory(null)
              setEditingArticle(null)
            }}
          />
          <div
            className="position-fixed top-0 end-0 bg-white h-100 shadow-lg p-3 p-md-4"
            style={{ width: 850, maxWidth: '100vw', zIndex: 1050, overflowY: 'auto', overflowX: 'hidden' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>{category ? 'Category' : 'Blog Article'}</h5>
              <button
                className="btn btn-light"
                onClick={() => {
                  setEditingCategory(null)
                  setEditingArticle(null)
                }}>
                Close
              </button>
            </div>
            {category && editingCategory !== null && (
              <>
                {localizedInput('Category name', category.name, (v) => setCategory(editingCategory, { name: v }))}
                <label className="form-label">Slug</label>
                <input
                  className="form-control mb-3"
                  value={category.slug}
                  onChange={(e) => setCategory(editingCategory, { slug: slugify(e.target.value) })}
                />
                <label className="form-label">Order</label>
                <input
                  className="form-control mb-3"
                  type="number"
                  value={category.order}
                  onChange={(e) => setCategory(editingCategory, { order: Number(e.target.value) })}
                />
                <label>
                  <input type="checkbox" checked={category.active} onChange={(e) => setCategory(editingCategory, { active: e.target.checked })} />{' '}
                  Active
                </label>
              </>
            )}
            {article && editingArticle !== null && (
              <>
                <label className="form-label">Category</label>
                <select
                  className="form-select mb-3"
                  value={article.categoryId}
                  onChange={(e) => setArticle(editingArticle, { categoryId: e.target.value })}>
                  {draft.categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {plainText(c.name.en)} / {plainText(c.name.ar)}
                    </option>
                  ))}
                </select>
                {localizedInput('Title', article.title, (v) => setArticle(editingArticle, { title: v }))}
                <label className="form-label">Slug</label>
                <input
                  className="form-control mb-3"
                  value={article.slug}
                  onChange={(e) => setArticle(editingArticle, { slug: slugify(e.target.value) })}
                />
                {localizedInput('Short description', article.excerpt, (v) => setArticle(editingArticle, { excerpt: v }), 3)}
                {localizedInput('Full article (HTML supported)', article.content, (v) => setArticle(editingArticle, { content: v }), 10)}
                <h6>Card images</h6>
                {imageInput(article.cardImage, (v) => setArticle(editingArticle, { cardImage: v }))}
                <h6 className="mt-3">Main article images</h6>
                {imageInput(article.mainImage, (v) => setArticle(editingArticle, { mainImage: v }))}
                <div className="row g-3 mt-3">
                  <div className="col-12 col-md-4">
                    <label className="form-label">Published date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={article.publishedAt?.slice(0, 10) || ''}
                      onChange={(e) => {
                        if (e.target.value) setArticle(editingArticle, { publishedAt: new Date(`${e.target.value}T00:00:00`).toISOString() })
                      }}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={article.status}
                      onChange={(e) => setArticle(editingArticle, { status: e.target.value as BlogArticle['status'] })}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label">Order</label>
                    <input
                      className="form-control"
                      type="number"
                      value={article.order}
                      onChange={(e) => setArticle(editingArticle, { order: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="mt-4">
              <button className="btn btn-primary" disabled={saving || uploading} onClick={save}>
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
