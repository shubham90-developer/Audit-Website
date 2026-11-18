'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  useGetFaqSectionQuery,
  useUpdateFaqSectionMutation,
  type FaqSection,
  type FaqCategory,
  type FaqQuestion,
  type Localized,
} from '@/store/faqSectionApi'

type Lang = 'en' | 'ar'
const langs: Lang[] = ['en', 'ar']
const empty = (): Localized => ({ en: '', ar: '' })
const newQuestion = (order: number): FaqQuestion => ({ question: empty(), answer: empty(), order, active: true })
const newCategory = (order: number): FaqCategory => ({ name: empty(), order, active: true, questions: [] })
const textFields = [
  ['title', 'Banner title'],
  ['description', 'Banner description'],
  ['breadcrumbHome', 'Breadcrumb home label'],
  ['exploreLabel', 'Explore answers label'],
  ['questionsLabel', 'Questions count label'],
  ['emptyLabel', 'Empty category message'],
  ['ctaTitle', 'CTA heading'],
  ['ctaDescription', 'CTA description'],
  ['ctaButton', 'CTA button text'],
] as const

type Editor =
  | { kind: 'category'; categoryIndex: number; value: FaqCategory }
  | { kind: 'question'; categoryIndex: number; sourceCategoryIndex: number; questionIndex: number; value: FaqQuestion }

export default function FaqDynamicAdmin() {
  const { data, isLoading, error, refetch } = useGetFaqSectionQuery()
  const [saveSection, { isLoading: saving }] = useUpdateFaqSectionMutation()
  const [draft, setDraft] = useState<FaqSection | null>(null)
  const [files, setFiles] = useState<{ en?: File; ar?: File }>({})
  const [editor, setEditor] = useState<Editor | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    if (data) {
      setDraft(structuredClone(data))
      setFiles({})
    }
  }, [data])

  const questions = useMemo(() => {
    if (!draft) return []
    return draft.categories
      .flatMap((category, categoryIndex) =>
        category.questions.map((question, questionIndex) => ({ category, categoryIndex, question, questionIndex })),
      )
      .filter((row) => categoryFilter === 'all' || row.categoryIndex === Number(categoryFilter))
  }, [draft, categoryFilter])

  const setText = (key: (typeof textFields)[number][0], lang: Lang, value: string) => {
    setDraft((prev) => (prev ? { ...prev, [key]: { ...prev[key], [lang]: value } } : prev))
  }

  const saveEditor = () => {
    if (!editor || !draft) return
    if (editor.kind === 'category') {
      if (!editor.value.name.en.trim() || !editor.value.name.ar.trim()) {
        toast.error('Enter category name in both languages')
        return
      }
      setDraft((prev) => {
        if (!prev) return prev
        const categories = [...prev.categories]
        if (editor.categoryIndex === -1) categories.push(editor.value)
        else categories[editor.categoryIndex] = editor.value
        return { ...prev, categories }
      })
    } else {
      const q = editor.value
      if (!q.question.en.trim() || !q.question.ar.trim() || !q.answer.en.trim() || !q.answer.ar.trim()) {
        toast.error('Enter the question and answer in both languages')
        return
      }
      setDraft((prev) => {
        if (!prev) return prev
        const categories = prev.categories.map((cat) => ({ ...cat, questions: [...cat.questions] }))
        const sourceIndex = editor.questionIndex >= 0 ? editor.sourceCategoryIndex : -1
        const destinationIndex = editor.categoryIndex
        // Existing question can be moved by changing the category in the editor.
        if (sourceIndex >= 0) {
          categories[sourceIndex].questions.splice(editor.questionIndex, 1)
        }
        categories[destinationIndex].questions.push(q)
        return { ...prev, categories }
      })
    }
    setEditor(null)
  }

  const removeCategory = (index: number) => {
    if (!window.confirm('Delete this category and all its questions?')) return
    setDraft((prev) => (prev ? { ...prev, categories: prev.categories.filter((_, i) => i !== index) } : prev))
    setCategoryFilter('all')
  }

  const removeQuestion = (categoryIndex: number, questionIndex: number) => {
    if (!window.confirm('Delete this FAQ?')) return
    setDraft((prev) =>
      prev
        ? {
            ...prev,
            categories: prev.categories.map((cat, i) =>
              i === categoryIndex ? { ...cat, questions: cat.questions.filter((_, j) => j !== questionIndex) } : cat,
            ),
          }
        : prev,
    )
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft) return
    try {
      await saveSection({ data: draft, files }).unwrap()
      toast.success('FAQ page updated successfully')
      setFiles({})
    } catch (e: any) {
      toast.error(e?.data?.message || 'Unable to save FAQ page')
    }
  }

  if (isLoading) return <div className="p-4">Loading FAQs...</div>
  if (error)
    return (
      <div className="p-4">
        Could not load FAQs. <pre>{JSON.stringify(error, null, 2)}</pre>
        <button className="btn btn-primary" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    )
  if (!draft) return null

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="mb-0">FAQ Management</h4>
        <button form="faq-admin-form" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <form id="faq-admin-form" onSubmit={submit}>
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Banner and section content</h5>
            <button type="button" className="btn btn-soft-primary btn-sm" onClick={() => setShowBanner((v) => !v)}>
              {showBanner ? 'Hide' : 'Edit banner'}
            </button>
          </div>
          {showBanner && (
            <div className="card-body">
              {textFields.map(([key, label]) => (
                <div className="mb-3" key={key}>
                  <label className="form-label fw-semibold">{label}</label>
                  <div className="row g-3">
                    {langs.map((lang) => (
                      <div className="col-md-6" key={lang}>
                        <label className="form-label">{lang === 'en' ? 'English' : 'Arabic'}</label>
                        <textarea
                          className="form-control"
                          rows={key === 'description' ? 3 : 2}
                          dir={lang === 'ar' ? 'rtl' : 'ltr'}
                          value={draft[key][lang]}
                          onChange={(e) => setText(key, lang, e.target.value)}
                          disabled={saving}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <h6>Banner background images</h6>
              <div className="row g-3">
                {langs.map((lang) => (
                  <div className="col-md-6" key={lang}>
                    <label className="form-label">{lang === 'en' ? 'English' : 'Arabic'} image</label>
                    {draft.backgroundImage?.[lang]?.url && (
                      <div className="mb-2">
                        <img
                          src={draft.backgroundImage[lang].url}
                          alt="Banner preview"
                          style={{ maxWidth: 250, maxHeight: 130, objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      disabled={saving}
                      onChange={(e) => setFiles((prev) => ({ ...prev, [lang]: e.target.files?.[0] }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="mb-0">Categories ({draft.categories.length})</h5>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={saving}
              onClick={() => setEditor({ kind: 'category', categoryIndex: -1, value: newCategory(draft.categories.length) })}>
              + Add Category
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>English name</th>
                  <th>Arabic name</th>
                  <th>Questions</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {draft.categories.map((cat, index) => (
                  <tr key={cat._id || index}>
                    <td>{index + 1}</td>
                    <td>{cat.name.en || '—'}</td>
                    <td dir="rtl">{cat.name.ar || '—'}</td>
                    <td>{cat.questions.length}</td>
                    <td>{cat.order}</td>
                    <td>{cat.active ? 'Active' : 'Inactive'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-soft-primary btn-sm me-2"
                        onClick={() => setEditor({ kind: 'category', categoryIndex: index, value: structuredClone(cat) })}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => removeCategory(index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {draft.categories.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      No categories yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="mb-0">FAQs ({questions.length})</h5>
            <div className="d-flex gap-2 flex-wrap">
              <select
                className="form-select form-select-sm"
                style={{ width: 220 }}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All categories</option>
                {draft.categories.map((cat, index) => (
                  <option key={cat._id || index} value={String(index)}>
                    {cat.name.en || `Category ${index + 1}`}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={saving || !draft.categories.length}
                onClick={() => {
                  const index = categoryFilter === 'all' ? 0 : Number(categoryFilter)
                  setEditor({
                    kind: 'question',
                    categoryIndex: index,
                    sourceCategoryIndex: index,
                    questionIndex: -1,
                    value: newQuestion(draft.categories[index].questions.length),
                  })
                }}>
                + Add FAQ
              </button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Question (English)</th>
                  <th>Question (Arabic)</th>
                  <th>Category</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map(({ category, categoryIndex, question, questionIndex }, index) => (
                  <tr key={`${categoryIndex}-${question._id || questionIndex}`}>
                    <td>{index + 1}</td>
                    <td style={{ maxWidth: 280 }}>{question.question.en}</td>
                    <td dir="rtl" style={{ maxWidth: 280 }}>
                      {question.question.ar}
                    </td>
                    <td>{category.name.en}</td>
                    <td>{question.order}</td>
                    <td>{question.active ? 'Active' : 'Inactive'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-soft-primary btn-sm me-2"
                        onClick={() =>
                          setEditor({
                            kind: 'question',
                            categoryIndex,
                            sourceCategoryIndex: categoryIndex,
                            questionIndex,
                            value: structuredClone(question),
                          })
                        }>
                        Edit
                      </button>
                      <button type="button" className="btn btn-soft-danger btn-sm" onClick={() => removeQuestion(categoryIndex, questionIndex)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {questions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      No FAQs in this category
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {editor && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ background: 'rgba(0,0,0,.5)', zIndex: 1040 }}
            onClick={() => setEditor(null)}
          />
          <div
            className="position-fixed top-0 end-0 bg-white h-100 shadow-lg"
            style={{ width: 720, maxWidth: '100%', zIndex: 1050, overflowY: 'auto' }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
              <h5 className="mb-0">
                {editor.kind === 'category'
                  ? editor.categoryIndex < 0
                    ? 'Add Category'
                    : 'Edit Category'
                  : editor.questionIndex < 0
                    ? 'Add FAQ'
                    : 'Edit FAQ'}
              </h5>
              <button type="button" className="btn btn-sm btn-danger" onClick={() => setEditor(null)}>
                ✕
              </button>
            </div>
            <div className="p-3">
              {editor.kind === 'category' ? (
                <>
                  {langs.map((lang) => (
                    <div className="mb-3" key={lang}>
                      <label className="form-label">Category name ({lang === 'en' ? 'English' : 'Arabic'})</label>
                      <input
                        className="form-control"
                        dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        value={editor.value.name[lang]}
                        onChange={(e) =>
                          setEditor((prev) =>
                            prev?.kind === 'category'
                              ? { ...prev, value: { ...prev.value, name: { ...prev.value.name, [lang]: e.target.value } } }
                              : prev,
                          )
                        }
                      />
                    </div>
                  ))}
                  <label className="form-label">Order</label>
                  <input
                    className="form-control mb-3"
                    type="number"
                    value={editor.value.order}
                    onChange={(e) =>
                      setEditor((prev) => (prev?.kind === 'category' ? { ...prev, value: { ...prev.value, order: Number(e.target.value) } } : prev))
                    }
                  />
                  <label>
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={editor.value.active}
                      onChange={(e) =>
                        setEditor((prev) => (prev?.kind === 'category' ? { ...prev, value: { ...prev.value, active: e.target.checked } } : prev))
                      }
                    />
                    Active
                  </label>
                </>
              ) : (
                <>
                  <label className="form-label fw-semibold">Select category</label>
                  <select
                    className="form-select mb-3"
                    value={editor.categoryIndex}
                    onChange={(e) => setEditor((prev) => (prev?.kind === 'question' ? { ...prev, categoryIndex: Number(e.target.value) } : prev))}>
                    {draft.categories.map((cat, index) => (
                      <option key={cat._id || index} value={index}>
                        {cat.name.en || `Category ${index + 1}`}
                      </option>
                    ))}
                  </select>
                  {(['question', 'answer'] as const).map((field) => (
                    <div className="mb-3" key={field}>
                      <label className="form-label fw-semibold">{field === 'question' ? 'Question' : 'Answer'}</label>
                      <div className="row g-2">
                        {langs.map((lang) => (
                          <div className="col-md-6" key={lang}>
                            <label className="form-label">{lang === 'en' ? 'English' : 'Arabic'}</label>
                            <textarea
                              className="form-control"
                              rows={field === 'answer' ? 5 : 3}
                              dir={lang === 'ar' ? 'rtl' : 'ltr'}
                              value={editor.value[field][lang]}
                              onChange={(e) =>
                                setEditor((prev) =>
                                  prev?.kind === 'question'
                                    ? { ...prev, value: { ...prev.value, [field]: { ...prev.value[field], [lang]: e.target.value } } }
                                    : prev,
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <label className="form-label">Order</label>
                  <input
                    className="form-control mb-3"
                    type="number"
                    value={editor.value.order}
                    onChange={(e) =>
                      setEditor((prev) => (prev?.kind === 'question' ? { ...prev, value: { ...prev.value, order: Number(e.target.value) } } : prev))
                    }
                  />
                  <label>
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={editor.value.active}
                      onChange={(e) =>
                        setEditor((prev) => (prev?.kind === 'question' ? { ...prev, value: { ...prev.value, active: e.target.checked } } : prev))
                      }
                    />
                    Active
                  </label>
                </>
              )}
            </div>
            <div className="p-3 border-top d-flex gap-2">
              <button type="button" className="btn btn-light w-50" onClick={() => setEditor(null)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary w-50" onClick={saveEditor}>
                Apply Changes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
