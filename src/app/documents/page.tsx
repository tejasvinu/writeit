'use client'

import FileExplorer from "@/components/FileExplorer";
import { useDocuments } from "@/context/DocumentContext";
import { DocumentPlusIcon, FolderPlusIcon } from '@heroicons/react/24/outline';
import { DocumentType } from "@/types/Document";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DocumentsPage() {
  const router = useRouter();
  const { createDocument, createFolder, currentFolder } = useDocuments();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState<DocumentType>('chapter');

  const handleCreateDocument = () => {
    const newDoc = createDocument(currentFolder?.id, newDocumentType);
    setIsCreatingDocument(false);
    router.push(`/editor?doc=${newDoc.id}`);
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header with actions */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-serif text-gray-900">Novel Documents</h1>
            <div className="flex items-center space-x-4">
              {isCreatingDocument ? (
                <div className="flex items-center space-x-2">
                  <select
                    value={newDocumentType}
                    onChange={(e) => setNewDocumentType(e.target.value as DocumentType)}
                    className="border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="chapter">Chapter</option>
                    <option value="scene">Scene</option>
                    <option value="character">Character Profile</option>
                    <option value="plotline">Plot Line</option>
                    <option value="note">Note</option>
                  </select>
                  <button
                    onClick={handleCreateDocument}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 shadow-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setIsCreatingDocument(false)}
                    className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingDocument(true)}
                  className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors duration-150 shadow-sm"
                >
                  <DocumentPlusIcon className="w-5 h-5" />
                  <span>New Document</span>
                </button>
              )}
              
              {isCreatingFolder ? (
                <form onSubmit={handleCreateFolder} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="Folder name..."
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-150 shadow-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setIsCreatingFolder(false)}
                    className="text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                    type="button"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsCreatingFolder(true)}
                  className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors duration-150 shadow-sm"
                >
                  <FolderPlusIcon className="w-5 h-5" />
                  <span>New Folder</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <FileExplorer />
      </div>
    </div>
  )
}