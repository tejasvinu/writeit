'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useDocuments } from '@/context/DocumentContext'
import ClientEditor from '@/components/ClientEditor'

function EditorContent() {
  const searchParams = useSearchParams()
  const documentId = searchParams.get('id')
  const { currentDocument, loadDocument, isLoading } = useDocuments()

  useEffect(() => {
    if (documentId) {
      loadDocument(documentId)
    }
  }, [documentId, loadDocument])

  if (!documentId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">No document selected</p>
      </div>
    )
  }

  if (!currentDocument || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <ClientEditor document={currentDocument} />
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  )
}