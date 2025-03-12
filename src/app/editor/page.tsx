'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useDocuments } from '@/context/DocumentContext'
import ClientEditor from '@/components/ClientEditor'
import StatisticsSidebar from '@/components/StatisticsSidebar'
import { useSession } from 'next-auth/react'

function EditorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const documentId = searchParams.get('id')
  const { currentDocument, loadDocument, isLoading } = useDocuments()
  const [showStats, setShowStats] = useState(false)
  const { status } = useSession()
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [contentLoading, setContentLoading] = useState(true)

  // Check authentication status once to avoid loops
  useEffect(() => {
    if (!initialLoadComplete) {
      setInitialLoadComplete(true);

      // Let middleware handle unauthorized users
      if (status === 'authenticated' && documentId) {
        loadDocument(documentId).finally(() => {
          setContentLoading(false);
        });
      } else if (status === 'unauthenticated') {
        // Let middleware handle redirect
        setContentLoading(false);
      }
    }
  }, [status, documentId, loadDocument, initialLoadComplete]);

  // When status changes to authenticated after initial load
  useEffect(() => {
    if (initialLoadComplete && status === 'authenticated' && documentId) {
      loadDocument(documentId).finally(() => {
        setContentLoading(false);
      });
    }
  }, [status, initialLoadComplete, documentId, loadDocument]);

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

  // Show loading state while checking authentication
  if (contentLoading) {
    return (
      <div className="h-screen-minus-nav flex items-center justify-center bg-white dark:bg-background">
        <div className="relative">
          <div className="w-16 h-20 bg-amber-700 dark:bg-amber-600 rounded-sm animate-book-bounce"></div>
          <div className="absolute top-0 left-0 w-16 h-20 border-r-4 border-amber-900 dark:border-amber-800 rounded-sm animate-page-turn"></div>
          <p className="text-amber-800 dark:text-amber-400 mt-4">Preparing your editor...</p>
        </div>
      </div>
    );
  }

  // For unauthenticated state, middleware should handle redirect

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