'use client'

import { useEffect, useState } from 'react'
import { useDocuments } from '@/context/DocumentContext'
import Link from 'next/link'
import FileExplorer from './FileExplorer'

export default function DocumentList() {
  const {
    documents,
    isLoading,
    error,
    createDocument,
    currentPath,
    setCurrentPath,
  } = useDocuments()
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleCreateNew = async (isFolder: boolean = false) => {
    setIsCreating(true)
    try {
      const doc = await createDocument({
        title: 'Untitled',
        isFolder,
      })
      if (!isFolder) {
        window.location.href = `/editor?id=${doc._id}`
      }
    } catch (error) {
      console.error('Failed to create document:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-semibold">Documents</h1>
        <div className="space-x-2">
          <button
            onClick={() => handleCreateNew(true)}
            disabled={isCreating}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150"
          >
            New Folder
          </button>
          <button
            onClick={() => handleCreateNew(false)}
            disabled={isCreating}
            className="px-4 py-2 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors duration-150"
          >
            New Document
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <FileExplorer />
        )}
      </div>
    </div>
  )
}