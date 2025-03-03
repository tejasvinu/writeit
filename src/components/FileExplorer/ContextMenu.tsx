'use client'

import { useEffect, useRef, useState } from 'react'
import {
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  FolderIcon,
  DocumentIcon,
  DocumentPlusIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline'

interface ContextMenuProps {
  x: number
  y: number
  type: 'document' | 'folder' | 'background'
  onClose: () => void
  onRename?: (newTitle: string) => void
  onDelete?: () => void
  onCreateNew?: (isFolder: boolean) => void
}

interface MenuItemProps {
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>
  label: string
  onClick?: () => void
  shortcut?: string
  destructive?: boolean
}

export default function ContextMenu({
  x,
  y,
  type,
  onClose,
  onRename,
  onDelete,
  onCreateNew,
}: ContextMenuProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleRename = () => {
    if (newTitle.trim()) {
      onRename?.(newTitle.trim())
    }
    setIsRenaming(false)
  }

  const MenuItem = ({ icon: Icon, label, onClick, shortcut, destructive = false }: MenuItemProps) => (
    <button
      onClick={() => onClick?.()}
      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center justify-between group ${
        destructive ? 'text-red-600 hover:bg-red-50' : ''
      }`}
    >
      <div className="flex items-center">
        <Icon className="w-4 h-4 mr-3" />
        {label}
      </div>
      {shortcut && (
        <span className="text-xs text-gray-400 group-hover:text-gray-500">{shortcut}</span>
      )}
    </button>
  )

  return (
    <div
      ref={menuRef}
      className="fixed bg-white rounded-lg shadow-lg border py-1 w-64 z-50"
      style={{ top: y, left: x }}
      onClick={(e) => e.stopPropagation()}
    >
      {type === 'background' ? (
        <>
          <MenuItem
            icon={DocumentPlusIcon}
            label="New Document"
            onClick={() => onCreateNew?.(false)}
            shortcut="Ctrl+N"
          />
          <MenuItem
            icon={FolderIcon}
            label="New Folder"
            onClick={() => onCreateNew?.(true)}
            shortcut="Ctrl+Shift+N"
          />
        </>
      ) : (
        <>
          {isRenaming ? (
            <div className="px-4 py-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename()
                  if (e.key === 'Escape') setIsRenaming(false)
                }}
                className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new name"
                autoFocus
              />
            </div>
          ) : (
            <>
              {type === 'document' && (
                <MenuItem
                  icon={DocumentDuplicateIcon}
                  label="Duplicate"
                  onClick={() => {}} // TODO: Implement duplicate
                  shortcut="Ctrl+D"
                />
              )}
              <MenuItem
                icon={PencilIcon}
                label="Rename"
                onClick={() => {
                  setIsRenaming(true)
                  setNewTitle('')
                }}
                shortcut="F2"
              />
              <MenuItem
                icon={TrashIcon}
                label="Delete"
                onClick={onDelete}
                shortcut={type === 'document' ? 'Del' : 'Shift+Del'}
                destructive
              />
            </>
          )}
        </>
      )}
    </div>
  )
}