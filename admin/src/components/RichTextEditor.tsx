'use client'

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'

const COLORS = [
  { label: 'Green', value: '#00852B' },
  { label: 'Gold', value: '#fab923' },
  { label: 'Black', value: '#111111' },
]

type Props = {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
  dir?: 'ltr' | 'rtl'
  lang?: string
}

const RichTextEditor = ({ value, onChange, disabled = false, dir = 'ltr', lang = 'en' }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, Color],
    content: value,
    editable: !disabled,
    immediatelyRender: false, // avoids SSR hydration mismatch in Next.js
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'form-control form-control-sm',
        dir,
        lang,
        style: 'min-height: 110px; height: auto; white-space: pre-wrap;',
      },
    },
  })

  // Keep the editor in sync when the parent value changes from outside
  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [disabled, editor])

  if (!editor) return null

  const toolBtn = (active: boolean, onClick: () => void, label: React.ReactNode, title: string) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={`btn btn-sm ${active ? 'btn-primary' : 'btn-light'}`}
      onMouseDown={(e) => e.preventDefault()} // keeps the text selection
      onClick={onClick}
      disabled={disabled}>
      {label}
    </button>
  )

  return (
    <div>
      <div className="d-flex flex-wrap gap-1 mb-1">
        {toolBtn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <b>B</b>, 'Bold')}
        {toolBtn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <i>I</i>, 'Italic')}
        {COLORS.map((c) =>
          toolBtn(
            editor.isActive('textStyle', { color: c.value }),
            () => editor.chain().focus().setColor(c.value).run(),
            <span style={{ color: c.value, fontWeight: 700 }}>A</span>,
            c.label,
          ),
        )}
        {toolBtn(false, () => editor.chain().focus().unsetColor().run(), 'Default color', 'Default color')}
        {toolBtn(false, () => editor.chain().focus().clearNodes().unsetAllMarks().run(), 'Clear', 'Clear formatting')}
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

export default RichTextEditor
