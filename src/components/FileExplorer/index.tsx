'use client'

import { useDocuments } from '@/context/DocumentContext'
import { ExplorerHeader, FolderTree } from './ExplorerComponents'
import { DocumentViews } from './DocumentViews'
import { useRouter } from 'next/navigation'
import { useEffect, useCallback, useState } from 'react'
import ContextMenu from './ContextMenu'

interface ContextMenuState {
  x: number;
  y: number;
  type: 'document' | 'folder' | 'background';
  id: string | null;
}

export default function FileExplorer() {
  const router = useRouter()
  const {
    documents,
    currentDocument,
    currentPath,
    viewMode,
    searchQuery,
    sortOption,
    createDocument,
    updateDocument,
    deleteDocument,
    setCurrentPath,
  } = useDocuments()

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  const handleDocumentSelect = useCallback((id: string) => {
    router.push(`/editor?id=${id}`)
  }, [router])

  const handleContextMenu = useCallback((e: React.MouseEvent, type: ContextMenuState['type'], id?: string) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type,
      id: id || null
    })
  }, [])

  const handleRename = useCallback(async (id: string, newTitle: string) => {
    try {
      await updateDocument(id, { title: newTitle })
      setContextMenu(null)
    } catch (error) {
      console.error('Failed to rename:', error)
    }
  }, [updateDocument])

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteDocument(id)
      setContextMenu(null)
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }, [deleteDocument])

  const handleCreateNew = useCallback(async (isFolder: boolean) => {
    try {
      await createDocument({
        title: isFolder ? 'New Folder' : 'Untitled',
        isFolder,
        parentPath: currentPath
      })
      setContextMenu(null)
    } catch (error) {
      console.error('Failed to create:', error)
    }
  }, [createDocument, currentPath])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      // Create new document: Ctrl+N
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault()
        handleCreateNew(false)
      }
      
      // Create new folder: Ctrl+Shift+N
      if (e.ctrlKey && e.shiftKey && e.key === 'N') {
        e.preventDefault()
        handleCreateNew(true)
      }

      // Delete: Delete key
      if (e.key === 'Delete' && currentDocument) {
        e.preventDefault()
        handleDelete(currentDocument._id)
      }

      // Rename: F2
      if (e.key === 'F2' && currentDocument) {
        e.preventDefault()
        setContextMenu({
          type: 'document',
          id: currentDocument._id,
          x: 0,
          y: 0
        })
      }

      // Navigate back: Backspace
      if (e.key === 'Backspace' && currentPath !== '/root') {
        e.preventDefault()
        const parentPath = currentPath.split('/').slice(0, -1).join('/')
        setCurrentPath(parentPath || '/root')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentDocument, currentPath, handleCreateNew, handleDelete, setCurrentPath])

  return (
    <div className="h-full flex flex-col">
      <ExplorerHeader />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Folder tree sidebar */}
          <div className="w-64 border-r p-4 overflow-y-auto">
            <div 
              className="space-y-2"
              onContextMenu={(e) => handleContextMenu(e, 'background')}
            >
              <FolderTree path="/root" />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-y-auto">
            <DocumentViews
              documents={documents}
              onContextMenu={handleContextMenu}
              onFolderClick={(doc) => setCurrentPath(doc.path)}
            />
          </div>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          onClose={() => setContextMenu(null)}
          onRename={contextMenu.id ? (newTitle) => handleRename(contextMenu.id!, newTitle) : undefined}
          onDelete={contextMenu.id ? () => handleDelete(contextMenu.id!) : undefined}
          onCreateNew={handleCreateNew}
        />
      )}
    </div>
  )
}