'use client'

import { useDocuments } from '@/context/DocumentContext'
import { SortOption } from '@/types/Document'
import { 
  DocumentIcon, 
  FolderIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon as ListIcon,
  ChevronDownIcon as ArrowDownIcon
} from '@heroicons/react/24/outline'
import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { createNewItem } from './index'
import { useRouter } from 'next/navigation'

interface ExplorerItemProps {
  id: string
  title: string
  isFolder: boolean
  path: string
  updatedAt: string
  onFolderClick?: (path: string) => void
  onContextMenu: (e: React.MouseEvent, type: 'document' | 'folder', id: string) => void
  onHover?: (id: string | null) => void
}

export function ExplorerItem({
  id,
  title,
  isFolder,
  path,
  updatedAt,
  onFolderClick,
  onContextMenu,
  onHover,
}: ExplorerItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onContextMenu={(e) => onContextMenu(e, isFolder ? 'folder' : 'document', id)}
      onMouseEnter={() => {
        setIsHovered(true)
        onHover?.(id)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        onHover?.(null)
      }}
      className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 group ${
        isFolder
          ? 'hover:bg-primary-subtle cursor-pointer'
          : 'hover:bg-primary-subtle'
      }`}
      onClick={() => isFolder && onFolderClick?.(path)}
    >
      {isFolder ? (
        <FolderIcon className="w-5 h-5 text-foreground-muted transition-colors duration-300 group-hover:text-primary mr-2" />
      ) : (
        <DocumentIcon className="w-5 h-5 text-foreground-muted transition-colors duration-300 group-hover:text-primary mr-2" />
      )}

      {isFolder ? (
        <span className="flex-1 text-sm text-foreground group-hover:text-primary-dark transition-colors duration-300">{title}</span>
      ) : (
        <Link
          href={`/editor?id=${id}`}
          className="flex-1 text-sm text-foreground hover:text-primary transition-colors duration-300 relative group"
        >
          {title}
          <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-light via-primary to-primary-light opacity-0 group-hover:w-full group-hover:opacity-100 transition-all duration-300"></span>
        </Link>
      )}

      <span className={`text-xs text-foreground-muted transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
      }`}>
        {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
      </span>
    </div>
  )
}

export function ExplorerHeader() {
  const router = useRouter()
  const {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortOption,
    setSortOption,
    createDocument,
    currentPath
  } = useDocuments()

  const handleCreateDocument = async (isFolder: boolean) => {
    const newDoc = await createNewItem(isFolder, currentPath, createDocument)
    if (newDoc && !isFolder) {
      router.push(`/editor?id=${newDoc._id}`)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-accent-subtle bg-surface-elevated/50 backdrop-blur-sm">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-accent-subtle rounded-lg 
              bg-surface/50 backdrop-blur-sm text-foreground placeholder-foreground-muted
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary-light/30
              transition-all duration-300"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-foreground-muted transition-colors duration-300 group-hover:text-primary" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCreateDocument(false)}
            className="flex items-center px-3 py-2 text-sm font-medium text-white 
              bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary
              rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105
              relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-3/4 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full"></div>
            <DocumentIcon className="w-5 h-5 mr-2 relative" />
            <span className="relative">New Document</span>
          </button>
          <button
            onClick={() => handleCreateDocument(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-primary-dark 
              border border-primary-light/30 hover:border-primary-light/50 rounded-lg 
              transition-all duration-300 relative overflow-hidden group hover:shadow-md"
          >
            <div className="absolute inset-0 w-0 bg-gradient-to-r from-primary-subtle to-transparent transition-all duration-300 group-hover:w-full"></div>
            <FolderIcon className="w-5 h-5 mr-2 relative" />
            <span className="relative">New Folder</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 border-l border-accent-subtle pl-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all duration-300 ${
              viewMode === 'grid' 
                ? 'bg-primary-subtle text-primary shadow-inner' 
                : 'text-foreground-muted hover:bg-primary-subtle/50 hover:text-primary'
            }`}
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all duration-300 ${
              viewMode === 'list' 
                ? 'bg-primary-subtle text-primary shadow-inner' 
                : 'text-foreground-muted hover:bg-primary-subtle/50 hover:text-primary'
            }`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="ml-2 text-sm border border-accent-subtle rounded-lg py-2 px-3 
              bg-surface/50 backdrop-blur-sm text-foreground
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary-light/30
              transition-all duration-300 cursor-pointer hover:border-primary-light/50"
          >
            <option value="name">Sort by name</option>
            <option value="updated">Sort by last updated</option>
            <option value="created">Sort by created date</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export function FolderTree({ path, onHover }: { path: string; onHover?: (id: string | null) => void }) {
  const { documents, currentPath, setCurrentPath } = useDocuments()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    '/root': true
  })
  const [hoveredFolder, setHoveredFolder] = useState<string | null>(null)

  // Get direct child folders of the current path
  const childFolders = documents.filter(doc => {
    const docParentPath = doc.path.substring(0, doc.path.lastIndexOf('/'))
    return doc.isFolder && docParentPath === path
  })

  // Sort folders by title
  const sortedFolders = [...childFolders].sort((a, b) => 
    a.title.localeCompare(b.title)
  )

  return (
    <div className={path === '/root' ? '' : 'ml-4'}>
      {sortedFolders.map(folder => (
        <div key={folder._id}>
          <div 
            className={`flex items-center p-2 rounded-lg cursor-pointer text-sm transition-all duration-300
              ${currentPath === folder.path
                ? 'bg-primary-subtle text-primary shadow-inner' 
                : 'hover:bg-primary-subtle/50 text-foreground hover:text-primary-dark'
              }`}
            onClick={() => setCurrentPath(folder.path)}
            onMouseEnter={() => {
              setHoveredFolder(folder._id)
              onHover?.(folder._id)
            }}
            onMouseLeave={() => {
              setHoveredFolder(null)
              onHover?.(null)
            }}
          >
            <button 
              className={`mr-1 w-5 h-5 flex items-center justify-center transition-colors duration-300
                ${hoveredFolder === folder._id ? 'text-primary' : 'text-foreground-muted'}`}
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(prev => ({ ...prev, [folder.path]: !prev[folder.path] }))
              }}
            >
              <ArrowDownIcon 
                className={`h-3 w-3 transform transition-all duration-300 ${expanded[folder.path] ? 'rotate-0' : '-rotate-90'}`} 
              />
            </button>
            <FolderIcon className={`h-4 w-4 mr-1.5 transition-colors duration-300
              ${hoveredFolder === folder._id ? 'text-primary' : 'text-foreground-muted'}`} />
            <span className="truncate">{folder.title}</span>
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ${expanded[folder.path] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
            <FolderTree path={folder.path} onHover={onHover} />
          </div>
        </div>
      ))}
    </div>
  )
}