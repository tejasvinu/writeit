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

// Create a unified document creation function that can be shared across components
export const createNewItem = async (
  isFolder: boolean, 
  currentPath: string, 
  createDocument: (doc: any) => Promise<any>
) => {
  try {
    return await createDocument({
      title: isFolder ? 'New Folder' : 'Untitled',
      isFolder,
      parentPath: currentPath
    })
  } catch (error) {
    console.error('Failed to create:', error)
    return null
  }
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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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
    const newDoc = await createNewItem(isFolder, currentPath, createDocument)
    if (newDoc && !isFolder) {
      router.push(`/editor?id=${newDoc._id}`)
    }
    setContextMenu(null)
  }, [createDocument, currentPath, router])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm">
      <ExplorerHeader />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Folder tree sidebar */}
          <div className="w-64 border-r border-accent-subtle bg-surface-elevated/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div 
              className="space-y-2 relative"
              onContextMenu={(e) => handleContextMenu(e, 'background')}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Animated highlight for hovered items */}
              {hoveredItem && (
                <div 
                  className="absolute inset-0 bg-primary-subtle rounded-lg transition-all duration-300 transform"
                  style={{
                    top: `${documents.findIndex(d => d._id === hoveredItem) * 2.5}rem`,
                    height: '2.5rem'
                  }}
                />
              )}
              <FolderTree 
                path="/root" 
                onHover={setHoveredItem}
              />
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-background-soft">
            <div className="animate-fade-in">
              <DocumentViews
                documents={documents}
                onContextMenu={handleContextMenu}
                onFolderClick={(doc) => setCurrentPath(doc.path)}
                onHover={setHoveredItem}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Context menu with enhanced animation */}
      {contextMenu && (
        <div className="fixed inset-0 bg-surface-light backdrop-blur-sm z-50 animate-fade-in">
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            type={contextMenu.type}
            onClose={() => setContextMenu(null)}
            onRename={contextMenu.id ? (newTitle) => handleRename(contextMenu.id!, newTitle) : undefined}
            onDelete={contextMenu.id ? () => handleDelete(contextMenu.id!) : undefined}
            onCreateNew={handleCreateNew}
          />
        </div>
      )}
    </div>
  )
}