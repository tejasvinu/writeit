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

interface ExplorerItemProps {
  id: string
  title: string
  isFolder: boolean
  path: string
  updatedAt: string
  onFolderClick?: (path: string) => void
  onContextMenu: (e: React.MouseEvent, type: 'document' | 'folder', id: string) => void
}

export function ExplorerItem({
  id,
  title,
  isFolder,
  path,
  updatedAt,
  onFolderClick,
  onContextMenu,
}: ExplorerItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      onContextMenu={(e) => onContextMenu(e, isFolder ? 'folder' : 'document', id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center px-2 py-1.5 rounded-lg ${
        isFolder
          ? 'hover:bg-gray-100 cursor-pointer'
          : 'hover:bg-blue-50'
      }`}
      onClick={() => isFolder && onFolderClick?.(path)}
    >
      {isFolder ? (
        <FolderIcon className="w-5 h-5 text-gray-500 mr-2" />
      ) : (
        <DocumentIcon className="w-5 h-5 text-gray-500 mr-2" />
      )}

      {isFolder ? (
        <span className="flex-1 text-sm text-gray-700">{title}</span>
      ) : (
        <Link
          href={`/editor?id=${id}`}
          className="flex-1 text-sm text-gray-700 hover:text-blue-600"
        >
          {title}
        </Link>
      )}

      {isHovered && (
        <span className="text-xs text-gray-400">
          {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
        </span>
      )}
    </div>
  )
}

export function ExplorerHeader() {
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

  const handleCreateDocument = (isFolder: boolean) => {
    createDocument({
      title: isFolder ? 'New Folder' : 'Untitled',
      isFolder,
      parentPath: currentPath
    })
  }

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCreateDocument(false)}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <DocumentIcon className="w-5 h-5 mr-2" />
            New Document
          </button>
          <button
            onClick={() => handleCreateDocument(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FolderIcon className="w-5 h-5 mr-2" />
            New Folder
          </button>
        </div>

        <div className="flex items-center space-x-2 border-l pl-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Squares2X2Icon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as any)}
            className="ml-2 text-sm border rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export function FolderTree({ path }: { path: string }) {
  const { documents, currentPath, setCurrentPath } = useDocuments()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    '/root': true
  })

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
            className={`flex items-center p-2 rounded-lg cursor-pointer text-sm transition-colors duration-150
              ${currentPath === folder.path
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                : 'hover:bg-gray-100 text-gray-700'
              }`}
            onClick={() => setCurrentPath(folder.path)}
          >
            <button 
              className="mr-1 w-5 h-5 flex items-center justify-center text-gray-500"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(prev => ({ ...prev, [folder.path]: !prev[folder.path] }))
              }}
            >
              <ArrowDownIcon 
                className={`h-3 w-3 transform transition-transform ${expanded[folder.path] ? 'rotate-0' : '-rotate-90'}`} 
              />
            </button>
            <FolderIcon className="h-4 w-4 mr-1.5 text-gray-500" />
            <span className="truncate">{folder.title}</span>
          </div>
          
          {expanded[folder.path] && (
            <FolderTree path={folder.path} />
          )}
        </div>
      ))}
    </div>
  )
}