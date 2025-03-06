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
      <div className="flex items-center justify-between px-4 py-2 border-b border-amber-100 dark:border-amber-800/30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <button
          onClick={() => setShowNavigation(prev => !prev)}
          className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          <span>Navigation</span>
        </button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">
          {isSaving ? (
            <span className="animate-pulse text-amber-600 dark:text-amber-400">Saving...</span>
          ) : lastSaved ? (
            <span>Last saved {lastSaved.toLocaleTimeString()}</span>
          ) : null}
        </div>
      </div>
      
      {/* Main content area with optional navigation sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation sidebar */}
        {showNavigation && (
          <div className="w-64 border-r border-amber-100 dark:border-amber-800/30 bg-stone-50 dark:bg-gray-800 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-3">Keyboard Shortcuts</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Toggle Navigation</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-300">Alt+N</kbd>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Save Document</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-300">Ctrl+S</kbd>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Toggle Fullscreen</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-300">F11</kbd>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Toggle Synopsis</span>
                  <kbd className="px-2 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 shadow-sm text-gray-700 dark:text-gray-300">Alt+S</kbd>
                </li>
              </ul>
              
              <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-3">Document Information</h3>
                <div className="bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 text-xs mb-1">
                    Created: <span className="text-amber-800 dark:text-amber-400">
                      {new Date().toLocaleDateString()}
                    </span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-xs">
                    Last modified: <span className="text-amber-800 dark:text-amber-400">
                      {new Date().toLocaleDateString()} 
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Editor content */}
        <div className="flex-1 overflow-auto">
          <Editor
            content={content}
            onChange={setContent}
            className="h-full"
            onExit={onExit}
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