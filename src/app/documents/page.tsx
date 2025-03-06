'use client'

import FileExplorer from "@/components/FileExplorer";
import { useDocuments } from "@/context/DocumentContext";
import { DocumentPlusIcon, FolderPlusIcon } from '@heroicons/react/24/outline';
import { DocumentType } from "@/types/Document";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DocumentsPage() {
  const router = useRouter();
  const { createDocument, currentPath } = useDocuments();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState<DocumentType>('chapter');

  const handleCreateDocument = async () => {
    const newDoc = await createDocument({
      title: 'New Document',
      isFolder: false,
      parentPath: currentPath
    });
    setIsCreatingDocument(false);
    router.push(`/editor/${newDoc._id}`);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      await createDocument({
        title: newFolderName.trim(),
        isFolder: true,
        parentPath: currentPath
      });
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header with actions */}
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <FileExplorer />
      </div>
    </div>
  )
}