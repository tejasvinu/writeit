'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DocumentMetadata, DocumentType, SortOption } from '@/types/Document'

interface IDocument {
  _id: string
  title: string
  content: string
  isFolder: boolean
  path: string
  createdAt: string
  updatedAt: string
  metadata?: DocumentMetadata
}

interface DocumentContextType {
  documents: IDocument[]
  currentDocument: IDocument | null
  currentPath: string
  isLoading: boolean
  error: string | null
  sortOption: SortOption
  viewMode: 'list' | 'grid'
  searchQuery: string
  setSortOption: (option: SortOption) => void
  setViewMode: (mode: 'list' | 'grid') => void
  setSearchQuery: (query: string) => void
  createDocument: (data: { title: string, isFolder?: boolean, parentPath?: string }) => Promise<IDocument>
  updateDocument: (id: string, data: Partial<IDocument>) => Promise<IDocument>
  deleteDocument: (id: string) => Promise<void>
  setCurrentDocument: (doc: IDocument | null) => void
  setCurrentPath: (path: string) => void
  fetchDocuments: () => Promise<void>
  loadDocument: (id: string) => Promise<void>
  saveDocument: (doc: IDocument) => Promise<IDocument>
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined)

interface DocumentProviderProps {
  children: ReactNode
}

interface SaveQueueItem {
  doc: IDocument;
  resolve: (value: IDocument | PromiseLike<IDocument>) => void;
  reject: (reason?: any) => void;
}

function DocumentProvider({ children }: DocumentProviderProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [documents, setDocuments] = useState<IDocument[]>([])
  const [currentDocument, setCurrentDocument] = useState<IDocument | null>(null)
  const [currentPath, setCurrentPath] = useState<string>('/root')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortOption, setSortOption] = useState<SortOption>('updatedAt')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [saveQueue, setSaveQueue] = useState<SaveQueueItem[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const fetchDocuments = async () => {
    if (!session) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/documents?path=${currentPath}`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch documents')
      const data = await response.json()
      setDocuments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents')
    } finally {
      setIsLoading(false)
    }
  }

  const createDocument = async (data: { title: string, isFolder?: boolean, parentPath?: string }): Promise<IDocument> => {
    if (!session) throw new Error('Not authenticated')

    const response = await fetch('/api/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: data.title,
        isFolder: data.isFolder || false,
        parentPath: data.parentPath || currentPath
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create document')
    }

    const newDocument = await response.json()
    setDocuments(prev => [...prev, newDocument])
    return newDocument
  }

  const updateDocument = async (id: string, data: Partial<IDocument>): Promise<IDocument> => {
    if (!session) throw new Error('Not authenticated')

    const response = await fetch(`/api/documents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update document')
    }

    const updatedDocument = await response.json()
    setDocuments(prev => 
      prev.map(doc => doc._id === id ? updatedDocument : doc)
    )
    
    if (currentDocument?._id === id) {
      setCurrentDocument(updatedDocument)
    }

    return updatedDocument
  }

  const deleteDocument = async (id: string): Promise<void> => {
    if (!session) throw new Error('Not authenticated')

    const response = await fetch(`/api/documents/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete document')
    }

    // Get the document that was deleted
    const deletedDoc = documents.find(doc => doc._id === id)
    if (!deletedDoc) return

    // Remove the document and all its descendants from the state
    setDocuments(prev => prev.filter(doc => !doc.path.startsWith(deletedDoc.path)))

    if (currentDocument?._id === id) {
      setCurrentDocument(null)
    }
  }

  const fetchDocumentById = async (id: string): Promise<IDocument> => {
    const response = await fetch(`/api/documents/${id}`, {
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to fetch document');
    const data = await response.json();
    return data.document;
  };

  const loadDocument = async (id: string) => {
    if (!session) return;
    setIsLoading(true);
    try {
      const doc = documents.find(doc => doc._id === id) || await fetchDocumentById(id);
      setCurrentDocument(doc);
      // Set current path to document's parent path
      const parentPath = doc.path.substring(0, doc.path.lastIndexOf('/'));
      setCurrentPath(parentPath);
    } catch (error) {
      console.error('Failed to load document:', error);
      setError('Failed to load document');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const processSaveQueue = async () => {
      if (isSaving || saveQueue.length === 0) return;

      setIsSaving(true);
      const { doc, resolve, reject } = saveQueue[0];

      try {
        const response = await fetch(`/api/documents/${doc._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            content: doc.content,
            title: doc.title,
            metadata: doc.metadata,
            updatedAt: doc.updatedAt
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to save document');
        }

        const savedDoc = await response.json();
        
        setDocuments(prev => prev.map(d => d._id === savedDoc._id ? savedDoc : d));
        if (currentDocument?._id === savedDoc._id) {
          setCurrentDocument(savedDoc);
        }

        resolve(savedDoc);
      } catch (error) {
        reject(error);
      } finally {
        setIsSaving(false);
        setSaveQueue(prev => prev.slice(1));
      }
    };

    processSaveQueue();
  }, [saveQueue, isSaving, currentDocument]);

  const saveDocument = useCallback(async (doc: IDocument): Promise<IDocument> => {
    if (!session) throw new Error('Not authenticated');

    return new Promise((resolve, reject) => {
      setSaveQueue(prev => [...prev, { doc, resolve, reject }]);
    });
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchDocuments()
    }
  }, [session, currentPath])

  return (
    <DocumentContext.Provider value={{
      documents,
      currentDocument,
      currentPath,
      isLoading,
      error,
      sortOption,
      viewMode,
      searchQuery,
      setSortOption,
      setViewMode,
      setSearchQuery,
      createDocument,
      updateDocument,
      deleteDocument,
      setCurrentDocument,
      setCurrentPath,
      fetchDocuments,
      loadDocument,
      saveDocument
    }}>
      {children}
    </DocumentContext.Provider>
  )
}

const useDocuments = () => {
  const context = useContext(DocumentContext)
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider')
  }
  return context
}

export { DocumentProvider, useDocuments }