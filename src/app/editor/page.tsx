'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDocuments } from '@/context/DocumentContext'
import ClientEditor from '@/components/ClientEditor'
import StatisticsSidebar from '@/components/StatisticsSidebar'

function EditorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const documentId = searchParams.get('id')
  const { currentDocument, loadDocument, isLoading } = useDocuments()
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    if (documentId) {
      loadDocument(documentId)
    }
  }, [documentId, loadDocument])

  // Handle exit from editor back to documents view
  const handleExit = () => {
    router.push('/documents');
  }

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Alt+T to toggle statistics sidebar
    if (e.altKey && e.key === 't') {
      e.preventDefault()
      setShowStats(prev => !prev)
    }
  }, [])

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div className="h-screen-minus-nav bg-white dark:bg-background relative">
      {/* Editor Area - Takes full width */}
      <div className="h-full w-full relative">
        {!documentId ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">No document selected</p>
          </div>
        ) : !currentDocument || isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="h-full">
            <ClientEditor 
              document={currentDocument} 
              onExit={handleExit} 
            />
            
            {/* Statistics Sidebar */}
            <StatisticsSidebar 
              content={currentDocument?.content || ''}
              isVisible={showStats}
              onClose={() => setShowStats(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen-minus-nav flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  )
}