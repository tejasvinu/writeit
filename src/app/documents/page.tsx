'use client'

import FileExplorer from "@/components/FileExplorer";
import { useDocuments } from "@/context/DocumentContext";
import { DocumentType } from "@/types/Document";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function DocumentsPage() {
  const router = useRouter();
  const { status } = useSession();
  const { createDocument, currentPath, fetchDocuments } = useDocuments();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [newDocumentType, setNewDocumentType] = useState<DocumentType>('chapter');
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Only handle auth check once to avoid loops
    if (!initialLoadComplete) {
      setInitialLoadComplete(true);

      // Let the middleware handle redirects for unauthorized users
      if (status === 'authenticated') {
        fetchDocuments().then(() => {
          setIsLoading(false);
        });
      } else if (status === 'unauthenticated') {
        // Let the middleware handle redirects
        setIsLoading(false);
      }
    }
  }, [status, fetchDocuments, initialLoadComplete]);

  // When status changes to authenticated after initial load
  useEffect(() => {
    if (initialLoadComplete && status === 'authenticated') {
      fetchDocuments().then(() => {
        setIsLoading(false);
      });
    }
  }, [status, initialLoadComplete, fetchDocuments]);

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

  // Show loading state only during initial load
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-stone-100 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
          <div className="w-16 h-20 bg-amber-700 dark:bg-amber-600 rounded-sm animate-book-bounce"></div>
          <div className="absolute top-0 left-0 w-16 h-20 border-r-4 border-amber-900 dark:border-amber-800 rounded-sm animate-page-turn"></div>
          <p className="text-amber-800 dark:text-amber-400 mt-4">Loading your documents...</p>
        </div>
      </div>
    );
  }

  // For unauthenticated state, middleware should handle redirect

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <FileExplorer />
      </div>
    </div>
  )
}