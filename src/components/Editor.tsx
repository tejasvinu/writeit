'use client'

import { useEditor, EditorContent, Editor as TiptapEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useDocuments } from '@/context/DocumentContext'
import { useEffect, useCallback, useState, useRef } from 'react'
import { DocumentStatus } from '@/types/Document'

const MenuBar = ({ editor, onSave }: { editor: TiptapEditor | null; onSave: () => void }) => {
  if (!editor) {
    return null
  }

  const buttonBaseClass = "p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
  const activeClass = "bg-blue-50 text-blue-600 hover:bg-blue-100"

  return (
    <div className="flex gap-1 p-2">
      <button
        onClick={onSave}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-150 ease-in-out font-medium"
      >
        Save
      </button>
      <div className="w-px bg-gray-200 mx-2 self-stretch" />
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${buttonBaseClass} ${editor.isActive('bold') ? activeClass : ''}`}
        title="Bold (Ctrl+B)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h8a4 4 0 0 0 0-8H6v8zm0 0h8a4 4 0 1 1 0 8H6v-8z" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${buttonBaseClass} ${editor.isActive('italic') ? activeClass : ''}`}
        title="Italic (Ctrl+I)"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h4m-2 0v12m-6-4h8" />
        </svg>
      </button>

      <div className="w-px bg-gray-200 mx-2 self-stretch" />
      
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`${buttonBaseClass} ${editor.isActive('paragraph') ? activeClass : ''}`}
        title="Paragraph"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`${buttonBaseClass} ${editor.isActive('heading', { level: 1 }) ? activeClass : ''}`}
        title="Heading 1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${buttonBaseClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}
        title="Heading 2"
      >
        H2
      </button>
      
      <div className="w-px bg-gray-200 mx-2 self-stretch" />
      
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${buttonBaseClass} ${editor.isActive('bulletList') ? activeClass : ''}`}
        title="Bullet List"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16M8 6a2 2 0 11-4 0 2 2 0 014 0zM8 12a2 2 0 11-4 0 2 2 0 014 0zM8 18a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>
    </div>
  )
}

export default function Editor() {
  const { currentDocument, updateDocument, saveDocument } = useDocuments()
  const [wordCount, setWordCount] = useState(0)
  const [localTitle, setLocalTitle] = useState(currentDocument?.title || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const contentRef = useRef<string | null>(null)
  
  // Update local title when document changes
  useEffect(() => {
    if (currentDocument?.title) {
      setLocalTitle(currentDocument.title)
    }
  }, [currentDocument?.title])

  // Debounced title update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentDocument && localTitle !== currentDocument.title) {
        updateDocument(currentDocument._id, { title: localTitle })
      }
    }, 500) // Wait 500ms after last change before updating

    return () => clearTimeout(timer)
  }, [localTitle, currentDocument, updateDocument])

  // Store current content for comparison
  useEffect(() => {
    if (currentDocument?.content) {
      contentRef.current = currentDocument.content
    }
  }, [currentDocument?.content])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
    ],
    content: currentDocument?.content || '<p>Start writing here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[calc(100vh-12rem)] prose-headings:font-serif prose-h1:text-4xl prose-h2:text-3xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 prose-strong:text-gray-900 prose-em:text-gray-900 prose-ul:my-6 prose-li:my-2 prose-img:rounded-lg',
      },
    },
    onUpdate: ({ editor }) => {
      // Calculate word count
      const text = editor.getText()
      const count = text.split(/\s+/).filter(word => word.length > 0).length
      setWordCount(count)

      // Clear any existing save timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }

      // Set new debounced save timeout
      saveTimeoutRef.current = setTimeout(() => {
        const html = editor.getHTML()
        
        // Only save if content actually changed
        if (currentDocument && html !== contentRef.current) {
          contentRef.current = html  // Update ref to avoid redundant saves
          handleSaveContent(html, count)
        }
      }, 1000) // 1 second debounce
    }
  })

  // Clean up save timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Update editor content when document changes
  useEffect(() => {
    if (editor && currentDocument?.content && !editor.isFocused) {
      contentRef.current = currentDocument.content
      editor.commands.setContent(currentDocument.content)
    }
  }, [currentDocument, editor])

  const handleSaveContent = async (content: string, count: number) => {
    if (!currentDocument || isSaving) return
    
    try {
      console.log('Saving content, length:', content.length)
      setIsSaving(true)
      setSaveError(null)
      
      const updatedDoc = {
        ...currentDocument,
        content: content,
        updatedAt: new Date(),
        metadata: {
          ...currentDocument.metadata,
          wordCount: count
        }
      }
      
      await saveDocument(updatedDoc)
    } catch (error) {
      console.error('Failed to save:', error)
      setSaveError('Failed to save document')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSave = useCallback(async () => {
    if (!currentDocument || !editor || isSaving) return
    
    try {
      setIsSaving(true)
      setSaveError(null)
      const html = editor.getHTML()
      contentRef.current = html // Update ref to avoid redundant saves
      
      const updatedDoc = {
        ...currentDocument,
        content: html,
        updatedAt: new Date(),
        metadata: {
          ...currentDocument.metadata,
          wordCount
        }
      }
      
      await saveDocument(updatedDoc)
    } catch (error) {
      console.error('Failed to save:', error)
      setSaveError('Failed to save document')
    } finally {
      setIsSaving(false)
    }
  }, [currentDocument, editor, saveDocument, wordCount, isSaving])

  // Keyboard shortcut for save
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    
    document.addEventListener('keydown', handleKeyboard)
    return () => document.removeEventListener('keydown', handleKeyboard)
  }, [handleSave])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value)
  }

  return (
    <div className="border rounded-lg shadow-sm h-full flex flex-col bg-white">
      <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
        <input
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          className="text-2xl font-serif bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded px-2 py-1 flex-grow"
          placeholder="Chapter Title"
        />
        <div className="flex items-center space-x-4 text-sm">
          {saveError && (
            <span className="text-red-500">{saveError}</span>
          )}
          {isSaving && (
            <span className="text-gray-500">Saving...</span>
          )}
          <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-600">{wordCount} words</span>
          <select 
            value={currentDocument?.metadata?.status || 'draft'}
            onChange={(e) => {
              if (currentDocument && editor) {
                const updatedDoc = {
                  ...currentDocument,
                  metadata: {
                    ...currentDocument.metadata,
                    status: e.target.value as DocumentStatus
                  }
                }
                saveDocument(updatedDoc)
              }
            }}
            className="border rounded-full px-3 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="revision">Revision</option>
            <option value="final">Final</option>
          </select>
        </div>
      </div>
      <div className="border-b bg-gray-50/50">
        <MenuBar editor={editor} onSave={handleSave} />
      </div>
      <div className="flex-grow p-8 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </div>
      <div className="border-t bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">Synopsis</label>
          <textarea
            placeholder="Write a brief summary of this chapter..."
            value={currentDocument?.metadata?.synopsis || ''}
            onChange={(e) => {
              if (currentDocument) {
                const updatedDoc = {
                  ...currentDocument,
                  metadata: {
                    ...currentDocument.metadata,
                    synopsis: e.target.value
                  }
                }
                saveDocument(updatedDoc)
              }
            }}
            className="w-full h-24 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 placeholder-gray-400 bg-white resize-none"
          />
        </div>
      </div>
    </div>
  )
}