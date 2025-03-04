'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useDocuments } from '@/context/DocumentContext'
import ClientEditor from '@/components/ClientEditor'

function EditorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const documentId = searchParams.get('id')
  const { currentDocument, loadDocument, isLoading } = useDocuments()

  useEffect(() => {
    if (documentId) {
      loadDocument(documentId)
    }
  }, [documentId, loadDocument])

  // Handle exit from editor back to documents view
  const handleExit = () => {
    router.push('/documents');
  }

  return (
    <div className="h-screen-minus-nav bg-white">
      {/* Editor Area - Takes full width */}
      <div className="h-full w-full relative">
        {!documentId ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No document selected</p>
          </div>
        ) : !currentDocument || isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="h-full">
            <ClientEditor document={currentDocument} onExit={handleExit} />
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