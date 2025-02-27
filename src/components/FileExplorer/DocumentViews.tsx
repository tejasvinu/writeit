'use client'

import { DocumentIcon, EllipsisVerticalIcon, FolderIcon, ClockIcon, CalendarIcon, DocumentTextIcon, PlusIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { useDocuments } from '@/context/DocumentContext'
import ContextMenu from './ContextMenu'
import { Document, DocumentMetadata, DocumentType, ViewMode } from '@/types/Document'
import { MouseEvent } from 'react'

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
}

export function DocumentViews({ documents, onContextMenu, onFolderClick }: DocumentViewsProps) {
  const { viewMode, currentPath, createDocument } = useDocuments();

  // Filter documents based on current path
  const currentDocuments = documents.filter(doc => {
    const parentPath = doc.path.substring(0, doc.path.lastIndexOf('/'));
    return parentPath === currentPath;
  });

  // Separate folders and documents
  const folders = currentDocuments.filter(doc => doc.isFolder);
  const docs = currentDocuments.filter(doc => !doc.isFolder);

  const handleSelect = (doc: LocalDocument) => {
    if (doc.isFolder) {
      onFolderClick(doc);
    } else {
      window.location.href = `/editor?id=${doc._id}`;
    }
  };

  return (
    <div className="p-4">
      {/* Path breadcrumb */}
      <div className="mb-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {currentPath.split('/').map((segment, index, arr) => {
              if (!segment) return null;
              const path = arr.slice(0, index + 1).join('/');
              return (
                <li key={path}>
                  <div className="flex items-center">
                    {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                    <button
                      onClick={() => {
                        const doc = documents.find(d => d.path === path);
                        if (doc) onFolderClick(doc);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {segment}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Folders section */}
      {folders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-3">Folders</h2>
          <div className="grid grid-cols-1 gap-2">
            {folders.map((folder) => (
              <div
                key={folder._id}
                onClick={() => handleSelect(folder)}
                onContextMenu={(e) => onContextMenu(e, 'folder', folder._id)}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 border cursor-pointer group"
              >
                <FolderIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">{folder.title}</h3>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(folder.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                <EllipsisVerticalIcon className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents section */}
      {docs.length > 0 ? (
        <div>
          <h2 className="text-sm font-medium text-gray-500 mb-3">Documents</h2>
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-2'
          }>
            {docs.map((doc) => (
              <DocumentItem
                key={doc._id}
                document={doc}
                viewMode={viewMode}
                onSelect={() => handleSelect(doc)}
                onContextMenu={onContextMenu}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new document.</p>
          <div className="mt-6">
            <button
              onClick={() => createDocument({ title: 'Untitled', parentPath: currentPath })}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              New Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface DocumentItemProps {
  document: LocalDocument
  viewMode: ViewMode
  onSelect: () => void
  onContextMenu: (e: React.MouseEvent, type: 'document' | 'folder', id: string) => void
}

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'draft': return 'bg-yellow-100 text-yellow-800'
    case 'revision': return 'bg-blue-100 text-blue-800'
    case 'final': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getTypeColor = (type?: DocumentType) => {
  switch (type) {
    case 'chapter': return 'bg-purple-50 text-purple-600'
    case 'scene': return 'bg-blue-50 text-blue-600'
    case 'character': return 'bg-green-50 text-green-600'
    case 'plotline': return 'bg-orange-50 text-orange-600'
    case 'note': return 'bg-gray-50 text-gray-600'
    default: return 'bg-gray-50 text-gray-600'
  }
}

function DocumentItem({ document, viewMode, onSelect, onContextMenu }: DocumentItemProps) {
  if (viewMode === 'grid') {
    return (
      <div
        onClick={onSelect}
        onContextMenu={(e) => onContextMenu(e, 'document', document._id)}
        className="p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition-all duration-150 hover:shadow-md hover:-translate-y-0.5"
      >
        <div className={`flex items-center justify-center w-full h-32 rounded-lg mb-3 ${getTypeColor(document.metadata?.type)}`}>
          <DocumentIcon className="w-12 h-12" />
        </div>
        <h3 className="font-medium truncate mb-2 text-gray-900">{document.title}</h3>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-gray-500">{document.metadata?.wordCount || 0} words</span>
          {document.metadata?.status && (
            <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(document.metadata.status)}`}>
              {document.metadata.status}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
        </p>
      </div>
    );
  }

  return (
    <div
      onClick={onSelect}
      onContextMenu={(e) => onContextMenu(e, 'document', document._id)}
      className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-150 hover:bg-gray-50"
    >
      <div className="flex items-center space-x-3 flex-grow min-w-0">
        <div className={`p-2 rounded-lg ${getTypeColor(document.metadata?.type)}`}>
          <DocumentIcon className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-grow">
          <h3 className="font-medium truncate text-gray-900">{document.title}</h3>
          <div className="flex items-center space-x-2 text-sm mt-0.5">
            <span className="text-gray-500">
              {formatDistanceToNow(new Date(document.updatedAt), { addSuffix: true })}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500">{document.metadata?.wordCount || 0} words</span>
            {document.metadata?.status && (
              <>
                <span className="text-gray-300">•</span>
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
          e.stopPropagation();
          onContextMenu(e, 'document', document._id);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors duration-150"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>
    </div>
  );
}