'use client'

import { DocumentIcon, EllipsisVerticalIcon, FolderIcon, ClockIcon, CalendarIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { useState, useEffect } from 'react'
import { useDocuments } from '@/context/DocumentContext'
import { Document, DocumentMetadata, DocumentType, ViewMode } from '@/types/Document'
import { MouseEvent } from 'react'
import { createNewItem } from './index'
import { useRouter } from 'next/navigation'

interface LocalDocument {
  _id: string
  title: string
  content: string
  isFolder: boolean
  path: string
  updatedAt: string
  metadata?: DocumentMetadata
}

interface DocumentViewsProps {
  documents: LocalDocument[]
  onContextMenu: (e: React.MouseEvent, type: 'document' | 'folder', id: string) => void
  onFolderClick: (doc: LocalDocument) => void
  onHover?: (id: string | null) => void
}

export function DocumentViews({ documents, onContextMenu, onFolderClick, onHover }: DocumentViewsProps) {
  const router = useRouter()
  const { viewMode, currentPath, createDocument, setCurrentPath } = useDocuments()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  // Filter documents based on current path
  const currentDocuments = documents.filter(doc => {
    const parentPath = doc.path.substring(0, doc.path.lastIndexOf('/'))
    return parentPath === currentPath
  })

  // Separate folders and documents
  const folders = currentDocuments.filter(doc => doc.isFolder)
  const docs = currentDocuments.filter(doc => !doc.isFolder)

  const handleSelect = (doc: LocalDocument) => {
    if (doc.isFolder) {
      onFolderClick(doc)
    } else {
      router.push(`/editor?id=${doc._id}`)
    }
  }

  const handleCreateNewDocument = async () => {
    const newDoc = await createNewItem(false, currentPath, createDocument)
    if (newDoc) {
      router.push(`/editor?id=${newDoc._id}`)
    }
  }

  // Build breadcrumb segments with path information
  const buildBreadcrumbs = () => {
    let normalizedPath = currentPath
    if (normalizedPath.startsWith('/root/root')) {
      normalizedPath = '/root' + normalizedPath.substring(10)
    }
    
    const segments = normalizedPath.split('/').filter(segment => segment)
    const breadcrumbs = []
    
    breadcrumbs.push({
      name: 'root',
      path: '/root',
      isLast: segments.length === 0
    })
    
    let currentSegmentPath = '/root'
    for (let i = 0; i < segments.length; i++) {
      if (segments[i] === 'root' && i === 0) continue
      
      currentSegmentPath += `/${segments[i]}`
      breadcrumbs.push({
        name: segments[i],
        path: currentSegmentPath,
        isLast: i === segments.length - 1
      })
    }
    
    return breadcrumbs
  }
  
  const breadcrumbs = buildBreadcrumbs()
  
  useEffect(() => {
    const items = document.querySelectorAll('.document-item')
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.remove('opacity-0')
        item.classList.remove('translate-y-2')
        ;(item as HTMLElement).style.opacity = '1'
        ;(item as HTMLElement).style.transform = 'translateY(0)'
      }, index * 50)
    })
  }, [currentPath, folders.length, docs.length])

  return (
    <div className="p-4 bg-gradient-to-br from-background-soft to-background min-h-full relative">
      {/* Floating decoration elements */}
      <div className="hidden md:block fixed z-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="animate-float absolute top-20 left-[10%] opacity-10">
          <svg className="w-16 h-16 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 6.253v13h-1.499V6.253L6.003 12.25l-1.061-1.06L12 4.132l7.059 7.059-1.061 1.06L12 6.253Z"/>
          </svg>
        </div>
        <div className="animate-paper-float-slow absolute bottom-1/3 right-[10%]">
          <div className="w-20 h-24 bg-surface shadow-md rounded-sm opacity-20 -rotate-6"></div>
        </div>
      </div>
      
      {/* Path breadcrumb */}
      <div className="mb-6 relative z-10">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center flex-wrap">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.path}>
                <div className="flex items-center">
                  {index > 0 && <span className="mx-2 text-foreground-muted">/</span>}
                  <button
                    onClick={() => {
                      if (crumb.name === 'root') {
                        setCurrentPath('/root')
                      } else {
                        setCurrentPath(crumb.path)
                      }
                    }}
                    className={`text-sm font-medium transition-all duration-300 ${
                      crumb.isLast 
                        ? 'text-primary' 
                        : 'text-foreground-muted hover:text-primary relative group'
                    }`}
                  >
                    {crumb.name}
                    {!crumb.isLast && (
                      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-light via-primary to-primary-light opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-300"></span>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </nav>
        <div className="mt-1 h-0.5 w-16 bg-gradient-to-r from-primary via-primary-light to-primary rounded-full transition-all duration-500"></div>
      </div>

      {/* Folders section */}
      {folders.length > 0 && (
        <div className="mb-8 relative z-10">
          <h2 className="text-sm font-medium text-primary mb-4 tracking-wide">Folders</h2>
          <div className="grid grid-cols-1 gap-3">
            {folders.map((folder) => (
              <div
                key={folder._id}
                onClick={() => handleSelect(folder)}
                onContextMenu={(e) => onContextMenu(e, 'folder', folder._id)}
                onMouseEnter={() => {
                  setHoveredItem(folder._id)
                  onHover?.(folder._id)
                }}
                onMouseLeave={() => {
                  setHoveredItem(null)
                  onHover?.(null)
                }}
                className="document-item flex items-center p-3 rounded-lg border border-accent-subtle cursor-pointer group 
                  bg-surface shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 
                  opacity-0 translate-y-2"
              >
                <div className={`p-2 rounded-lg transition-colors duration-300 
                  ${hoveredItem === folder._id ? 'bg-primary-subtle' : 'bg-accent-subtle/50'}`}>
                  <FolderIcon className="w-5 h-5 text-primary transition-colors duration-300" />
                </div>
                <div className="flex-1 ml-3">
                  <h3 className="text-sm font-medium text-foreground group-hover:text-primary-dark transition-colors duration-300">{folder.title}</h3>
                  <p className="text-xs text-foreground-muted">
                    {formatDistanceToNow(new Date(folder.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                <div className={`p-1 rounded-full transition-colors duration-300 
                  ${hoveredItem === folder._id ? 'bg-primary-subtle' : 'bg-surface'}`}>
                  <EllipsisVerticalIcon className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents section */}
      {docs.length > 0 ? (
        <div className="relative z-10">
          <h2 className="text-sm font-medium text-primary mb-4 tracking-wide">Documents</h2>
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
          }>
            {docs.map((doc, index) => (
              <DocumentItem
                key={doc._id}
                document={doc}
                viewMode={viewMode}
                onSelect={() => handleSelect(doc)}
                onContextMenu={onContextMenu}
                index={index}
                isHovered={hoveredItem === doc._id}
                onHover={() => {
                  setHoveredItem(doc._id)
                  onHover?.(doc._id)
                }}
                onLeave={() => {
                  setHoveredItem(null)
                  onHover?.(null)
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-surface rounded-xl border border-accent-subtle shadow-sm relative z-10">
          <DocumentIcon className="mx-auto h-12 w-12 text-primary-light animate-float" />
          <h3 className="mt-2 text-sm font-medium text-foreground">No documents</h3>
          <p className="mt-1 text-sm text-foreground-muted">Get started by creating a new document.</p>
          <div className="mt-6">
            <button
              onClick={handleCreateNewDocument}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white
                bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary
                transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105
                relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-3/4 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent 
                transition-transform duration-500 group-hover:translate-x-full"></div>
              <PlusIcon className="h-5 w-5 mr-2 relative" />
              <span className="relative">New Document</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface DocumentItemProps {
  document: LocalDocument
  viewMode: ViewMode
  onSelect: () => void
  onContextMenu: (e: React.MouseEvent, type: 'document' | 'folder', id: string) => void
  index: number
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'draft': return 'bg-primary-subtle text-primary-dark'
    case 'revision': return 'bg-accent-subtle text-primary'
    case 'final': return 'bg-success-light text-success'
    default: return 'bg-primary-subtle/50 text-primary'
  }
}

const getTypeColor = (type?: DocumentType) => {
  switch (type) {
    case 'chapter': return 'bg-primary-subtle text-primary'
    case 'scene': return 'bg-accent-subtle text-primary-dark'
    case 'character': return 'bg-primary-subtle/70 text-primary'
    case 'plotline': return 'bg-accent-subtle text-primary'
    case 'note': return 'bg-primary-subtle/50 text-primary'
    default: return 'bg-primary-subtle/30 text-primary'
  }
}

function DocumentItem({ document, viewMode, onSelect, onContextMenu, index, isHovered, onHover, onLeave }: DocumentItemProps) {
  if (viewMode === 'grid') {
    return (
      <div
        onClick={onSelect}
        onContextMenu={(e) => onContextMenu(e, 'document', document._id)}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        className="document-item p-4 rounded-xl border border-accent-subtle bg-surface shadow-sm cursor-pointer 
          transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 opacity-0 translate-y-2 group"
      >
        <div className={`flex items-center justify-center w-full h-32 rounded-lg mb-3 transition-colors duration-300
          ${isHovered ? 'bg-primary-subtle/70' : getTypeColor(document.metadata?.type)}`}>
          <DocumentIcon className="w-12 h-12 transition-transform duration-300 group-hover:scale-110" />
        </div>
        <h3 className="font-medium truncate mb-2 text-foreground group-hover:text-primary-dark transition-colors duration-300">
          {document.title}
        </h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-foreground-muted">{document.metadata?.wordCount || 0} words</span>
          {document.metadata?.status && (
            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(document.metadata.status)}`}>
              {document.metadata.status}
            </span>
          )}
        </div>
        <p className="text-xs text-foreground-muted mt-2">
          {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
        </p>
      </div>
    )
  }

  return (
    <div
      onClick={onSelect}
      onContextMenu={(e) => onContextMenu(e, 'document', document._id)}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="document-item flex items-center justify-between p-3 rounded-lg cursor-pointer bg-surface 
        border border-accent-subtle shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 
        opacity-0 translate-y-2 group"
    >
      <div className="flex items-center space-x-3 flex-grow min-w-0">
        <div className={`p-2 rounded-lg transition-all duration-300 ${
          isHovered ? 'bg-primary-subtle scale-110' : getTypeColor(document.metadata?.type)
        }`}>
          <DocumentIcon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-grow">
          <h3 className="font-medium truncate text-foreground group-hover:text-primary-dark transition-colors duration-300">
            {document.title}
          </h3>
          <div className="flex items-center space-x-2 text-xs mt-0.5 text-foreground-muted">
            <span>
              {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
            </span>
            <span className="text-foreground-muted/30">•</span>
            <span>{document.metadata?.wordCount || 0} words</span>
            {document.metadata?.status && (
              <>
                <span className="text-foreground-muted/30">•</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(document.metadata.status)}`}>
                  {document.metadata.status}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onContextMenu(e, 'document', document._id)
        }}
        className={`p-1.5 rounded-full transition-all duration-300 ${
          isHovered ? 'bg-primary-subtle scale-110' : 'bg-surface'
        }`}
      >
        <EllipsisVerticalIcon className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300" />
      </button>
    </div>
  )
}