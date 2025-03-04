'use client'

import { useEffect, useState } from 'react'
import { useDocuments } from '@/context/DocumentContext'
import Link from 'next/link'
import FileExplorer from './FileExplorer'
import { FolderPlusIcon, DocumentPlusIcon } from '@heroicons/react/24/outline'

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
  const [buttonHovered, setButtonHovered] = useState<string | null>(null)

  const handleCreateNew = async (isFolder: boolean = false) => {
    setIsCreating(true)
    try {
      const doc = await createDocument({
        title: 'Untitled',
        isFolder,
        parentPath: currentPath,
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
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-error-light text-error">
        <svg className="w-12 h-12 text-error mb-4 animate-pulse-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-lg font-medium mb-2 animate-fade-in">Something went wrong</p>
        <p className="text-sm max-w-md text-center opacity-80">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-error text-white rounded-lg hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background-soft to-background">
      {/* Floating decoration elements with enhanced animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-subtle rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-accent-subtle rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-primary-subtle/50 rounded-full blur-2xl animate-float"></div>
      </div>
      
      <div className="relative z-10 flex justify-between items-center p-6 border-b border-accent-subtle backdrop-blur-sm bg-surface-elevated/30">
        <h1 className="text-2xl font-serif text-foreground relative group">
          Your Documents
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-light via-primary to-primary-light transition-all duration-300 group-hover:w-full"></span>
        </h1>
        <div className="space-x-3">
          <button
            onClick={() => handleCreateNew(true)}
            disabled={isCreating}
            onMouseEnter={() => setButtonHovered('folder')}
            onMouseLeave={() => setButtonHovered(null)}
            className="px-4 py-2 text-sm border border-primary-light/30 bg-surface text-primary-dark hover:bg-primary-subtle rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md inline-flex items-center group"
          >
            <FolderPlusIcon className="w-4 h-4 mr-1.5 transition-transform duration-300 group-hover:scale-110" />
            New Folder
            {buttonHovered === 'folder' && (
              <span className="ml-1.5 animate-blink">|</span>
            )}
          </button>
          <button
            onClick={() => handleCreateNew(false)}
            disabled={isCreating}
            onMouseEnter={() => setButtonHovered('document')}
            onMouseLeave={() => setButtonHovered(null)}
            className="px-4 py-2 text-sm bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg inline-flex items-center group relative overflow-hidden"
          >
            <div className="absolute inset-0 w-3/4 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
            <DocumentPlusIcon className="w-4 h-4 mr-1.5 transition-transform duration-300 group-hover:scale-110 relative" />
            <span className="relative">New Document</span>
            {buttonHovered === 'document' && (
              <span className="ml-1.5 animate-blink">|</span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto relative z-10">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-l-2 border-primary"></div>
            <p className="mt-4 text-primary font-serif animate-pulse-subtle">Loading your literary works...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            <FileExplorer />
          </div>
        )}
      </div>
      
      {/* Enhanced inspirational quote footer */}
      <div className="p-4 border-t border-accent-subtle backdrop-blur-sm bg-surface-elevated/30 text-center text-sm text-primary-dark italic font-serif relative z-10 group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-subtle/0 via-primary-subtle to-primary-subtle/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <p className="relative transition-transform duration-300 group-hover:scale-105">
          "The scariest moment is always just before you start." — Stephen King
        </p>
      </div>
    </div>
  )
}