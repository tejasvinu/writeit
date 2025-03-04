'use client'

import { useEffect, useState } from 'react'
import Editor from './Editor'
import { useDocuments } from '@/context/DocumentContext'
import { useRouter } from 'next/navigation'

interface ClientEditorProps {
  document: {
    _id: string
    title: string
    content: string
  }
  onExit: () => void
}

export default function ClientEditor({ document: documentProp, onExit }: ClientEditorProps) {
  const [content, setContent] = useState(documentProp.content)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showNavigation, setShowNavigation] = useState(false)
  const { updateDocument } = useDocuments()
  const router = useRouter()

  // Auto-save functionality
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const saveContent = async () => {
      try {
        setIsSaving(true)
        await updateDocument(documentProp._id, { content })
        setLastSaved(new Date())
      } catch (error) {
        console.error('Failed to save document:', error)
      } finally {
        setIsSaving(false)
      }
    }

    if (content !== documentProp.content) {
      timeoutId = setTimeout(saveContent, 1000) // Save after 1 second of no typing
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [content, documentProp._id, documentProp.content, updateDocument])

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'n') {
        e.preventDefault()
        setShowNavigation(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-amber-100">
        <button
          onClick={() => setShowNavigation(prev => !prev)}
          className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-amber-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <span>Navigation</span>
        </button>
        
        <div className="text-sm text-gray-500" aria-live="polite">
          {isSaving ? (
            <span className="animate-pulse">Saving...</span>
          ) : lastSaved ? (
            <span>Last saved {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>
      </div>
      
      {/* Main content area with optional navigation sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation sidebar */}
        {showNavigation && (
          <div className="w-64 border-r bg-stone-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-amber-800 mb-3">Keyboard Shortcuts</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Toggle Navigation</span>
                  <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300 shadow-sm">Alt+N</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Save Document</span>
                  <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300 shadow-sm">Ctrl+S</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Toggle Fullscreen</span>
                  <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300 shadow-sm">F11</kbd>
                </li>
                <li className="flex justify-between">
                  <span>Toggle Synopsis</span>
                  <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300 shadow-sm">Alt+S</kbd>
                </li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Editor content */}
        <div className="flex-1 overflow-auto">
          <Editor
            content={content}
            onChange={setContent}
            className="h-full"
          />
        </div>
      </div>
      
      {/* Accessibility message */}
      <div className="sr-only" aria-live="polite">
        Press Alt+N to toggle navigation panel.
      </div>
    </div>
  )
}