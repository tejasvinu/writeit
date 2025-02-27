'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Editor from './Editor'
import { useDocuments } from '@/context/DocumentContext'

interface ClientEditorProps {
  document: {
    _id: string
    title: string
    content: string
  }
}

export default function ClientEditor({ document }: ClientEditorProps) {
  const [content, setContent] = useState(document.content)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const { updateDocument } = useDocuments()
  const router = useRouter()

  // Auto-save functionality
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const saveContent = async () => {
      try {
        setIsSaving(true)
        await updateDocument(document._id, { content })
        setLastSaved(new Date())
      } catch (error) {
        console.error('Failed to save document:', error)
      } finally {
        setIsSaving(false)
      }
    }

    if (content !== document.content) {
      timeoutId = setTimeout(saveContent, 1000) // Save after 1 second of no typing
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [content, document._id, document.content, updateDocument])

  const handleBack = () => {
    router.push('/documents')
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b bg-white px-4 py-2 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back to Documents</span>
        </button>
        <div className="text-sm text-gray-500">
          {isSaving ? (
            'Saving...'
          ) : lastSaved ? (
            `Last saved ${lastSaved.toLocaleTimeString()}`
          ) : null}
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <Editor
          content={content}
          onChange={setContent}
          className="max-w-4xl mx-auto p-8"
        />
      </div>
    </div>
  )
}